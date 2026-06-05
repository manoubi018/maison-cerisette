"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

import type { User } from "@/features/users/types"
import { buildGuestEmail } from "@/lib/security/guest-session"

const ACCOUNT_SESSION_KEY = "account-session-v1"
const GUEST_PROFILE_KEY = "guest-profile-v1"
const PRESENCE_HEARTBEAT_INTERVAL_MS = 60_000
let presenceTrackingSupported: boolean | null = null

export interface AccountProfileInput {
  fullName: string
  email: string
  phone: string
  image: string
}

type GuestAccount = {
  mode: "guest"
  guestSessionId: string
  guestUserId?: number
  profile: AccountProfileInput
  user: User | null
}

type AuthenticatedAccount = {
  mode: "authenticated"
  guestSessionId: string
  guestUserId?: number
  profile: AccountProfileInput
  user: User
}

export type CurrentAccount = GuestAccount | AuthenticatedAccount

type SignInInput = {
  identifier: string
  password: string
}

type SignUpInput = {
  fullName: string
  email: string
  phone: string
  password: string
}

type StoredAccountSession =
  | {
      mode: "guest"
      guestSessionId: string
      guestUserId?: number
    }
  | {
      mode: "authenticated"
      guestSessionId: string
      guestUserId?: number
      userId: number
    }

interface AccountContextType {
  currentAccount: CurrentAccount
  loaded: boolean
  signIn: (input: SignInInput) => Promise<User>
  signUp: (input: SignUpInput) => Promise<User>
  signOut: () => void
  refreshAccount: () => Promise<void>
  updateProfile: (input: Partial<AccountProfileInput>) => Promise<void>
  ensureGuestUser: (profile?: Partial<AccountProfileInput>) => Promise<number>
  updatePassword: (input: { currentPassword?: string; newPassword: string }) => Promise<void>
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

const emptyProfile: AccountProfileInput = {
  fullName: "",
  email: "",
  phone: "",
  image: "",
}

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "")
}

function createGuestSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function sanitizeProfile(input?: Partial<AccountProfileInput>) {
  return {
    fullName: input?.fullName?.trim() ?? "",
    email: input?.email?.trim().toLowerCase() ?? "",
    phone: normalizePhone(input?.phone ?? ""),
    image: input?.image?.trim() ?? "",
  }
}

function readGuestProfile() {
  const raw = localStorage.getItem(GUEST_PROFILE_KEY)
  if (!raw) {
    const legacy = localStorage.getItem("profile-settings")
    if (!legacy) {
      return emptyProfile
    }

    try {
      const parsed = JSON.parse(legacy) as Partial<AccountProfileInput>
      const nextProfile = sanitizeProfile(parsed)
      localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(nextProfile))
      return nextProfile
    } catch {
      return emptyProfile
    }
  }

  try {
    return sanitizeProfile(JSON.parse(raw) as Partial<AccountProfileInput>)
  } catch {
    return emptyProfile
  }
}

function writeGuestProfile(profile: AccountProfileInput) {
  localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile))
}

function readStoredSession(): StoredAccountSession | null {
  const raw = localStorage.getItem(ACCOUNT_SESSION_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as StoredAccountSession
  } catch {
    return null
  }
}

function writeStoredSession(session: StoredAccountSession) {
  localStorage.setItem(ACCOUNT_SESSION_KEY, JSON.stringify(session))
}

function stripPresenceFields<T extends Record<string, unknown>>(input: T) {
  const nextInput = { ...input }
  delete nextInput.isOnline
  delete nextInput.lastSeen
  return nextInput
}

function hasPresenceFields(input: Record<string, unknown>) {
  return "isOnline" in input || "lastSeen" in input
}

function isPresenceSchemaError(message?: string | null) {
  const normalized = message?.toLowerCase() ?? ""
  return (
    normalized.includes("is_online") ||
    normalized.includes("last_seen") ||
    normalized.includes("schema cache")
  )
}

function isPresenceServerFailure(message?: string | null) {
  const normalized = message?.toLowerCase() ?? ""
  return (
    normalized === "internal server error" ||
    normalized.includes("unable to update account (500)") ||
    normalized.includes("unable to create account (500)") ||
    normalized.includes("presence tracking is not available")
  )
}

function getGuestSessionHeaders(guestSessionId: string) {
  return {
    "x-guest-session-id": guestSessionId,
  }
}

async function fetchGuestUserById(userId: number, guestSessionId: string) {
  const response = await fetch(`/api/users/${userId}`, {
    cache: "no-store",
    headers: getGuestSessionHeaders(guestSessionId),
  })

  if (!response.ok) {
    throw new Error(`Unable to load account (${response.status})`)
  }

  return (await response.json()) as User
}

async function fetchAuthenticatedUser() {
  const response = await fetch("/api/auth/session", { cache: "no-store" })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Unable to load account (${response.status})`)
  }

  return (await response.json()) as User
}

async function createUser(input: {
  nom: string
  email: string
  telephone: string
  image?: string
  isOnline?: boolean
  lastSeen?: string | null
}, guestSessionId: string) {
  const requestBody =
    presenceTrackingSupported === false ? stripPresenceFields(input) : input

  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getGuestSessionHeaders(guestSessionId),
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null

    if (
      hasPresenceFields(requestBody) &&
      (isPresenceSchemaError(payload?.message) || isPresenceServerFailure(payload?.message))
    ) {
      presenceTrackingSupported = false
      return createUser(stripPresenceFields(input), guestSessionId)
    }

    throw new Error(payload?.message ?? `Unable to create account (${response.status})`)
  }

  presenceTrackingSupported = true

  return (await response.json()) as User
}

async function patchUser(
  path: string,
  input: Partial<{
  nom: string
  email: string
  telephone: string
  image: string
  isOnline: boolean
  lastSeen: string | null
}>,
  init?: Pick<RequestInit, "keepalive"> & {
    guestSessionId?: string
  },
) {
  const requestBody =
    presenceTrackingSupported === false ? stripPresenceFields(input) : input

  const response = await fetch(path, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(init?.guestSessionId ? getGuestSessionHeaders(init.guestSessionId) : {}),
    },
    body: JSON.stringify(requestBody),
    keepalive: init?.keepalive,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null

    if (
      hasPresenceFields(requestBody) &&
      (isPresenceSchemaError(payload?.message) || isPresenceServerFailure(payload?.message))
    ) {
      presenceTrackingSupported = false
      const fallbackInput = stripPresenceFields(input)

      if (Object.keys(fallbackInput).length === 0) {
        throw new Error(payload?.message ?? "Presence tracking is not available")
      }

      return patchUser(path, fallbackInput, init)
    }

    throw new Error(payload?.message ?? `Unable to update account (${response.status})`)
  }

  presenceTrackingSupported = true

  return (await response.json()) as User
}

async function signInWithPassword(input: { identifier: string; password: string }) {
  const response = await fetch("/api/auth/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message ?? `Unable to sign in (${response.status})`)
  }

  return (await response.json()) as User
}

async function signUpWithPassword(input: {
  fullName: string
  email: string
  phone: string
  password: string
  guestUserId?: number
  guestSessionId?: string
}) {
  const response = await fetch("/api/auth/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(input.guestSessionId ? getGuestSessionHeaders(input.guestSessionId) : {}),
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message ?? `Unable to create account (${response.status})`)
  }

  return (await response.json()) as User
}

async function updateUserPassword(input: {
  currentPassword?: string
  newPassword: string
}) {
  const response = await fetch("/api/auth/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message ?? `Unable to update password (${response.status})`)
  }

  return (await response.json()) as User
}

async function setUserPresence(
  target:
    | { mode: "authenticated" }
    | { mode: "guest"; userId: number; guestSessionId: string },
  isOnline: boolean,
  options?: {
    keepalive?: boolean
  },
) {
  if (presenceTrackingSupported === false) {
    return null
  }

  const presenceUpdate: Partial<{
    isOnline: boolean
    lastSeen: string | null
  }> = {
    isOnline,
    lastSeen: new Date().toISOString(),
  }

  try {
    const patchPath = target.mode === "authenticated" ? "/api/account" : `/api/users/${target.userId}`

    return await patchUser(
      patchPath,
      presenceUpdate,
      {
        keepalive: options?.keepalive,
        guestSessionId: target.mode === "guest" ? target.guestSessionId : undefined,
      },
    )
  } catch (error) {
    if (error instanceof Error && (isPresenceSchemaError(error.message) || isPresenceServerFailure(error.message))) {
      presenceTrackingSupported = false
      console.warn("Presence tracking has been disabled because the backend schema is not ready yet.")
      return null
    }

    console.warn("Could not update user presence:", error)
    return null
  }
}

function toProfile(user: User | null, fallback: AccountProfileInput) {
  if (!user) {
    return fallback
  }

  return {
    fullName: user.nom,
    email: user.email,
    phone: user.telephone,
    image: user.image ?? fallback.image,
  }
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)
  const [session, setSession] = useState<StoredAccountSession | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [guestProfile, setGuestProfile] = useState<AccountProfileInput>(emptyProfile)

  useEffect(() => {
    let cancelled = false

    const hydrateAccount = async () => {
      const storedProfile = readGuestProfile()
      const storedSession = readStoredSession() ?? {
        mode: "guest" as const,
        guestSessionId: createGuestSessionId(),
      }

      writeStoredSession(storedSession)

      if (!cancelled) {
        setGuestProfile(storedProfile)
        setSession(storedSession)
      }

      try {
        const restoredAuthenticatedUser = await fetchAuthenticatedUser()

        if (restoredAuthenticatedUser) {
          const nextSession: StoredAccountSession = {
            mode: "authenticated",
            guestSessionId: storedSession.guestSessionId,
            guestUserId: storedSession.guestUserId,
            userId: restoredAuthenticatedUser.id,
          }
          const nextUser =
            (await setUserPresence({ mode: "authenticated" }, true)) ?? restoredAuthenticatedUser
          if (!cancelled) {
            writeStoredSession(nextSession)
            setSession(nextSession)
            setUser(nextUser)
          }
          return
        }

        if (storedSession.guestUserId) {
          const nextUser = await fetchGuestUserById(
            storedSession.guestUserId,
            storedSession.guestSessionId,
          )
          if (!cancelled) {
            const guestSession: StoredAccountSession = {
              mode: "guest",
              guestSessionId: storedSession.guestSessionId,
              guestUserId: storedSession.guestUserId,
            }
            writeStoredSession(guestSession)
            setSession(guestSession)
            setUser(nextUser)
          }
        } else if (!cancelled) {
          const guestSession: StoredAccountSession = {
            mode: "guest",
            guestSessionId: storedSession.guestSessionId,
          }
          writeStoredSession(guestSession)
          setSession(guestSession)
        }
      } catch (error) {
        console.error("Could not restore account:", error)
        if (!cancelled) {
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setLoaded(true)
        }
      }
    }

    void hydrateAccount()

    return () => {
      cancelled = true
    }
  }, [])

  const currentAccount = useMemo<CurrentAccount>(() => {
    const activeSession = session ?? {
      mode: "guest" as const,
      guestSessionId: "guest-loading",
    }

    if (activeSession.mode === "authenticated" && user) {
      return {
        mode: "authenticated",
        guestSessionId: activeSession.guestSessionId,
        guestUserId: activeSession.guestUserId,
        profile: toProfile(user, guestProfile),
        user,
      }
    }

    return {
      mode: "guest",
      guestSessionId: activeSession.guestSessionId,
      guestUserId: activeSession.guestUserId,
      profile: toProfile(user, guestProfile),
      user,
    }
  }, [guestProfile, session, user])

  const refreshAccount = async () => {
    if (!session) {
      return
    }

    if (session.mode === "authenticated") {
      const nextUser = await fetchAuthenticatedUser()

      if (!nextUser) {
        const nextSession: StoredAccountSession = {
          mode: "guest",
          guestSessionId: session.guestSessionId,
          guestUserId: session.guestUserId,
        }
        writeStoredSession(nextSession)
        setSession(nextSession)
        setUser(null)
        return
      }

      setUser(nextUser)
      return
    }

    if (session.guestUserId) {
      const nextUser = await fetchGuestUserById(session.guestUserId, session.guestSessionId)
      setUser(nextUser)
    }
  }

  const ensureGuestUser = async (profile?: Partial<AccountProfileInput>) => {
    const activeSession = session ?? {
      mode: "guest" as const,
      guestSessionId: createGuestSessionId(),
    }

    const nextProfile = sanitizeProfile({
      ...guestProfile,
      ...profile,
    })

    setGuestProfile(nextProfile)
    writeGuestProfile(nextProfile)

    if (activeSession.guestUserId) {
      const patchPayload: Record<string, string> = {}

      if (nextProfile.fullName) {
        patchPayload.nom = nextProfile.fullName
      }

      if (nextProfile.phone) {
        patchPayload.telephone = nextProfile.phone
      }

      if (nextProfile.image) {
        patchPayload.image = nextProfile.image
      }

      if (Object.keys(patchPayload).length > 0) {
        const nextUser = await patchUser(`/api/users/${activeSession.guestUserId}`, patchPayload, {
          guestSessionId: activeSession.guestSessionId,
        })
        setUser(nextUser)
      }

      return activeSession.guestUserId
    }

    const createdUser = await createUser({
      nom: nextProfile.fullName || "Guest Customer",
      email: buildGuestEmail(activeSession.guestSessionId),
      telephone: nextProfile.phone || `guest-${activeSession.guestSessionId.slice(0, 8)}`,
      image: nextProfile.image || undefined,
      isOnline: false,
      lastSeen: new Date().toISOString(),
    }, activeSession.guestSessionId)

    const nextSession: StoredAccountSession = {
      mode: "guest",
      guestSessionId: activeSession.guestSessionId,
      guestUserId: createdUser.id,
    }

    writeStoredSession(nextSession)
    setSession(nextSession)
    setUser(createdUser)

    return createdUser.id
  }

  const signIn = async ({ identifier, password }: SignInInput) => {
    const existingUser = await signInWithPassword({ identifier, password })

    const activeGuestSessionId =
      session?.guestSessionId && session.guestSessionId !== "guest-loading"
        ? session.guestSessionId
        : createGuestSessionId()

    const nextSession: StoredAccountSession = {
      mode: "authenticated",
      guestSessionId: activeGuestSessionId,
      guestUserId: session?.guestUserId,
      userId: existingUser.id,
    }

    const nextUser = (await setUserPresence({ mode: "authenticated" }, true)) ?? existingUser

    writeStoredSession(nextSession)
    setSession(nextSession)
    setUser(nextUser)
    return nextUser
  }

  const signUp = async ({ fullName, email, phone, password }: SignUpInput) => {
    const activeGuestSessionId =
      session?.guestSessionId && session.guestSessionId !== "guest-loading"
        ? session.guestSessionId
        : createGuestSessionId()

    const normalizedInput = sanitizeProfile({
      ...guestProfile,
      fullName,
      email,
      phone,
    })
    const nextUser = await signUpWithPassword({
      fullName: normalizedInput.fullName,
      email: normalizedInput.email,
      phone: normalizedInput.phone,
      password,
      guestUserId:
        session?.mode === "guest" && session.guestUserId ? session.guestUserId : undefined,
      guestSessionId: activeGuestSessionId,
    })

    const nextSession: StoredAccountSession = {
      mode: "authenticated",
      guestSessionId: activeGuestSessionId,
      guestUserId: session?.guestUserId,
      userId: nextUser.id,
    }

    writeStoredSession(nextSession)
    writeGuestProfile(normalizedInput)
    setGuestProfile(normalizedInput)
    setSession(nextSession)
    setUser(nextUser)

    return nextUser
  }

  const updatePassword = async (input: { currentPassword?: string; newPassword: string }) => {
    if (currentAccount.mode !== "authenticated") {
      throw new Error("You must be signed in to update the password")
    }

    const nextUser = await updateUserPassword({
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
    })

    setUser(nextUser)
  }

  const signOut = () => {
    if (currentAccount.mode === "authenticated") {
      void setUserPresence({ mode: "authenticated" }, false)
      void fetch("/api/auth/sign-out", { method: "POST" }).catch(() => null)
    }

    const nextSession: StoredAccountSession = {
      mode: "guest",
      guestSessionId: createGuestSessionId(),
    }

    localStorage.removeItem(GUEST_PROFILE_KEY)
    writeStoredSession(nextSession)
    setGuestProfile(emptyProfile)
    setSession(nextSession)
    setUser(null)
  }

  useEffect(() => {
    if (!loaded || currentAccount.mode !== "authenticated") {
      return
    }

    const sendHeartbeat = () => {
      void setUserPresence({ mode: "authenticated" }, true)
    }

    const markOffline = () => {
      void setUserPresence({ mode: "authenticated" }, false, { keepalive: true })
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sendHeartbeat()
        return
      }

      markOffline()
    }

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        sendHeartbeat()
      }
    }, PRESENCE_HEARTBEAT_INTERVAL_MS)

    sendHeartbeat()
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("pagehide", markOffline)
    window.addEventListener("beforeunload", markOffline)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", markOffline)
      window.removeEventListener("beforeunload", markOffline)
    }
  }, [currentAccount, loaded])

  const updateProfile = async (input: Partial<AccountProfileInput>) => {
    const nextProfile = sanitizeProfile({
      ...currentAccount.profile,
      ...input,
    })

    if (currentAccount.mode === "authenticated") {
      const nextUser = await patchUser("/api/account", {
        nom: nextProfile.fullName,
        email: nextProfile.email,
        telephone: nextProfile.phone,
        image: nextProfile.image,
      })

      writeGuestProfile(nextProfile)
      setGuestProfile(nextProfile)
      setUser(nextUser)
      return
    }

    writeGuestProfile(nextProfile)
    setGuestProfile(nextProfile)

    if (currentAccount.guestUserId) {
      const patchPayload: Record<string, string> = {}

      if (nextProfile.fullName) {
        patchPayload.nom = nextProfile.fullName
      }

      if (nextProfile.phone) {
        patchPayload.telephone = nextProfile.phone
      }

      if (nextProfile.image) {
        patchPayload.image = nextProfile.image
      }

      if (Object.keys(patchPayload).length > 0) {
        const nextUser = await patchUser(`/api/users/${currentAccount.guestUserId}`, patchPayload, {
          guestSessionId: currentAccount.guestSessionId,
        })
        setUser(nextUser)
      }
    }
  }

  return (
    <AccountContext.Provider
      value={{
        currentAccount,
        loaded,
        signIn,
        signUp,
        signOut,
        refreshAccount,
        updateProfile,
        ensureGuestUser,
        updatePassword,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useCurrentAccount() {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error("useCurrentAccount must be used within AccountProvider")
  }

  return context
}

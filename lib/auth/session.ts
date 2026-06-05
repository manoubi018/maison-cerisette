import "server-only"

import { createHash, randomBytes } from "node:crypto"

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { userSessionRepository } from "@/features/sessions/repository"
import type { UserSession } from "@/features/sessions/types"
import { userRepository } from "@/features/users/repository"
import type { User } from "@/features/users/types"
import { Role } from "@/features/users/types"
import { HttpError } from "@/lib/errors/http-error"

export const AUTH_SESSION_COOKIE = "maison-cerisette-client-session"
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

type AuthenticatedAccount = {
  session: UserSession
  user: User
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

function isSessionExpired(session: UserSession) {
  return new Date(session.expiresAt).getTime() <= Date.now()
}

function shouldInvalidateSession(user: User, session: UserSession) {
  if (!user.passwordUpdatedAt) {
    return false
  }

  return new Date(user.passwordUpdatedAt).getTime() > new Date(session.createdAt).getTime()
}

function isClientAccountAllowed(user: User) {
  const normalizedStatus = user.statut.trim().toLowerCase()
  return normalizedStatus !== "disabled" && normalizedStatus !== "blocked" && normalizedStatus !== "suspended"
}

export async function createUserSession(userId: number) {
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString()
  const session = await userSessionRepository.create({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  })

  if (!session) {
    throw new HttpError(500, "Could not create a session")
  }

  return { token, session }
}

export function applySessionCookie(response: NextResponse, token: string, expiresAt: string) {
  response.cookies.set(AUTH_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(AUTH_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })
}

export async function getAuthenticatedAccount(options?: { touch?: boolean }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value

  if (!token) {
    return null
  }

  const session = await userSessionRepository.findByTokenHash(hashToken(token))

  if (!session) {
    return null
  }

  if (session.revokedAt || isSessionExpired(session)) {
    await userSessionRepository.revoke(session.id)
    return null
  }

  const account = await userRepository.findAuthById(session.userId)

  if (!account || account.user.role !== Role.CLIENT || !isClientAccountAllowed(account.user)) {
    await userSessionRepository.revoke(session.id)
    return null
  }

  if (shouldInvalidateSession(account.user, session)) {
    await userSessionRepository.revoke(session.id)
    return null
  }

  if (options?.touch) {
    const touchedSession = await userSessionRepository.touch(session.id)

    return {
      session: touchedSession ?? session,
      user: account.user,
    } satisfies AuthenticatedAccount
  }

  return {
    session,
    user: account.user,
  } satisfies AuthenticatedAccount
}

export async function requireAuthenticatedAccount() {
  const account = await getAuthenticatedAccount({ touch: true })

  if (!account) {
    throw new HttpError(401, "Authentication required")
  }

  return account
}

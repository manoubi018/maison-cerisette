"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ChevronRight,
  LogIn,
  LogOut,
  ReceiptText,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react"

import { useCurrentAccount } from "@/lib/account-context"
import { useLanguage } from "@/lib/language-context"

type AccountMenuProps = {
  srLabel: string
}

function getInitial(value: string) {
  return value.trim().charAt(0).toUpperCase() || "G"
}

export function AccountMenu({ srLabel }: AccountMenuProps) {
  const { currentAccount, loaded, signOut } = useCurrentAccount()
  const { language } = useLanguage()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const labels =
    language === "fr"
      ? {
          guest: "Invite",
          guestHint: "Session sur ce navigateur",
          phoneFallback: "Telephone non renseigne",
          account: "Compte",
          profile: "Mon profil",
          password: "Mot de passe",
          addresses: "Mes adresses",
          orders: "Mes commandes",
          signIn: "Se connecter",
          signUp: "Creer un compte",
          signOut: "Se deconnecter",
        }
      : {
          guest: "Guest",
          guestHint: "Session in this browser",
          phoneFallback: "No phone saved",
          account: "Account",
          profile: "My profile",
          password: "Password",
          addresses: "My addresses",
          orders: "My orders",
          signIn: "Sign in",
          signUp: "Create account",
          signOut: "Sign out",
        }

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  const summary = useMemo(() => {
    if (!loaded) {
      return {
        badge: ".",
        title: "...",
        subtitle: "",
        meta: "",
        image: "",
      }
    }

    if (currentAccount.mode === "authenticated") {
      return {
        badge: getInitial(currentAccount.user.nom),
        title: currentAccount.user.nom,
        subtitle: currentAccount.user.email,
        meta: labels.account,
        image: currentAccount.profile.image,
      }
    }

    const guestName = currentAccount.profile.fullName || labels.guest
    return {
      badge: getInitial(guestName),
      title: guestName,
      subtitle: currentAccount.profile.phone || labels.phoneFallback,
      meta: labels.guestHint,
      image: currentAccount.profile.image,
    }
  }, [
    currentAccount.mode,
    currentAccount.profile.fullName,
    currentAccount.profile.image,
    currentAccount.profile.phone,
    currentAccount.user,
    labels.account,
    labels.guest,
    labels.guestHint,
    labels.phoneFallback,
    loaded,
  ])

  const handleSignOut = () => {
    signOut()
    setOpen(false)
  }

  const closeMenu = () => setOpen(false)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex p-2 rounded-lg transition hover:bg-muted"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="sr-only">{srLabel}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="w-5 h-5 text-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="3.2" />
          <path d="M4.5 20c1.8-3.6 5-5.4 7.5-5.4s5.7 1.8 7.5 5.4" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.65rem)] z-50 w-[min(18rem,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {summary.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={summary.image} alt={labels.profile} className="h-full w-full rounded-full object-cover" />
              ) : (
                summary.badge
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{summary.title}</p>
              <p className="truncate text-xs text-muted-foreground">{summary.subtitle}</p>
              <p className="mt-0.5 truncate text-[11px] text-primary">{summary.meta}</p>
            </div>
          </div>

          <div className="p-2">
            <Link
              href="/account/profile"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                {labels.profile}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              href="/account/password"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                {labels.password}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              href="/account/orders"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <ReceiptText className="h-4 w-4 text-muted-foreground" />
                {labels.orders}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>

          <div className="border-t border-border p-2">
            {currentAccount.mode === "authenticated" ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  {labels.signOut}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                    {labels.signIn}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className="mt-1 flex items-center justify-between rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    {labels.signUp}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

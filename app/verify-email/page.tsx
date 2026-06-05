"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

type VerificationState = "pending" | "success" | "error"

export default function VerifyEmailPage() {
  const { t } = useLanguage()
  const [state, setState] = useState<VerificationState>("pending")
  const [message, setMessage] = useState(
    t("Verification in progress...", "Verification en cours..."),
  )

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token")

    if (!token) {
      setState("error")
      setMessage(t("Missing verification token.", "Token de verification manquant."))
      return
    }

    let cancelled = false

    const verify = async () => {
      try {
        const response = await fetch(`/api/auth/email-verification/verify?token=${encodeURIComponent(token)}`, {
          cache: "no-store",
        })
        const payload = (await response.json().catch(() => null)) as { message?: string } | null

        if (!response.ok) {
          throw new Error(
            payload?.message ??
              t("Unable to verify the email.", "Impossible de verifier l'email."),
          )
        }

        if (!cancelled) {
          setState("success")
          setMessage(
            payload?.message ??
              t("Email verified successfully.", "Email verifie avec succes."),
          )
        }
      } catch (error) {
        if (!cancelled) {
          setState("error")
          setMessage(
            error instanceof Error
              ? error.message
              : t("Unable to verify the email.", "Impossible de verifier l'email."),
          )
        }
      }
    }

    void verify()

    return () => {
      cancelled = true
    }
  }, [t])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h1 className="mb-3 text-3xl font-bold">
              {state === "pending"
                ? t("Email verification", "Verification email")
                : state === "success"
                  ? t("Email verified", "Email verifie")
                  : t("Verification failed", "Verification echouee")}
            </h1>
            <p className="mb-8 text-sm text-muted-foreground">{message}</p>
            <Link href="/sign-in" className="block">
              <Button className="w-full">
                {t("Go to sign in", "Aller a la connexion")}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useCurrentAccount } from "@/lib/account-context"
import { useLanguage } from "@/lib/language-context"

export default function SignUpPage() {
  const router = useRouter()
  const { currentAccount, signUp } = useCurrentAccount()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    fullName: currentAccount.profile.fullName,
    email: currentAccount.profile.email,
    phone: currentAccount.profile.phone,
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isSendingVerification, setIsSendingVerification] = useState(false)
  const [verificationInfo, setVerificationInfo] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState("")
  const pollingRef = useRef<number | null>(null)

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || currentAccount.profile.fullName,
      email: prev.email || currentAccount.profile.email,
      phone: prev.phone || currentAccount.profile.phone,
    }))
  }, [
    currentAccount.profile.email,
    currentAccount.profile.fullName,
    currentAccount.profile.phone,
  ])

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const normalizedEmail = formData.email.trim().toLowerCase()

    if (!normalizedEmail) {
      setIsEmailVerified(false)
      setVerificationEmail("")
      setVerificationInfo("")
      return
    }

    if (verificationEmail && normalizedEmail !== verificationEmail) {
      setIsEmailVerified(false)
      setVerificationInfo("")
    }
  }, [formData.email, verificationEmail])

  const startVerificationPolling = (email: string) => {
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current)
    }

    const normalizedEmail = email.trim().toLowerCase()
    const startedAt = Date.now()

    pollingRef.current = window.setInterval(async () => {
      if (Date.now() - startedAt > 5 * 60 * 1000) {
        if (pollingRef.current) {
          window.clearInterval(pollingRef.current)
          pollingRef.current = null
        }
        setVerificationInfo(
          t(
            "Verification timed out. Please request a new email.",
            "Temps ecoule. Merci de relancer la verification.",
          ),
        )
        return
      }

      try {
        const response = await fetch(
          `/api/auth/email-verification/status?email=${encodeURIComponent(normalizedEmail)}`,
          { cache: "no-store" },
        )
        const payload = (await response.json().catch(() => null)) as { verified?: boolean } | null

        if (response.ok && payload?.verified) {
          if (pollingRef.current) {
            window.clearInterval(pollingRef.current)
            pollingRef.current = null
          }

          setIsEmailVerified(true)
          setVerificationEmail(normalizedEmail)
          setVerificationInfo(
            t("Email verified successfully.", "Email verifie avec succes."),
          )
        }
      } catch {
        return
      }
    }, 3000)
  }

  const handleVerifyEmail = async () => {
    const email = formData.email.trim().toLowerCase()

    if (!email) {
      setVerificationInfo(t("A valid email is required.", "Un email valide est requis."))
      return
    }

    setIsSendingVerification(true)
    setVerificationInfo("")
    setError("")

    try {
      const response = await fetch("/api/auth/email-verification/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const payload = (await response.json().catch(() => null)) as { message?: string } | null

      if (!response.ok) {
        throw new Error(
          payload?.message ??
            t("Could not send the verification email.", "Envoi du mail impossible."),
        )
      }

      setIsEmailVerified(false)
      setVerificationEmail(email)
      setVerificationInfo(
        t(
          "Verification email sent. Please check your inbox.",
          "Email envoye, merci de verifier votre boite mail.",
        ),
      )
      startVerificationPolling(email)
    } catch (sendError) {
      setVerificationInfo(
        sendError instanceof Error
          ? sendError.message
          : t("Could not send the verification email.", "Envoi du mail impossible."),
      )
    } finally {
      setIsSendingVerification(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError(t("Passwords do not match.", "Les mots de passe ne correspondent pas."))
      setIsSubmitting(false)
      return
    }

    if (!isEmailVerified || verificationEmail !== formData.email.trim().toLowerCase()) {
      setError(
        t(
          "Please verify your email before creating the account.",
          "Veuillez verifier votre email avant de creer le compte.",
        ),
      )
      setIsSubmitting(false)
      return
    }

    try {
      await signUp({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })
      router.push("/account")
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t("Could not create your account.", "Creation du compte impossible."),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-16">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h1 className="mb-2 text-3xl font-bold">{t("Create Account", "Creer un compte")}</h1>
            <p className="mb-8 text-sm text-muted-foreground">
              {t(
                "Turn your guest session into a reusable account protected by a password.",
                "Transformez votre session invite en compte reutilisable protege par un mot de passe.",
              )}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {t("Full Name", "Nom complet")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                  autoComplete="name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">{t("Email", "Email")}</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, email: event.target.value }))
                    }
                    autoComplete="email"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyEmail}
                    disabled={isSendingVerification}
                  >
                    {isEmailVerified && verificationEmail === formData.email.trim().toLowerCase()
                      ? t("Verified", "Verifie")
                      : isSendingVerification
                        ? t("Sending...", "Envoi...")
                        : t("Verify", "Verifier")}
                  </Button>
                </div>
                {verificationInfo ? (
                  <p
                    className={`mt-2 text-sm ${
                      isEmailVerified ? "text-emerald-600" : "text-muted-foreground"
                    }`}
                  >
                    {verificationInfo}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {t("Phone Number", "Telephone")}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  autoComplete="tel"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {t("Password", "Mot de passe")}
                </label>
                <input
                  type="password"
                  required
                  minLength={10}
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, password: event.target.value }))
                  }
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                  placeholder={t("At least 10 characters", "Au moins 10 caracteres")}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {t("Confirm Password", "Confirmer le mot de passe")}
                </label>
                <input
                  type="password"
                  required
                  minLength={10}
                  value={formData.confirmPassword}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {t(
                  "Prefer a long passphrase or a password manager-generated secret.",
                  "Preferez une phrase de passe longue ou un secret genere par un gestionnaire de mots de passe.",
                )}
              </p>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("Creating...", "Creation...") : t("Create Account", "Creer un compte")}
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              {t("Already have an account?", "Vous avez deja un compte ?")}{" "}
              <Link href="/sign-in" className="font-semibold text-primary hover:underline">
                {t("Sign in", "Se connecter")}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

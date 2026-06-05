"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useCurrentAccount } from "@/lib/account-context"
import { useLanguage } from "@/lib/language-context"

export default function SignInPage() {
  const router = useRouter()
  const { signIn } = useCurrentAccount()
  const { t } = useLanguage()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      await signIn({ identifier, password })
      router.push("/account")
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t("Could not sign in right now.", "Connexion impossible pour le moment."),
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
            <h1 className="mb-2 text-3xl font-bold">{t("Sign In", "Se connecter")}</h1>
            <p className="mb-8 text-sm text-muted-foreground">
              {t(
                "Use your email or phone number together with your password to continue.",
                "Utilisez votre email ou numero de telephone avec votre mot de passe pour continuer.",
              )}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {t("Email or Phone", "Email ou telephone")}
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  autoComplete="username"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                  placeholder={t("name@example.com or +216...", "nom@example.com ou +216...")}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {t("Password", "Mot de passe")}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2"
                  placeholder={t("Enter your password", "Saisissez votre mot de passe")}
                />
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("Signing in...", "Connexion...") : t("Sign In", "Se connecter")}
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              {t("Don't have an account yet?", "Pas encore de compte ?")}{" "}
              <Link href="/sign-up" className="font-semibold text-primary hover:underline">
                {t("Create one", "Creer un compte")}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useCurrentAccount } from "@/lib/account-context"
import { useLanguage } from "@/lib/language-context"

export default function AccountPasswordPage() {
  const { currentAccount, updatePassword } = useCurrentAccount()
  const { t } = useLanguage()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (currentAccount.mode === "guest") {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("Security", "Securite")}
          </p>
          <h1 className="mt-3 text-3xl font-bold">{t("Password", "Mot de passe")}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {t(
              "Guests do not have a password yet. Create or connect an account first to manage sign-in security.",
              "Un invite n'a pas encore de mot de passe. Creez ou connectez un compte pour gerer la securite de connexion.",
            )}
          </p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">{t("Access required", "Acces requis")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "Once this browser session becomes a real account, you can attach a secure authentication flow to it.",
              "Une fois cette session navigateur transformee en vrai compte, vous pourrez lui associer une authentification securisee.",
            )}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/sign-in">
              <Button variant="outline">{t("Sign In", "Se connecter")}</Button>
            </Link>
            <Link href="/sign-up">
              <Button>{t("Create Account", "Creer un compte")}</Button>
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword !== confirmPassword) {
      setError(t("Passwords do not match.", "Les mots de passe ne correspondent pas."))
      return
    }

    setIsSubmitting(true)

    try {
      await updatePassword({
        currentPassword: currentAccount.user.hasPassword ? currentPassword : undefined,
        newPassword,
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSuccess(
        t(
          "Your password has been updated.",
          "Votre mot de passe a ete mis a jour.",
        ),
      )
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t("Could not update the password.", "Impossible de mettre a jour le mot de passe."),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {t("Security", "Securite")}
        </p>
        <h1 className="mt-3 text-3xl font-bold">{t("Password", "Mot de passe")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          {t(
            "Manage the password used to protect this client account.",
            "Gerez le mot de passe utilise pour proteger ce compte client.",
          )}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">{t("Current sign-in access", "Acces de connexion actuel")}</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-border bg-background/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {t("Email", "Email")}
              </p>
              <p className="mt-2 text-sm font-medium">
                {currentAccount.profile.email || t("Not provided", "Non renseigne")}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {t("Phone Number", "Telephone")}
              </p>
              <p className="mt-2 text-sm font-medium">
                {currentAccount.profile.phone || t("Not provided", "Non renseigne")}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">{t("Password status", "Etat du mot de passe")}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {t(
              currentAccount.user.hasPassword
                ? "This account is protected by a password stored as a secure server-side hash."
                : "This account does not have a password yet. Define one now to secure future sign-ins.",
              currentAccount.user.hasPassword
                ? "Ce compte est protege par un mot de passe stocke sous forme de hash securise cote serveur."
                : "Ce compte n'a pas encore de mot de passe. Definissez-en un maintenant pour securiser les prochaines connexions.",
            )}
          </p>

          <div className="mt-5 rounded-2xl border border-dashed border-border bg-background/50 p-4">
            <p className="text-sm font-semibold">{t("Security note", "Note de securite")}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "Use a long unique password and avoid reusing one from another site.",
                "Utilisez un mot de passe long et unique, sans reutiliser celui d'un autre site.",
              )}
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">
          {t(
            currentAccount.user.hasPassword ? "Change password" : "Create password",
            currentAccount.user.hasPassword ? "Changer le mot de passe" : "Creer un mot de passe",
          )}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            currentAccount.user.hasPassword
              ? "Confirm the current password, then choose a new one with at least 10 characters."
              : "Choose a password with at least 10 characters to protect this account.",
            currentAccount.user.hasPassword
              ? "Confirmez le mot de passe actuel puis choisissez-en un nouveau avec au moins 10 caracteres."
              : "Choisissez un mot de passe d'au moins 10 caracteres pour proteger ce compte.",
          )}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {currentAccount.user.hasPassword ? (
            <div>
              <label className="mb-2 block text-sm font-semibold">
                {t("Current Password", "Mot de passe actuel")}
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-border bg-background px-4 py-2"
              />
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-semibold">
              {t("New Password", "Nouveau mot de passe")}
            </label>
            <input
              type="password"
              required
              minLength={10}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border border-border bg-background px-4 py-2"
              placeholder={t("At least 10 characters", "Au moins 10 caracteres")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              {t("Confirm New Password", "Confirmer le nouveau mot de passe")}
            </label>
            <input
              type="password"
              required
              minLength={10}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-lg border border-border bg-background px-4 py-2"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t("Saving...", "Enregistrement...")
              : t(
                  currentAccount.user.hasPassword ? "Update Password" : "Save Password",
                  currentAccount.user.hasPassword
                    ? "Mettre a jour le mot de passe"
                    : "Enregistrer le mot de passe",
                )}
          </Button>
        </form>
      </section>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, LogOut, MapPin, ReceiptText, ShieldCheck, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCurrentAccount } from "@/lib/account-context"
import { useLanguage } from "@/lib/language-context"

function getInitial(value: string) {
  return value.trim().charAt(0).toUpperCase() || "G"
}

function isActiveRoute(pathname: string, href: string) {
  if (href === "/account/profile") {
    return pathname === "/account" || pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AccountSidebar() {
  const pathname = usePathname()
  const { currentAccount, loaded, signOut } = useCurrentAccount()
  const { t } = useLanguage()

  const links = [
    {
      href: "/account/profile",
      label: t("Profile", "Profil"),
      description: t("Personal details and photo", "Informations personnelles et photo"),
      icon: UserRound,
    },
    {
      href: "/account/password",
      label: t("Password", "Mot de passe"),
      description: t("Security and sign-in access", "Securite et acces de connexion"),
      icon: ShieldCheck,
    },
    {
      href: "/account/addresses",
      label: t("Addresses", "Adresses"),
      description: t("Delivery locations", "Adresses de livraison"),
      icon: MapPin,
    },
    {
      href: "/account/orders",
      label: t("Order History", "Historique des commandes"),
      description: t("Track and review orders", "Suivi et historique des commandes"),
      icon: ReceiptText,
    },
  ]

  const displayName = loaded ? currentAccount.profile.fullName || t("Guest", "Invite") : "..."
  const displayMeta = loaded
    ? currentAccount.mode === "authenticated"
      ? currentAccount.profile.email || currentAccount.profile.phone
      : t("Session linked to this browser", "Session liee a ce navigateur")
    : ""

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_50px_-42px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-200 px-6 py-6">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {currentAccount.mode === "authenticated"
              ? t("Account space", "Espace compte")
              : t("Guest space", "Espace invite")}
          </p>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] bg-[linear-gradient(135deg,_#0f172a,_#1d4ed8)] text-lg font-semibold text-white shadow-[0_18px_36px_-28px_rgba(29,78,216,0.7)]">
              {currentAccount.profile.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentAccount.profile.image}
                  alt={t("Profile image", "Image du profil")}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitial(displayName)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-semibold tracking-tight text-slate-950">{displayName}</p>
              <p className="mt-1 truncate text-sm text-slate-500">{displayMeta}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {currentAccount.mode === "authenticated"
                  ? t("Verified account", "Compte verifie")
                  : t("Guest session", "Session invite")}
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {currentAccount.mode === "authenticated"
                  ? t("Personal workspace", "Espace personnel")
                  : t("Saved on this device", "Sauvegarde locale")}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("Account summary", "Resume du compte")}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {currentAccount.mode === "authenticated"
                  ? t("Your profile is linked to your customer account.", "Votre profil est relie a votre compte client.")
                  : t("Your data is currently stored only in this browser.", "Vos donnees sont actuellement stockees uniquement dans ce navigateur.")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="px-2">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {t("Navigation", "Navigation")}
            </p>
          </div>

          <nav className="mt-4 space-y-2">
            {links.map((link) => {
              const active = isActiveRoute(pathname, link.href)
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-[1.2rem] border px-3.5 py-3.5 transition-all",
                    active
                      ? "border-slate-200 bg-slate-50 text-slate-950 shadow-sm"
                      : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                      active
                        ? "bg-white text-slate-900 shadow-sm"
                        : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{link.label}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">{link.description}</p>
                  </div>

                  <ChevronRight className={cn("size-4 shrink-0", active ? "text-slate-400" : "text-slate-300")} />
                </Link>
              )
            })}
          </nav>

          <div className="mt-5 border-t border-slate-200 pt-5">
            {currentAccount.mode === "authenticated" ? (
              <Button
                variant="outline"
                className="h-11 w-full justify-center rounded-xl border-slate-300 bg-white text-slate-900 shadow-none hover:bg-slate-50"
                onClick={signOut}
              >
                <LogOut className="size-4" />
                {t("Sign Out", "Se deconnecter")}
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" className="w-full">
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-xl border-slate-300 bg-white text-slate-900 shadow-none hover:bg-slate-50"
                  >
                    {t("Sign In", "Se connecter")}
                  </Button>
                </Link>
                <Link href="/sign-up" className="w-full">
                  <Button className="h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/92">
                    {t("Create Account", "Creer un compte")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

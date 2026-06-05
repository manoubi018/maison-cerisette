"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { BadgeCheck, Camera, Mail, PencilLine, Phone, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCurrentAccount } from "@/lib/account-context"
import { uploadProfileImageToCloudinary } from "@/lib/cloudinary"
import { useLanguage } from "@/lib/language-context"

type ProfileSettings = {
  fullName: string
  email: string
  phone: string
  image: string
}

const emptyProfile: ProfileSettings = {
  fullName: "",
  email: "",
  phone: "",
  image: "",
}

function getInitial(value: string) {
  return value.trim().charAt(0).toUpperCase() || "P"
}

export default function AccountProfilePage() {
  const { currentAccount, loaded, updateProfile } = useCurrentAccount()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<ProfileSettings>(emptyProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [statusTone, setStatusTone] = useState<"success" | "error">("success")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const syncProfileFromAccount = () => {
    setProfile({
      fullName: currentAccount.profile.fullName,
      email: currentAccount.profile.email,
      phone: currentAccount.profile.phone,
      image: currentAccount.profile.image,
    })
  }

  const showStatus = (message: string, tone: "success" | "error", duration = 2200) => {
    setStatusTone(tone)
    setStatusMessage(message)
    window.setTimeout(() => setStatusMessage(""), duration)
  }

  useEffect(() => {
    if (!loaded || isEditing) {
      return
    }

    syncProfileFromAccount()
  }, [
    currentAccount.profile.email,
    currentAccount.profile.fullName,
    currentAccount.profile.image,
    currentAccount.profile.phone,
    isEditing,
    loaded,
  ])

  const handleSave = async () => {
    try {
      await updateProfile(profile)
      setIsEditing(false)
      showStatus(t("Profile updated", "Profil mis a jour"), "success")
    } catch (error) {
      showStatus(
        error instanceof Error
          ? error.message
          : t("Could not update your profile.", "Mise a jour du profil impossible."),
        "error",
      )
    }
  }

  const handleCancel = () => {
    syncProfileFromAccount()
    setIsEditing(false)
  }

  const handleImageSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setIsUploadingImage(true)

    try {
      const imageUrl = await uploadProfileImageToCloudinary(file)
      setProfile((prev) => ({ ...prev, image: imageUrl }))
      showStatus(t("Profile image uploaded", "Image de profil telechargee"), "success")
    } catch (error) {
      showStatus(
        error instanceof Error
          ? error.message
          : t("Could not upload your image.", "Telechargement de l'image impossible."),
        "error",
        3200,
      )
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const completedFields = [profile.fullName, profile.email, profile.phone, profile.image].filter(Boolean).length
  const completionRatio = Math.round((completedFields / 4) * 100)
  const accountStateLabel =
    currentAccount.mode === "authenticated"
      ? t("Verified", "Verifie")
      : t("Guest", "Invite")
  const accountWorkspaceLabel =
    currentAccount.mode === "authenticated"
      ? t("Stored in your customer account", "Enregistre dans votre compte client")
      : t("Stored only on this device", "Enregistre uniquement sur cet appareil")
  const contactLabel = profile.email || profile.phone || t("Not set", "Non defini")
  const missingFields = 4 - completedFields
  const notProvidedLabel = t("Not provided", "Non renseigne")
  const missingLabel = t("Missing", "Manquant")
  const overviewItems = [
    {
      label: t("Profile completion", "Profil complete"),
      value: `${completionRatio}%`,
      description: t(
        "Measures whether your account is ready for orders and customer support.",
        "Mesure si votre compte est pret pour les commandes et le support client.",
      ),
    },
    {
      label: t("Account type", "Type de compte"),
      value: accountStateLabel,
      description:
        currentAccount.mode === "authenticated"
          ? t("Your details are saved and available across sessions.", "Vos informations sont enregistrees et disponibles sur toutes vos sessions.")
          : t("This profile is currently limited to this browser session.", "Ce profil est actuellement limite a cette session du navigateur."),
    },
    {
      label: t("Primary contact", "Contact principal"),
      value: contactLabel,
      description: t(
        "Used for order updates, verification, and support follow-up.",
        "Utilise pour le suivi des commandes, la verification et le support.",
      ),
    },
  ]

  const detailRows = [
    {
      label: t("Full Name", "Nom complet"),
      value: profile.fullName || notProvidedLabel,
      helper: t("Shown on your account and order records.", "Affiche sur votre compte et vos commandes."),
      icon: UserRound,
    },
    {
      label: t("Email", "Email"),
      value: profile.email || notProvidedLabel,
      helper: t("Used for confirmations and account recovery.", "Utilise pour les confirmations et la recuperation du compte."),
      icon: Mail,
    },
    {
      label: t("Phone Number", "Telephone"),
      value: profile.phone || notProvidedLabel,
      helper: t("Used for delivery coordination when needed.", "Utilise pour coordonner la livraison si necessaire."),
      icon: Phone,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_50px_-42px_rgba(15,23,42,0.35)]">
        <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div className="max-w-3xl">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {currentAccount.mode === "authenticated"
                  ? t("Profile Settings", "Reglages du profil")
                  : t("Guest Profile", "Profil invite")}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {t("Personal Information", "Informations personnelles")}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {t(
                  "Manage the information used across your orders, delivery communication, and account access.",
                  "Gerez ici les informations utilisees pour vos commandes, la communication de livraison et l'acces au compte.",
                )}
              </p>
              <div className="flex flex-wrap gap-2.5">
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {accountStateLabel}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {accountWorkspaceLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("Account readiness", "Preparation du compte")}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{completionRatio}%</p>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="h-11 rounded-xl px-4 shadow-none">
                  <PencilLine className="size-4" />
                  {t("Edit", "Modifier")}
                </Button>
              ) : null}
            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a_0%,#1d4ed8_100%)] transition-all"
                style={{ width: `${completionRatio}%` }}
              />
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {missingFields === 0
                ? t(
                    "Your core profile information is complete and ready to be used across the account.",
                    "Vos informations principales sont completes et pretes a etre utilisees dans tout le compte.",
                  )
                : t(
                    `${missingFields} item${missingFields > 1 ? "s are" : " is"} still missing from your profile.`,
                    `${missingFields} information${missingFields > 1 ? "s restent" : " reste"} encore manquante${missingFields > 1 ? "s" : ""} dans votre profil.`,
                  )}
            </p>

            {isEditing ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={handleSave} className="h-11 rounded-xl px-5 shadow-none">
                  {t("Save Changes", "Enregistrer")}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="h-11 rounded-xl px-5">
                  {t("Cancel", "Annuler")}
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-200 p-6 md:grid-cols-3 sm:p-8">
          {overviewItems.map((item) => (
            <div key={item.label} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 line-clamp-2 break-words text-lg font-semibold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {statusMessage ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
            statusTone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {statusMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.35)]">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,64,175,0.82))] text-3xl font-bold text-white shadow-[0_18px_40px_-28px_rgba(30,64,175,0.7)]">
                  {profile.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.image}
                      alt={t("Profile image", "Image du profil")}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitial(profile.fullName)
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {t("Profile image", "Image du profil")}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    {t("Profile Photo", "Photo de profil")}
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                    {t(
                      "Use a clear square image for a consistent customer-facing account identity.",
                      "Utilisez une image carree et nette pour une identite de compte plus coherente.",
                    )}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {t("Display mode", "Mode d'affichage")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    {profile.image
                      ? t("Uploaded photo", "Photo telechargee")
                      : t("Initial placeholder", "Initiale par defaut")}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {t("Recommended format", "Format recommande")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    {t("Square image, centered subject", "Image carree, sujet centre")}
                  </p>
                </div>
              </div>

              {isEditing ? (
                <div className="flex flex-wrap gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelection}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="h-11 rounded-xl px-5"
                  >
                    <Camera className="size-4" />
                    {isUploadingImage
                      ? t("Uploading...", "Telechargement...")
                      : t("Upload Photo", "Telecharger une photo")}
                  </Button>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("Account Snapshot", "Resume du compte")}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                  {t("Completion status", "Statut de completion")}
                </h2>
              </div>
              <BadgeCheck className="size-5 text-primary" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("Identity", "Identite")}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-950">
                  {profile.fullName || missingLabel}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("Email status", "Statut email")}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-950">
                  {profile.email ? t("Configured", "Configure") : missingLabel}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("Phone status", "Statut telephone")}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-950">
                  {profile.phone ? t("Configured", "Configure") : missingLabel}
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t("Profile records", "Donnees du profil")}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {t("Profile Details", "Details du profil")}
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              {t(
                "Keep these details accurate so orders, receipts, and support interactions stay consistent.",
                "Gardez ces informations exactes pour assurer la coherence des commandes, recus et interactions de support.",
              )}
            </p>
          </div>

          {!isEditing ? (
            <div className="mt-6 grid gap-4">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                        <row.icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {row.label}
                        </p>
                        <p className="mt-2 break-words text-base font-semibold text-slate-950">
                          {row.value}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{row.helper}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          row.value === notProvidedLabel
                            ? "border border-amber-200 bg-amber-50 text-amber-700"
                            : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {row.value === notProvidedLabel
                          ? t("Needs attention", "A completer")
                          : t("Available", "Disponible")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900">
                  {t("Full Name", "Nom complet")}
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(event) => setProfile((prev) => ({ ...prev, fullName: event.target.value }))}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder={t("Enter your full name", "Saisissez votre nom complet")}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900">{t("Email", "Email")}</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder={t("name@example.com", "nom@exemple.com")}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900">
                  {t("Phone Number", "Telephone")}
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder={t("Add a reachable phone number", "Ajoutez un numero joignable")}
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 md:col-span-2">
                {t(
                  "Review each field before saving. These details are reused throughout your account and checkout experience.",
                  "Verifiez chaque champ avant d'enregistrer. Ces informations sont reutilisees dans tout votre compte et pendant le paiement.",
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

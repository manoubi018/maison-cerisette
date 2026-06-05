"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  emptyAddress,
  type Address,
  readStoredAddresses,
  seedAddressesFromOrders,
  writeStoredAddresses,
} from "@/lib/account-data"
import { useLanguage } from "@/lib/language-context"
import { useOrders } from "@/lib/orders-context"

export default function AccountAddressesPage() {
  const { orders } = useOrders()
  const { t } = useLanguage()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [statusMessage, setStatusMessage] = useState("")
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressDraft, setAddressDraft] = useState<Address>(emptyAddress)

  useEffect(() => {
    const seeded = seedAddressesFromOrders(readStoredAddresses(), orders)
    setAddresses(seeded)
    writeStoredAddresses(seeded)
  }, [orders])

  const persistAddresses = (nextAddresses: Address[], message?: string) => {
    setAddresses(nextAddresses)
    writeStoredAddresses(nextAddresses)
    if (message) {
      setStatusMessage(message)
      setTimeout(() => setStatusMessage(""), 2200)
    }
  }

  const handleStartAddAddress = () => {
    setEditingAddressId(null)
    setAddressDraft(emptyAddress)
    setIsAddressFormOpen(true)
  }

  const handleStartEditAddress = (address: Address) => {
    setEditingAddressId(address.id)
    setAddressDraft(address)
    setIsAddressFormOpen(true)
  }

  const handleSaveAddress = () => {
    if (!addressDraft.label || !addressDraft.address || !addressDraft.city || !addressDraft.governorate) {
      setStatusMessage(
        t(
          "Please fill out all required address fields.",
          "Veuillez remplir tous les champs requis de l'adresse.",
        ),
      )
      setTimeout(() => setStatusMessage(""), 2200)
      return
    }

    if (editingAddressId) {
      const nextAddresses = addresses.map((address) =>
        address.id === editingAddressId ? addressDraft : address,
      )
      persistAddresses(nextAddresses, t("Address updated", "Adresse mise a jour"))
    } else {
      const newAddress = { ...addressDraft, id: `ADDR-${Date.now()}` }
      persistAddresses([newAddress, ...addresses], t("Address added", "Adresse ajoutee"))
    }

    setIsAddressFormOpen(false)
    setEditingAddressId(null)
    setAddressDraft(emptyAddress)
  }

  const handleRemoveAddress = (addressId: string) => {
    persistAddresses(
      addresses.filter((address) => address.id !== addressId),
      t("Address removed", "Adresse supprimee"),
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {t("Addresses", "Adresses")}
            </p>
            <h1 className="mt-3 text-3xl font-bold">{t("Saved Addresses", "Adresses enregistrees")}</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              {t(
                "Manage the delivery locations attached to this profile.",
                "Gerez les lieux de livraison rattaches a ce profil.",
              )}
            </p>
          </div>

          <Button variant="outline" onClick={handleStartAddAddress}>
            {t("Add Address", "Ajouter une adresse")}
          </Button>
        </div>
      </section>

      {statusMessage ? (
        <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          {statusMessage}
        </div>
      ) : null}

      <section className="rounded-3xl border border-border bg-card p-6">
        {addresses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("No saved address yet.", "Aucune adresse enregistree pour le moment.")}
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="rounded-2xl border border-border p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold">{address.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {address.address}, {address.city}, {address.governorate}
                      {address.postalCode ? ` ${address.postalCode}` : ""}
                    </p>
                    {address.notes ? (
                      <p className="mt-2 text-xs text-muted-foreground">{address.notes}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <button onClick={() => handleStartEditAddress(address)} className="text-primary hover:underline">
                      {t("Edit", "Modifier")}
                    </button>
                    <button
                      onClick={() => handleRemoveAddress(address.id)}
                      className="text-red-600 hover:underline"
                    >
                      {t("Remove", "Supprimer")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isAddressFormOpen ? (
          <div className="mt-6 border-t border-border pt-6">
            <h2 className="mb-4 text-lg font-semibold">
              {editingAddressId ? t("Edit Address", "Modifier l'adresse") : t("New Address", "Nouvelle adresse")}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">{t("Label", "Libelle")}</label>
                <input
                  type="text"
                  value={addressDraft.label}
                  onChange={(event) => setAddressDraft((prev) => ({ ...prev, label: event.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">{t("Postal Code", "Code postal")}</label>
                <input
                  type="text"
                  value={addressDraft.postalCode}
                  onChange={(event) => setAddressDraft((prev) => ({ ...prev, postalCode: event.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">{t("Address", "Adresse")}</label>
                <input
                  type="text"
                  value={addressDraft.address}
                  onChange={(event) => setAddressDraft((prev) => ({ ...prev, address: event.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">{t("City", "Ville")}</label>
                <input
                  type="text"
                  value={addressDraft.city}
                  onChange={(event) => setAddressDraft((prev) => ({ ...prev, city: event.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">{t("Governorate", "Gouvernorat")}</label>
                <input
                  type="text"
                  value={addressDraft.governorate}
                  onChange={(event) =>
                    setAddressDraft((prev) => ({ ...prev, governorate: event.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">{t("Notes", "Notes")}</label>
                <textarea
                  value={addressDraft.notes}
                  onChange={(event) => setAddressDraft((prev) => ({ ...prev, notes: event.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={handleSaveAddress}>
                {editingAddressId ? t("Update Address", "Mettre a jour l'adresse") : t("Save Address", "Enregistrer l'adresse")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddressFormOpen(false)
                  setEditingAddressId(null)
                  setAddressDraft(emptyAddress)
                }}
              >
                {t("Cancel", "Annuler")}
              </Button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

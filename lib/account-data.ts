"use client"

import type { Order } from "./orders-context"

export type Address = {
  id: string
  label: string
  address: string
  city: string
  governorate: string
  postalCode: string
  notes: string
}

export const ADDRESS_STORAGE_KEY = "profile-addresses"

export const emptyAddress: Address = {
  id: "",
  label: "Home",
  address: "",
  city: "",
  governorate: "",
  postalCode: "",
  notes: "",
}

export function readStoredAddresses() {
  const raw = localStorage.getItem(ADDRESS_STORAGE_KEY)

  if (!raw) {
    return [] as Address[]
  }

  try {
    return JSON.parse(raw) as Address[]
  } catch {
    return []
  }
}

export function writeStoredAddresses(addresses: Address[]) {
  localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses))
}

export function seedAddressesFromOrders(addresses: Address[], orders: Order[]) {
  if (addresses.length > 0 || orders.length === 0) {
    return addresses
  }

  const latestOrder = orders[0]

  return [
    {
      id: `ADDR-${Date.now()}`,
      label: "Latest Order",
      address: latestOrder.address,
      city: latestOrder.city,
      governorate: latestOrder.governorate,
      postalCode: "",
      notes: latestOrder.notes ?? "",
    },
  ]
}

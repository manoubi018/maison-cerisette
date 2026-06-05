"use client"

import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"

import { useCurrentAccount } from "./account-context"
import { mergeDbProductsWithStatic, type DbProduct } from "./catalog-products"

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  weight?: number
}

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  customerName: string
  phone: string
  address: string
  city: string
  governorate: string
  notes?: string
  paymentMethod: "cash" | "online"
  createdAt: Date
  estimatedDelivery?: Date
}

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "createdAt"> & { id?: string; createdAt?: Date }) => void
  getOrder: (id: string) => Order | undefined
  updateOrder: (id: string, updates: Partial<Order>) => void
  loaded: boolean
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

type ApiOrderAddress = {
  id: number
  latitude: number | null
  longitude: number | null
  country: string
  city: string
  street: string
  postalCode: string
  isDefault: boolean
}

type ApiOrderItem = {
  id: number
  productId: number
  quantite: number
}

type ApiOrder = {
  id: number
  status: string
  paymentMethod: "CACHE" | "ENLIGNE"
  createdAt: string
  total: number
  userId: number
  telephone: string
  shippingAddress: ApiOrderAddress | null
  items: ApiOrderItem[]
}

type ApiErrorPayload = {
  message?: string
  details?: unknown
}

function parseStoredOrders(raw: string | null) {
  if (!raw) {
    return [] as Order[]
  }

  try {
    return JSON.parse(raw).map((order: Order & { createdAt: string; estimatedDelivery?: string }) => ({
      ...order,
      paymentMethod:
        order.paymentMethod === "online" || order.paymentMethod === "cash"
          ? order.paymentMethod
          : order.paymentMethod === "card"
            ? "online"
            : "cash",
      createdAt: new Date(order.createdAt),
      estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
    })) as Order[]
  } catch {
    return []
  }
}

function mapApiPaymentMethod(paymentMethod: ApiOrder["paymentMethod"]): Order["paymentMethod"] {
  return paymentMethod === "ENLIGNE" ? "online" : "cash"
}

function mapApiStatus(status: string): Order["status"] {
  if (status === "CONFIRMER") return "confirmed"
  if (status === "EN_ROUTE") return "shipped"
  if (status === "LIVREE") return "delivered"
  return "pending"
}

function getIdentityScope(account: ReturnType<typeof useCurrentAccount>["currentAccount"]) {
  if (account.mode === "authenticated") {
    return {
      identityKey: `user:${account.user.id}`,
      userId: account.user.id,
    }
  }

  return {
    identityKey: `guest:${account.guestSessionId}`,
    userId: account.guestUserId,
  }
}

function getOrdersStorageKey(identityKey: string) {
  return `orders-cache:${identityKey}`
}

function getGuestSessionHeaders(guestSessionId: string) {
  return {
    "x-guest-session-id": guestSessionId,
  }
}

function formatApiErrorMessage(status: number, payload: ApiErrorPayload | null) {
  return payload?.message ?? `Unable to load orders (${status})`
}

async function fetchOrdersFromApi(input: {
  mode: "authenticated" | "guest"
  userId?: number
  guestSessionId: string
}) {
  const response = await fetch(
    input.mode === "authenticated" ? "/api/orders" : `/api/orders?userId=${input.userId}`,
    {
      cache: "no-store",
      headers:
        input.mode === "guest"
          ? getGuestSessionHeaders(input.guestSessionId)
          : undefined,
    },
  )

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null
    console.warn("Could not load orders from API.", {
      status: response.status,
      message: formatApiErrorMessage(response.status, payload),
      details: payload?.details,
    })
    return null
  }

  return (await response.json()) as ApiOrder[]
}

async function fetchProductsForOrders() {
  const response = await fetch("/api/products", { cache: "no-store" })

  if (!response.ok) {
    return [] as DbProduct[]
  }

  return (await response.json()) as DbProduct[]
}

function mapApiOrdersToCache(
  apiOrders: ApiOrder[],
  products: DbProduct[],
  cachedOrders: Order[],
  customerName: string,
) {
  const cachedById = new Map(cachedOrders.map((order) => [order.id, order]))
  const catalogProducts = mergeDbProductsWithStatic(products)
  const productsById = new Map(catalogProducts.map((product) => [product.id, product]))

  return [...apiOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((apiOrder) => {
      const cachedOrder = cachedById.get(String(apiOrder.id))
      const createdAt = new Date(apiOrder.createdAt)
      const deliveryFee = cachedOrder?.deliveryFee ?? 0
      const subtotal = cachedOrder?.subtotal ?? Math.max(apiOrder.total - deliveryFee, 0)

      return {
        id: String(apiOrder.id),
        items: apiOrder.items.map((item) => {
          const cachedItem = cachedOrder?.items.find(
            (candidate) => Number(candidate.productId) === item.productId,
          )
          const product = productsById.get(String(item.productId))

          return {
            productId: String(item.productId),
            name: cachedItem?.name ?? product?.name ?? `Produit #${item.productId}`,
            price: cachedItem?.price ?? product?.price ?? 0,
            quantity: item.quantite,
          }
        }),
        subtotal,
        deliveryFee,
        total: apiOrder.total,
        status: mapApiStatus(apiOrder.status),
        customerName: cachedOrder?.customerName ?? customerName,
        phone: apiOrder.telephone,
        address: cachedOrder?.address ?? apiOrder.shippingAddress?.street ?? "",
        city: cachedOrder?.city ?? apiOrder.shippingAddress?.city ?? "",
        governorate: cachedOrder?.governorate ?? apiOrder.shippingAddress?.city ?? "",
        notes: cachedOrder?.notes,
        paymentMethod: cachedOrder?.paymentMethod ?? mapApiPaymentMethod(apiOrder.paymentMethod),
        createdAt,
        estimatedDelivery:
          cachedOrder?.estimatedDelivery ??
          new Date(createdAt.getTime() + 24 * 60 * 60 * 1000),
      }
    })
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { currentAccount, loaded: accountLoaded } = useCurrentAccount()
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const ordersRef = useRef<Order[]>([])

  useEffect(() => {
    ordersRef.current = orders
  }, [orders])

  const identityScope = getIdentityScope(currentAccount)

  useEffect(() => {
    if (!accountLoaded) {
      return
    }

    let cancelled = false
    const storageKey = getOrdersStorageKey(identityScope.identityKey)

    const hydrateOrders = async () => {
      const cachedOrders = parseStoredOrders(localStorage.getItem(storageKey))

      if (!cancelled) {
        setOrders(cachedOrders)
      }

      if (!identityScope.userId) {
        if (!cancelled) {
          setMounted(true)
          setLoaded(true)
        }
        return
      }

      try {
        const apiOrders = await fetchOrdersFromApi({
          mode: currentAccount.mode,
          userId: identityScope.userId,
          guestSessionId: currentAccount.guestSessionId,
        })

        if (!apiOrders) {
          return
        }

        const products = await fetchProductsForOrders()

        if (!cancelled) {
          setOrders(
            mapApiOrdersToCache(
              apiOrders,
              products,
              cachedOrders,
              currentAccount.profile.fullName,
            ),
          )
        }
      } finally {
        if (!cancelled) {
          setMounted(true)
          setLoaded(true)
        }
      }
    }

    void hydrateOrders()

    return () => {
      cancelled = true
    }
  }, [
    accountLoaded,
    currentAccount.guestSessionId,
    currentAccount.mode,
    currentAccount.profile.fullName,
    identityScope.identityKey,
    identityScope.userId,
  ])

  useEffect(() => {
    if (!mounted || !accountLoaded) {
      return
    }

    localStorage.setItem(
      getOrdersStorageKey(identityScope.identityKey),
      JSON.stringify(orders),
    )
  }, [accountLoaded, identityScope.identityKey, mounted, orders])

  useEffect(() => {
    if (!mounted || !accountLoaded || !identityScope.userId) {
      return
    }

    let syncing = false

    const syncOrdersFromDatabase = async () => {
      if (syncing) {
        return
      }

      syncing = true

      try {
        const cachedOrders = ordersRef.current
        const apiOrders = await fetchOrdersFromApi({
          mode: currentAccount.mode,
          userId: identityScope.userId,
          guestSessionId: currentAccount.guestSessionId,
        })

        if (!apiOrders) {
          return
        }

        const products = await fetchProductsForOrders()

        setOrders(
          mapApiOrdersToCache(
            apiOrders,
            products,
            cachedOrders,
            currentAccount.profile.fullName,
          ),
        )
      } finally {
        syncing = false
      }
    }

    const handleWindowFocus = () => {
      void syncOrdersFromDatabase()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void syncOrdersFromDatabase()
      }
    }

    window.addEventListener("focus", handleWindowFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("focus", handleWindowFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [
    accountLoaded,
    currentAccount.guestSessionId,
    currentAccount.mode,
    currentAccount.profile.fullName,
    identityScope.userId,
    mounted,
  ])

  const addOrder = (orderData: Omit<Order, "id" | "createdAt"> & { id?: string; createdAt?: Date }) => {
    const newOrder: Order = {
      ...orderData,
      id: orderData.id ?? `ORD-${Date.now()}`,
      createdAt: orderData.createdAt ?? new Date(),
      estimatedDelivery:
        orderData.estimatedDelivery ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
    setOrders((prev) => [newOrder, ...prev])
  }

  const getOrder = (id: string) => {
    return orders.find((o) => o.id === id)
  }

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)))
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrder, updateOrder, loaded }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider")
  }
  return context
}

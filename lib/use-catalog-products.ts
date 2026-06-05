"use client"

import { useEffect, useState } from "react"

import {
  type ActiveCatalogOffer,
  type DbCategory,
  mergeDbProductsWithStatic,
  type CatalogProduct,
  type DbProduct,
} from "./catalog-products"

const CATALOG_CACHE_KEY = "catalog-cache-v1"

type CatalogCache = {
  products: CatalogProduct[]
  categories: DbCategory[]
  updatedAt: string
}

let memoryCache: CatalogCache | null = null
let refreshPromise: Promise<CatalogCache> | null = null
const listeners = new Set<(cache: CatalogCache) => void>()

function readStoredCatalogCache() {
  if (typeof window === "undefined") {
    return null
  }

  if (memoryCache) {
    return memoryCache
  }

  const raw = localStorage.getItem(CATALOG_CACHE_KEY)
  if (!raw) {
    return null
  }

  try {
    memoryCache = JSON.parse(raw) as CatalogCache
    return memoryCache
  } catch {
    localStorage.removeItem(CATALOG_CACHE_KEY)
    return null
  }
}

function writeCatalogCache(cache: CatalogCache) {
  memoryCache = cache

  if (typeof window !== "undefined") {
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(cache))
  }

  listeners.forEach((listener) => listener(cache))
}

async function fetchCatalogCache() {
  const [productsResponse, offersResponse, categoriesResponse] = await Promise.all([
    fetch("/api/products", { cache: "no-store" }),
    fetch("/api/offers/active", { cache: "no-store" }),
    fetch("/api/categories", { cache: "no-store" }),
  ])

  if (!productsResponse.ok) {
    throw new Error(`Unable to load products (${productsResponse.status})`)
  }

  if (!offersResponse.ok) {
    throw new Error(`Unable to load offers (${offersResponse.status})`)
  }

  if (!categoriesResponse.ok) {
    throw new Error(`Unable to load categories (${categoriesResponse.status})`)
  }

  const productsPayload = (await productsResponse.json()) as DbProduct[]
  const offersPayload = (await offersResponse.json()) as ActiveCatalogOffer[]
  const categoriesPayload = (await categoriesResponse.json()) as DbCategory[]

  return {
    categories: categoriesPayload,
    products: mergeDbProductsWithStatic(productsPayload, offersPayload).filter(
      (product) => product.active,
    ),
    updatedAt: new Date().toISOString(),
  }
}

function refreshCatalogCache() {
  if (!refreshPromise) {
    refreshPromise = fetchCatalogCache()
      .then((cache) => {
        writeCatalogCache(cache)
        return cache
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

function subscribeToCatalogCache(listener: (cache: CatalogCache) => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function useCatalogProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>(() => memoryCache?.products ?? [])
  const [categories, setCategories] = useState<DbCategory[]>(() => memoryCache?.categories ?? [])
  const [loading, setLoading] = useState(() => !memoryCache)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const cachedCatalog = readStoredCatalogCache()

    if (cachedCatalog) {
      setProducts(cachedCatalog.products)
      setCategories(cachedCatalog.categories)
      setLoading(false)
      setError(null)
    }

    const unsubscribe = subscribeToCatalogCache((cache) => {
      if (cancelled) {
        return
      }

      setProducts(cache.products)
      setCategories(cache.categories)
      setLoading(false)
      setError(null)
    })

    void refreshCatalogCache()
      .then((cache) => {
        if (!cancelled) {
          setProducts(cache.products)
          setCategories(cache.categories)
          setLoading(false)
          setError(null)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          if (!readStoredCatalogCache()) {
            setError(error instanceof Error ? error.message : "Unable to load products")
          }

          setLoading(false)
        }
      })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  return { products, categories, loading, error }
}

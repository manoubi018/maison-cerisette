"use client"

import { Suspense } from "react"
import ProductsClient from "./products-client"
import { useLanguage } from "@/lib/language-context"

function ProductsFallback() {
  const { t } = useLanguage()
  return <div className="min-h-screen flex items-center justify-center">{t("Loading products...", "Chargement des produits...")}</div>
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsClient />
    </Suspense>
  )
}

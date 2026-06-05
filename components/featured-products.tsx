"use client"

import Link from "next/link"

import { BookProductCard } from "@/components/book-product-card"
import { getTopRatedCatalogProducts } from "@/lib/catalog-products"
import { useLanguage } from "@/lib/language-context"
import { useCatalogProducts } from "@/lib/use-catalog-products"
import { ArrowRight } from "lucide-react"

export function FeaturedProducts() {
  const { t } = useLanguage()
  const { products, loading, error } = useCatalogProducts()
  const featured = getTopRatedCatalogProducts(products, 6)

  if (loading || error || featured.length === 0) {
    return null
  }

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-accent">
              {t("House signatures", "Signatures de la maison")}
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium md:text-4xl">
              {t("Featured products", "Produits en vedette")}
            </h2>
          </div>
          <Link href="/products" className="hidden items-center gap-1 text-sm font-medium text-foreground hover:text-accent sm:inline-flex">
            {t("View full catalog", "Voir tout le catalogue")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((product) => (
            <BookProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

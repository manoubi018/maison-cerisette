"use client"

import Link from "next/link"

import { useCatalogProducts } from "@/lib/use-catalog-products"
import { useLanguage } from "@/lib/language-context"
import { ArrowRight } from "lucide-react"

export function CategoriesSection() {
  const { language, t } = useLanguage()
  const { categories, loading } = useCatalogProducts()

  if (loading || categories.length === 0) {
    return null
  }

  return (
    <section className="border-y border-border bg-secondary/45">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-accent">
              {t("Collections", "Collections")}
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium md:text-4xl">
              {t("Shop by collection", "Explorer par collection")}
            </h2>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex items-center justify-between rounded-xl border border-border bg-background px-5 py-5 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
              title={category.description ?? (language === "fr" ? "Collection Maison Cerisette." : "Maison Cerisette collection.")}
            >
              <span className="font-display text-base">{category.name}</span>
              <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

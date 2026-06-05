"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { searchCatalogProducts } from "@/lib/catalog-products"
import { useLanguage } from "@/lib/language-context"
import { useCatalogProducts } from "@/lib/use-catalog-products"

export function QuickSearch() {
  const { t } = useLanguage()
  const { products, categories } = useCatalogProducts()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const results = useMemo(
    () => searchCatalogProducts(products, query, categories),
    [categories, products, query],
  )

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.length > 0) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <div className="hidden md:block flex-1 max-w-md">
        <input
          type="text"
          placeholder={t("Search products...", "Rechercher des produits...")}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="w-full px-4 py-2 rounded-lg border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
            {results.slice(0, 5).map((product) => {
              const categoryName = categories.find((category) => category.slug === product.category)?.name ?? product.category
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => {
                    setQuery("")
                    setIsOpen(false)
                  }}
                  className="block px-4 py-2 hover:bg-muted border-b last:border-0"
                >
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {categoryName} - {product.price.toFixed(2)} TND
                    {product.activeOffer ? ` (${t("offer", "offre")})` : ""}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

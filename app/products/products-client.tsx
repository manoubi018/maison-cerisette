"use client"

import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { BookProductCard } from "@/components/book-product-card"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { searchCatalogProducts } from "@/lib/catalog-products"
import { useCatalogProducts } from "@/lib/use-catalog-products"
import { useLanguage } from "@/lib/language-context"

export default function ProductsClient() {
  const { language, t } = useLanguage()
  const searchParams = useSearchParams()
  const { products, categories, loading, error } = useCatalogProducts()
  const [sortBy, setSortBy] = useState<"latest" | "price-low" | "price-high">("latest")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const categoryParam = searchParams.get("category")
  const categoryOptions = [
    { id: "all", slug: "all", name: t("Tous", "Tous") },
    ...categories.map((category) => ({
      ...category,
      id: category.slug,
      name: language === "fr" ? category.name : category.name,
    })),
  ]

  useEffect(() => {
    if (categoryParam) {
      const hasCategory = categories.some((category) => category.slug === categoryParam)
      setSelectedCategory(hasCategory ? categoryParam : "all")
    } else {
      setSelectedCategory("all")
    }
  }, [categories, categoryParam])

  const filtered = useMemo(() => {
    let result =
      selectedCategory === "all"
        ? [...products]
        : products.filter((product) => product.category === selectedCategory)

    if (searchQuery.trim()) {
      result = searchCatalogProducts(result, searchQuery, categories)
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [categories, products, searchQuery, selectedCategory, sortBy])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 border-b border-border pb-8">
            <div className="text-xs uppercase tracking-[0.22em] text-accent">Notre selection</div>
            <h1 className="font-display text-4xl font-medium md:text-5xl">Catalogue</h1>
            <p className="max-w-2xl text-muted-foreground">
              Confitures, liqueurs, chocolats, sirops et coffrets : retrouvez les signatures gourmandes Maison Cerisette.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="space-y-8">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Recherche
                </div>
                <div className="flex items-center rounded-full border border-border bg-background pl-3 focus-within:border-accent">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Confiture, liqueur, coffret..."
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Collections
                </div>
                <ul className="space-y-1">
                  {categoryOptions.map((category) => (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
                          selectedCategory === category.id
                            ? "bg-accent/15 font-medium text-accent"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Trier par
                </div>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as "latest" | "price-low" | "price-high")}
                  className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
                >
                  <option value="latest">Recents</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix decroissant</option>
                </select>
              </div>
            </aside>

            <div>
              <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {filtered.length} {t("product", "produit")}{filtered.length > 1 ? "s" : ""}
                </span>
                {selectedCategory !== "all" ? (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="text-accent hover:underline"
                  >
                    Reinitialiser la collection
                  </button>
                ) : null}
              </div>

              {loading ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                  Chargement des produits...
                </div>
              ) : error ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                  Impossible de charger les produits pour le moment.
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((product) => (
                    <BookProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">Aucun produit ne correspond a votre recherche.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                      setSortBy("latest")
                    }}
                    className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                  >
                    Effacer les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

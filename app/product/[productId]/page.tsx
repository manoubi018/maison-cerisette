"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { getRelatedCatalogProducts } from "@/lib/catalog-products"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/language-context"
import { useCatalogProducts } from "@/lib/use-catalog-products"

export default function ProductPage() {
  const params = useParams()
  const rawProductId = params?.productId
  const productId = Array.isArray(rawProductId) ? rawProductId[0] : rawProductId
  const { products, categories, loading, error } = useCatalogProducts()
  const product = products.find((p) => p.id === String(productId ?? ""))
  const { addItem } = useCart()
  const { t } = useLanguage()

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [stockMessage, setStockMessage] = useState<string | null>(null)

  const relatedProducts = useMemo(() => {
    if (!product) {
      return []
    }

    return getRelatedCatalogProducts(products, product.category, product.id, 4)
  }, [product, products])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">{t("Loading products...", "Chargement des produits...")}</h1>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">{t("Unable to load product", "Impossible de charger le produit")}</h1>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">{t("Product not found", "Produit introuvable")}</h1>
        </main>
        <Footer />
      </div>
    )
  }

  const category = categories.find((c) => c.slug === product.category)
  const estimatedPrice = product.price * quantity
  const isOutOfStock = product.stock <= 0

  const handleAddToCart = () => {
    if (isOutOfStock) {
      setStockMessage(t("This product is out of stock.", "Ce produit est en rupture de stock."))
      return
    }

    if (quantity > product.stock) {
      setStockMessage(
        t(
          `Only ${product.stock} item(s) available right now.`,
          `Seulement ${product.stock} article(s) disponible(s) pour le moment.`,
        ),
      )
      return
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    })
    setStockMessage(null)
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-primary">
                {t("Home", "Accueil")}
              </Link>
              <span>/</span>
              <Link href={`/products?category=${product.category}`} className="hover:text-primary">
                {category?.name ?? product.category}
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </div>
            <Link href="/cart" className="text-primary hover:underline">
              {t("View Cart", "Voir le panier")}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 sm:h-[500px] bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails would go here */}
              <div className="flex gap-4">
                <div className="relative w-24 h-24 bg-muted rounded cursor-pointer border-2 border-primary">
                  <img src={product.image || "/placeholder.svg"} alt="Main" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Header Info */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.origin} - {category?.name ?? product.category}
                </p>
                <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">*</span>
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} {t("reviews", "avis")})</span>
                </div>
              </div>

              {/* Product Badges */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-block bg-secondary/60 text-secondary-foreground text-xs font-semibold px-3 py-2">
                  {product.isNew
                    ? t("New arrival", "Nouveaute")
                    : t("Editor's pick", "Choix du libraire")}
                </span>
                <span className="inline-block bg-accent/15 text-accent text-xs font-semibold px-3 py-2">
                  {product.origin}
                </span>
                <span className="inline-block bg-muted text-muted-foreground text-xs font-semibold px-3 py-2">
                  {t("Carefully packed", "Emballe avec soin")}
                </span>
              </div>

              {/* Price & Quantity */}
              <div className="border-t border-b border-border py-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t("Unit price", "Prix unitaire")}</p>
                  {product.activeOffer ? (
                    <span className="mb-2 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                      {t("Active offer", "Offre active")}
                    </span>
                  ) : null}
                  <p className="text-4xl font-bold text-primary mb-4">{product.price.toFixed(2)} TND</p>
                  {product.activeOffer ? (
                    <p className="mb-4 text-sm text-muted-foreground">
                      <span className="line-through">{product.originalPrice.toFixed(2)} TND</span>
                    </p>
                  ) : null}
                  <p className={`text-sm font-medium ${isOutOfStock ? "text-red-600" : "text-emerald-700"}`}>
                    {isOutOfStock
                      ? t("Out of stock", "Rupture de stock")
                      : t(`${product.stock} item(s) in stock`, `${product.stock} article(s) en stock`)}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">{t("Quantity", "Quantite")}</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      max={Math.max(1, product.stock)}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.min(Math.max(1, Number(e.target.value)), Math.max(1, product.stock)))
                      }
                      className="w-20 px-3 py-2 border border-border rounded-lg"
                      disabled={isOutOfStock}
                    />
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-muted"
                      disabled={isOutOfStock}
                    >
                      -
                    </button>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-muted"
                      disabled={isOutOfStock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Estimated Price */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">{t("Estimated Total", "Total estime")}</p>
                  <p className="text-3xl font-bold text-primary">{estimatedPrice.toFixed(2)} TND</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button size="lg" onClick={handleAddToCart} className="w-full" disabled={isOutOfStock}>
                  {isOutOfStock
                    ? t("Out of Stock", "Rupture de stock")
                    : added
                      ? t("Added to Cart", "Ajoute au panier")
                      : t("Add to Cart", "Ajouter au panier")}
                </Button>
                {stockMessage ? <p className="text-sm text-red-600">{stockMessage}</p> : null}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/cart">
                    <Button size="lg" variant="outline" className="w-full bg-transparent">
                      {t("View Cart", "Voir le panier")}
                    </Button>
                  </Link>
                  <Link href={`/products?category=${product.category}`}>
                    <Button size="lg" variant="outline" className="w-full bg-transparent">
                      {t("More", "Plus de")} {category?.name ?? t("products", "produits")}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Description Sections */}
              <div className="space-y-6 border-t border-border pt-6">
                {/* Taste Profile */}
                <div>
                  <h3 className="font-semibold mb-2">{t("Reading Profile", "Profil de lecture")}</h3>
                  <p className="text-muted-foreground">{product.taste}</p>
                </div>

                {/* Recommended Recipes */}
                <div>
                  <h3 className="font-semibold mb-3">{t("Recommended For", "Recommande pour")}</h3>
                  <ul className="space-y-2">
                    {product.recipes.map((recipe, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary">-</span>
                        <span>{recipe}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cut Options */}
                <div>
                  <h3 className="font-semibold mb-3">{t("Available Options", "Options disponibles")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.cutOptions.map((cut, i) => (
                      <span key={i} className="px-3 py-1 border border-border rounded-full text-sm">
                        {cut}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Storage Advice */}
                <div>
                  <h3 className="font-semibold mb-2">{t("Care Advice", "Conseils d'entretien")}</h3>
                  <p className="text-muted-foreground text-sm">{product.storageAdvice}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-border py-12">
            <h2 className="text-3xl font-bold mb-8">{t("Customer Reviews", "Avis clients")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Tariq H.", rating: 5, text: t("Beautiful edition and careful packaging.", "Belle edition et emballage soigne.") },
                { name: "Nadia K.", rating: 5, text: t("Better than expected. Will order again!", "Mieux que prevu. Je recommanderai !") },
              ].map((review, i) => (
                <div key={i} className="border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className={j < review.rating ? "text-yellow-500" : "text-muted-foreground"}>
                        *
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-3">"{review.text}"</p>
                  <p className="font-semibold text-sm">{review.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-border py-12">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h2 className="text-3xl font-bold">{t("Related Products", "Produits similaires")}</h2>
                <Link href={`/products?category=${product.category}`} className="text-primary hover:underline">
                  {t("See all", "Voir tout")} {category?.name ?? t("products", "produits")}
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((related) => (
                  <Link key={related.id} href={`/product/${related.id}`}>
                    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative h-48 bg-muted overflow-hidden">
                        <img
                          src={related.image || "/placeholder.svg"}
                          alt={related.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2 group-hover:text-primary">{related.name}</h3>
                        <p className="text-lg font-bold text-primary">
                          {related.price.toFixed(2)} TND
                        </p>
                        {related.activeOffer ? (
                          <p className="text-xs text-muted-foreground line-through">
                            {related.originalPrice.toFixed(2)} TND
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

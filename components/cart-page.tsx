"use client"

import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useCatalogProducts } from "@/lib/use-catalog-products"

export function CartPageContent() {
  const { items, removeItem, updateItem, total } = useCart()
  const { t } = useLanguage()
  const { products } = useCatalogProducts()
  const deliveryFee = 8.5
  const cartTotal = total + deliveryFee
  const productsById = new Map(products.map((product) => [product.id, product]))
  const stockIssues = items
    .map((item) => {
      const product = productsById.get(item.productId)

      if (!product) {
        return {
          productId: item.productId,
          message: t("This product is no longer available.", "Ce produit n'est plus disponible."),
        }
      }

      if (product.stock <= 0) {
        return {
          productId: item.productId,
          message: t(`${item.name} is out of stock.`, `${item.name} est en rupture de stock.`),
        }
      }

      if (item.quantity > product.stock) {
        return {
          productId: item.productId,
          message: t(
            `Only ${product.stock} item(s) are available for ${item.name}.`,
            `Seulement ${product.stock} article(s) sont disponibles pour ${item.name}.`,
          ),
        }
      }

      return null
    })
    .filter((issue): issue is { productId: string; message: string } => issue !== null)
  const hasStockIssues = stockIssues.length > 0

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-2xl font-bold mb-4">{t("Your cart is empty", "Votre panier est vide")}</p>
        <p className="text-muted-foreground mb-8">
          {t(
            "Browse the Maison Cerisette catalog and add products to your cart",
            "Parcourez le catalogue Maison Cerisette et ajoutez des produits a votre panier",
          )}
        </p>
        <Link href="/products">
          <Button>{t("Continue Shopping", "Continuer mes achats")}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t("Shopping Cart", "Panier")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="bg-card border border-border rounded-lg p-6 flex gap-6">
              {(() => {
                const liveProduct = productsById.get(item.productId)
                const issue = stockIssues.find((stockIssue) => stockIssue.productId === item.productId)

                return (
                  <>
              <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-muted-foreground">
                    {item.price.toFixed(2)} TND x {item.quantity}
                  </p>
                  {liveProduct ? (
                    <p className={`mt-1 text-sm ${liveProduct.stock <= 0 ? "text-red-600" : "text-muted-foreground"}`}>
                      {liveProduct.stock <= 0
                        ? t("Out of stock", "Rupture de stock")
                        : t(`${liveProduct.stock} item(s) available`, `${liveProduct.stock} article(s) disponible(s)`)}
                    </p>
                  ) : null}
                  {issue ? <p className="mt-2 text-sm text-red-600">{issue.message}</p> : null}
                </div>

                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">{t("Qty:", "Qte :")}</label>
                    <button
                      type="button"
                      onClick={() => updateItem(item.productId, { quantity: Math.max(1, item.quantity - 1) })}
                      className="px-2 py-1 border border-border rounded"
                      disabled={!liveProduct || liveProduct.stock <= 0}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        liveProduct
                          ? updateItem(item.productId, {
                              quantity: Math.min(liveProduct.stock, item.quantity + 1),
                            })
                          : undefined
                      }
                      className="px-2 py-1 border border-border rounded"
                      disabled={!liveProduct || item.quantity >= liveProduct.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="text-xl font-bold text-primary">{(item.price * item.quantity).toFixed(2)} TND</p>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-destructive hover:text-destructive/80 text-sm font-semibold"
                >
                  {t("Remove", "Supprimer")}
                </button>
              </div>
                  </>
                )
              })()}
            </div>
          ))}
        </div>

        <div className="sticky top-20 h-fit">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-bold">{t("Order Summary", "Resume de commande")}</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("Subtotal", "Sous-total")}</span>
                <span>{total.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("Delivery Fee", "Frais de livraison")}</span>
                <span>{deliveryFee.toFixed(2)} TND</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span>{t("Total", "Total")}</span>
                <span className="text-primary">{cartTotal.toFixed(2)} TND</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
                <span>{t("Cart", "Panier")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                <span>{t("Shipping", "Livraison")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                <span>{t("Payment", "Paiement")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                <span>{t("Confirmation", "Confirmation")}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full" disabled={hasStockIssues}>
                {t("Proceed to Checkout", "Passer au paiement")}
              </Button>
            </Link>
            {hasStockIssues ? (
              <p className="text-sm text-red-600">
                {t(
                  "Adjust or remove unavailable items before checkout.",
                  "Ajustez ou supprimez les articles indisponibles avant de passer au paiement.",
                )}
              </p>
            ) : null}

            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full bg-transparent">
                {t("Continue Shopping", "Continuer mes achats")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

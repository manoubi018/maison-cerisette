"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useOrders } from "@/lib/orders-context"
import { useCart } from "@/lib/cart-context"
import { useCurrentAccount } from "@/lib/account-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

type ConfirmedApiOrder = {
  id: number
  status: string
  paymentMethod: "CACHE" | "ENLIGNE"
  createdAt: string
  total: number
  telephone: string
  shippingAddress: {
    city: string
    street: string
  } | null
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const { orders, loaded, addOrder } = useOrders()
  const { items, clearCart } = useCart()
  const { currentAccount } = useCurrentAccount()
  const { t, locale } = useLanguage()
  const [order, setOrder] = useState(orders[0])
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmationError, setConfirmationError] = useState("")
  const handledSessionIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!loaded) {
      return
    }

    const stripeSessionId = new URLSearchParams(window.location.search).get("session_id")

    if (stripeSessionId && handledSessionIdRef.current !== stripeSessionId) {
      handledSessionIdRef.current = stripeSessionId
      setIsConfirming(true)
      setConfirmationError("")

      void fetch("/api/payments/stripe/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(currentAccount.mode === "guest"
            ? { "x-guest-session-id": currentAccount.guestSessionId }
            : {}),
        },
        body: JSON.stringify({ sessionId: stripeSessionId }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as { message?: string } | null
            throw new Error(payload?.message ?? "Could not confirm Stripe payment")
          }

          return (await response.json()) as ConfirmedApiOrder
        })
        .then((confirmedOrder) => {
          const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const deliveryFee = Math.max(confirmedOrder.total - subtotal, 0)
          const localOrder = {
            id: String(confirmedOrder.id),
            items: items.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            subtotal,
            deliveryFee,
            total: confirmedOrder.total,
            status: "confirmed" as const,
            customerName: currentAccount.profile.fullName,
            phone: confirmedOrder.telephone,
            address: confirmedOrder.shippingAddress?.street ?? "",
            city: confirmedOrder.shippingAddress?.city ?? "",
            governorate: confirmedOrder.shippingAddress?.city ?? "",
            paymentMethod: confirmedOrder.paymentMethod === "ENLIGNE" ? ("online" as const) : ("cash" as const),
            createdAt: new Date(confirmedOrder.createdAt),
          }

          addOrder(localOrder)
          setOrder(localOrder)
          clearCart()
        })
        .catch((error) => {
          console.error("Stripe confirmation failed:", error)
          setConfirmationError(
            error instanceof Error
              ? error.message
              : t("Could not confirm your online payment.", "Impossible de confirmer votre paiement en ligne."),
          )
        })
        .finally(() => {
          setIsConfirming(false)
        })

      return
    }

    if (orders.length === 0) {
      router.push("/")
    } else {
      setOrder(orders[0])
    }
  }, [addOrder, clearCart, currentAccount, items, loaded, orders, router, t])

  if (!loaded || isConfirming) {
    return null
  }

  if (confirmationError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-16">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            <h1 className="mb-3 text-2xl font-bold">{t("Payment confirmation failed", "La confirmation du paiement a echoue")}</h1>
            <p>{confirmationError}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-16">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-6">
              <span className="text-3xl">*</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{t("Order Confirmed!", "Commande confirmee !")}</h1>
            <p className="text-xl text-muted-foreground mb-2">
              {t("Thank you for your order. We're preparing your products.", "Merci pour votre commande. Nous preparons vos produits.")}
            </p>
            <p className="text-lg font-semibold text-primary">{t("Order", "Commande")} #{order.id}</p>
          </div>

          {/* Order Details Card */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8 space-y-6">
            {/* Status Timeline */}
            <div>
              <h2 className="font-semibold mb-4">{t("Delivery Status", "Statut de livraison")}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 font-bold">
                    *
                  </div>
                  <div>
                    <p className="font-semibold">{t("Order Confirmed", "Commande confirmee")}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString(locale, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">{t("Preparing Your Order", "Preparation de votre commande")}</p>
                    <p className="text-sm text-muted-foreground">{t("We're packing your products with care", "Nous emballons vos produits avec soin")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">{t("On the Way", "En route")}</p>
                    <p className="text-sm text-muted-foreground">{t("Your order will be delivered within 24 hours", "Votre commande sera livree sous 24h")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">{t("Delivered", "Livree")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("Expected by", "Prevue pour le")} {order.estimatedDelivery?.toLocaleDateString(locale)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border-t border-border pt-6">
              <h2 className="font-semibold mb-3">{t("Delivery Address", "Adresse de livraison")}</h2>
              <p className="text-muted-foreground">
                {order.customerName}
                <br />
                {order.address}
                <br />
                {order.city}, {order.governorate}
                <br />
                {order.phone}
              </p>
            </div>

            {/* Order Items */}
            <div className="border-t border-border pt-6">
              <h2 className="font-semibold mb-4">{t("Order Items", "Articles commandes")}</h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} TND</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-border pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Subtotal", "Sous-total")}</span>
                <span>{order.subtotal.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("Delivery", "Livraison")}</span>
                <span>{order.deliveryFee.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>{t("Total", "Total")}</span>
                <span className="text-primary">{order.total.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-muted-foreground">{t("Payment Method", "Methode de paiement")}</span>
                  <span className="font-semibold">
                  {order.paymentMethod === "cash"
                    ? t("Cash on Delivery", "Paiement en especes")
                    : t("Online Payment", "Paiement en ligne")}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-3">{t("What's Next?", "Et maintenant ?")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>* {t("We'll prepare your order carefully", "Nous preparons votre commande avec soin")}</li>
              <li>* {t("You'll receive an SMS update when your order is on the way", "Vous recevrez un SMS quand votre commande sera en route")}</li>
              <li>* {t("Our driver will contact you before delivery", "Notre livreur vous contactera avant la livraison")}</li>
              <li>* {t("Need help? Contact us on WhatsApp", "Besoin d'aide ? Contactez-nous sur WhatsApp")}</li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/account/orders/${order.id}`} className="flex-1">
              <Button variant="outline" size="lg" className="w-full bg-transparent">
                {t("Track Order", "Suivre la commande")}
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button size="lg" className="w-full">
                {t("Continue Shopping", "Continuer mes achats")}
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground mb-4">{t("Need help with your order?", "Besoin d'aide pour votre commande ?")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+216" className="text-primary hover:underline font-semibold">
                Call +216 XX XXX XXXX
              </a>
              <a
                href="https://wa.me/216"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                {t("WhatsApp Support", "Support WhatsApp")}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

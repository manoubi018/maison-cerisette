"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useOrders } from "@/lib/orders-context"
import { useLanguage } from "@/lib/language-context"

export default function OrderDetailPage() {
  const params = useParams()
  const rawOrderId = params?.orderId
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId
  const { getOrder, loaded } = useOrders()
  const { t, locale } = useLanguage()
  const order = getOrder(String(orderId ?? ""))
  const getStatusLabel = (status: "pending" | "confirmed" | "shipped" | "delivered") => {
    if (status === "pending") return t("Pending", "En attente")
    if (status === "confirmed") return t("Confirmed", "Confirmee")
    if (status === "shipped") return t("Shipped", "Expediee")
    return t("Delivered", "Livree")
  }

  if (!loaded) {
    return (
      <div className="rounded-3xl border border-border bg-card px-6 py-16 text-center">
        <p className="text-muted-foreground">{t("Loading order...", "Chargement de la commande...")}</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="rounded-3xl border border-border bg-card px-6 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">{t("Order not found", "Commande introuvable")}</h1>
        <Link href="/account/orders">
          <Button>{t("Back to Orders", "Retour aux commandes")}</Button>
        </Link>
      </div>
    )
  }

  const statusSteps = [
    { key: "pending", label: t("Order Placed", "Commande passee"), detail: t("We have received your order.", "Nous avons bien recu votre commande.") },
    { key: "confirmed", label: t("Confirmed", "Confirmee"), detail: t("Payment and inventory confirmed.", "Paiement et stock confirmes.") },
    { key: "shipped", label: t("On the Way", "En route"), detail: t("Courier is on the route.", "Le livreur est en cours de route.") },
    { key: "delivered", label: t("Delivered", "Livree"), detail: t("Package delivered to your address.", "Colis livre a votre adresse.") },
  ]

  const currentStatusIndex = statusSteps.findIndex((step) => step.key === order.status)
  const createdAt = new Date(order.createdAt)
  const estimatedDelivery = order.estimatedDelivery ? new Date(order.estimatedDelivery) : new Date(createdAt.getTime() + 86400000)

  const timelineTimes = [
    createdAt,
    new Date(createdAt.getTime() + 2 * 60 * 60 * 1000),
    new Date(createdAt.getTime() + 8 * 60 * 60 * 1000),
    estimatedDelivery,
  ]

  const trackingId = `${order.id}-TN`

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6">
        <Link href="/account/orders" className="text-sm text-primary hover:underline">
          {t("Back to Orders", "Retour aux commandes")}
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold">{t("Track Order", "Suivi de commande")}</h1>
            <p className="text-lg text-muted-foreground">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t("Tracking ID", "ID de suivi")}</p>
            <p className="font-semibold">{trackingId}</p>
            <p className="mt-2 text-xs text-muted-foreground">{t("Status", "Statut")}</p>
            <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {getStatusLabel(order.status)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="text-2xl font-bold mb-6">{t("Delivery Status", "Statut de livraison")}</h2>
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex
                    const isCurrent = index === currentStatusIndex

                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                              isCompleted
                                ? isCurrent
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-accent/20 text-accent"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div
                              className={`w-1 h-12 my-2 ${isCompleted && index < currentStatusIndex ? "bg-accent" : "bg-muted"}`}
                            />
                          )}
                        </div>

                        <div className="flex-1 pt-2">
                          <p
                            className={`font-bold ${isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {step.label}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{step.detail}</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {timelineTimes[index].toLocaleString(locale, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {isCurrent && (
                            <p className="text-sm font-semibold text-primary mt-2">
                              {t("Estimated delivery:", "Livraison estimee :")} {estimatedDelivery.toLocaleDateString(locale)}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

          <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="text-2xl font-bold mb-6">{t("Live Tracking", "Suivi en direct")}</h2>
                <div className="rounded-lg border border-dashed border-border h-56 flex items-center justify-center bg-muted/30">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">{t("Courier route preview", "Apercu de la route du livreur")}</p>
                    <p className="text-lg font-semibold">Maison Cerisette Delivery</p>
                    <p className="text-xs text-muted-foreground">{t("Live map updates appear here during delivery.", "Les mises a jour de carte apparaitront ici pendant la livraison.")}</p>
                  </div>
                </div>
              </div>

          <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="text-2xl font-bold mb-6">{t("Order Items", "Articles commandes")}</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center pb-4 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} x {item.price.toFixed(2)} TND</p>
                      </div>
                      <p className="font-bold text-lg text-primary">
                        {(item.price * item.quantity).toFixed(2)} TND
                      </p>
                    </div>
                  ))}
                </div>
              </div>

          <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="text-2xl font-bold mb-4">{t("Delivery Address", "Adresse de livraison")}</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p className="font-semibold text-foreground">{order.customerName}</p>
                  <p>{order.address}</p>
                  <p>
                    {order.city}, {order.governorate}
                  </p>
                  <p className="font-semibold text-foreground pt-2">{order.phone}</p>
                </div>
              </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6">
                <h3 className="font-bold text-lg">{t("Order Summary", "Resume de commande")}</h3>

                <div className="space-y-3 text-sm border-b border-border pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("Subtotal", "Sous-total")}</span>
                    <span>{order.subtotal.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("Delivery Fee", "Frais de livraison")}</span>
                    <span>{order.deliveryFee.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>{t("Total", "Total")}</span>
                    <span className="text-primary">{order.total.toFixed(2)} TND</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold">{t("Payment Method", "Methode de paiement")}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.paymentMethod === "cash"
                      ? t("Cash on Delivery", "Paiement en especes")
                      : t("Online Payment", "Paiement en ligne")}
                  </p>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t("Order Date", "Date de commande")}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(locale, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="space-y-2 pt-4">
                  <Link href="/products">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      {t("Order Similar Items", "Commander des articles similaires")}
                    </Button>
                  </Link>
                  <a href="https://wa.me/216" target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="w-full">
                      {t("Contact Support", "Contacter le support")}
                    </Button>
                  </a>
                </div>
              </div>

            <div className="rounded-3xl border border-primary/20 bg-primary/10 p-6">
                <h3 className="font-bold mb-3">{t("Need Help?", "Besoin d'aide ?")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("Contact our support team if you have any questions about your order.", "Contactez notre support si vous avez des questions sur votre commande.")}
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <a href="tel:+216" className="text-primary hover:underline font-semibold">
                      +216 XX XXX XXXX
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://wa.me/216"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      {t("WhatsApp Support", "Support WhatsApp")}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

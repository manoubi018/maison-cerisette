"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useOrders } from "@/lib/orders-context"
import { useLanguage } from "@/lib/language-context"

export default function OrdersPage() {
  const { orders } = useOrders()
  const { t, locale } = useLanguage()
  const getStatusLabel = (status: "pending" | "confirmed" | "shipped" | "delivered") => {
    if (status === "pending") return t("Pending", "En attente")
    if (status === "confirmed") return t("Confirmed", "Confirmee")
    if (status === "shipped") return t("Shipped", "Expediee")
    return t("Delivered", "Livree")
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6">
        <h1 className="text-3xl font-bold">{t("Order History", "Historique des commandes")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          {t(
            "Track every delivery and reopen past orders from one timeline.",
            "Suivez chaque livraison et retrouvez vos commandes precedentes depuis une seule timeline.",
          )}
        </p>
      </section>

      {orders.length === 0 ? (
        <section className="rounded-3xl border border-border bg-card p-12 text-center">
          <p className="mb-4 text-muted-foreground">
            {t("You haven't placed any orders yet.", "Vous n'avez pas encore passe de commande.")}
          </p>
          <Link href="/products">
            <Button>{t("Start Shopping", "Commencer les achats")}</Button>
          </Link>
        </section>
      ) : (
        <section className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <div className="rounded-3xl border border-border bg-card p-6 transition hover:shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-lg font-bold">{order.id}</p>
                    <p className="mb-2 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString(locale)}
                    </p>
                    <p className="text-sm">
                      {order.items.length} {t("items", "articles")}
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="mb-1 text-sm text-muted-foreground">{t("Status", "Statut")}</p>
                    <p
                      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                        order.status === "confirmed"
                          ? "bg-accent/20 text-accent"
                          : order.status === "shipped"
                            ? "bg-blue-500/20 text-blue-600"
                            : order.status === "delivered"
                              ? "bg-green-500/20 text-green-600"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {getStatusLabel(order.status)}
                    </p>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="mb-1 text-sm text-muted-foreground">{t("Total", "Total")}</p>
                    <p className="text-lg font-bold text-primary">{order.total.toFixed(2)} TND</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  )
}

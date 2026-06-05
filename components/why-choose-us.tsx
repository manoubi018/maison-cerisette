"use client"

import { Cherry, CreditCard, PackageCheck, Truck } from "lucide-react"

import { useLanguage } from "@/lib/language-context"

export function WhyChooseUs() {
  const { language, t } = useLanguage()

  const reasons =
    language === "fr"
      ? [
          {
            icon: Cherry,
            title: "Selection gourmande",
            description: "Un catalogue edite autour de la cerise, des confitures aux coffrets.",
          },
          {
            icon: PackageCheck,
            title: "Preparation propre",
            description: "Chaque commande est verifiee et emballee avec soin.",
          },
          {
            icon: CreditCard,
            title: "Paiements securises",
            description: "Carte bancaire ou paiement a la livraison selon votre preference.",
          },
          {
            icon: Truck,
            title: "Livraison fiable",
            description: "Expedition organisee partout en Tunisie.",
          },
        ]
      : [
          {
            icon: Cherry,
            title: "Curated gourmet selection",
            description: "An edited cherry catalog from preserves to gift boxes.",
          },
          {
            icon: PackageCheck,
            title: "Careful preparation",
            description: "Every order is checked and packed with attention.",
          },
          {
            icon: CreditCard,
            title: "Secure payments",
            description: "Card payment or cash on delivery depending on your preference.",
          },
          {
            icon: Truck,
            title: "Reliable delivery",
            description: "Organized shipping across Tunisia.",
          },
        ]

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {t("Service", "Service")}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-balance">
            {t("Why choose Maison Cerisette?", "Pourquoi choisir Maison Cerisette ?")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {t(
              "The same commerce features, wrapped in a refined gourmet experience.",
              "Les memes fonctionnalites e-commerce dans une experience epicerie fine elegante.",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => {
            const Icon = reason.icon

            return (
              <div key={reason.title} className="bg-card border border-border p-7 text-center hover:shadow-lg transition-shadow">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-border bg-muted text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{reason.title}</h3>
                <p className="text-sm text-muted-foreground">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

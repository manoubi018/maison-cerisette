"use client"

import Link from "next/link"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  const reasons = [
    {
      title: t("Curated catalog", "Catalogue selectionne"),
      description: t(
        "Collections are organized to make discovery fast, calm, and useful.",
        "Les collections sont organisees pour une decouverte rapide, calme et utile.",
      ),
    },
    {
      title: t("Careful packaging", "Emballage soigne"),
      description: t(
        "Orders are prepared to protect jars, bottles, and chocolates during delivery.",
        "Les commandes sont preparees pour proteger pots, bouteilles et chocolats pendant la livraison.",
      ),
    },
    {
      title: t("Transparent pricing", "Prix transparents"),
      description: t(
        "Clear prices, visible offers, and no hidden steps at checkout.",
        "Prix clairs, offres visibles et aucune etape cachee au paiement.",
      ),
    },
    {
      title: t("Customer first", "Client d'abord"),
      description: t(
        "Account, orders, addresses, and support remain easy to manage.",
        "Compte, commandes, adresses et support restent faciles a gerer.",
      ),
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/70">
              Maison Cerisette
            </p>
            <h1 className="text-4xl font-semibold mb-4">{t("About Maison Cerisette", "A propos de Maison Cerisette")}</h1>
            <p className="text-lg text-primary-foreground/90">
              {t(
                "A refined gourmet shopping experience built on the same commerce platform.",
                "Une experience epicerie fine construite sur la meme plateforme e-commerce.",
              )}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">{t("Our Story", "Notre histoire")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-muted-foreground mb-4">
                  {t(
                    "Maison Cerisette keeps the existing client application features: catalog, cart, checkout, account, orders, offers, payments, and delivery flow.",
                    "Maison Cerisette conserve les fonctionnalites de l'application client : catalogue, panier, paiement, compte, commandes, offres et livraison.",
                  )}
                </p>
                <p className="text-muted-foreground mb-4">
                  {t(
                    "The visual layer follows the cherry-house mockup with a warmer artisanal identity.",
                    "La couche visuelle suit le mockup Maison Cerisette avec une identite artisanale plus chaleureuse.",
                  )}
                </p>
              </div>
              <div className="bg-secondary/35 border border-border p-8 flex flex-col justify-center">
                <p className="text-2xl font-semibold text-primary mb-2">
                  {t("Same features, new template", "Memes fonctionnalites, nouveau template")}
                </p>
                <p className="text-muted-foreground">
                  {t(
                    "The configuration and business routes remain aligned with the original client app.",
                    "La configuration et les routes metier restent alignees avec l'application client d'origine.",
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-8">{t("Why Choose Maison Cerisette", "Pourquoi choisir Maison Cerisette")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reasons.map((item) => (
                <div key={item.title} className="bg-card border border-border p-6">
                  <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center py-12 bg-secondary/35 border border-border">
            <h2 className="text-3xl font-semibold mb-4">
              {t("Ready to explore the catalog?", "Pret a explorer le catalogue ?")}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t(
                "Browse the gourmet catalog and complete your order through the existing checkout flow.",
                "Parcourez le catalogue gourmand et finalisez votre commande avec le parcours de paiement existant.",
              )}
            </p>
            <Link href="/products">
              <Button size="lg">{t("Open catalog", "Ouvrir le catalogue")}</Button>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

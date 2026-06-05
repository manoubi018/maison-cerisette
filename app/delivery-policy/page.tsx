"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

export default function DeliveryPolicyPage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">{t("Delivery Policy", "Politique de livraison")}</h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Delivery Areas", "Zones de livraison")}</h2>
              <p className="text-muted-foreground mb-4">
                {t(
                  "Maison Cerisette delivers across all governorates of Tunisia. Standard delivery takes 24 hours from order placement. Same-day delivery is available in major cities for orders placed before 10 AM.",
                  "Maison Cerisette livre dans tous les gouvernorats de Tunisie. La livraison standard prend 24h. Une livraison le jour-meme est possible dans les grandes villes pour les commandes avant 10h.",
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Delivery Fees", "Frais de livraison")}</h2>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>{t("Standard Delivery (24h): 8.5 TND", "Livraison standard (24h) : 8.5 TND")}</li>
                <li>{t("Same-Day Delivery (Major Cities): 15.0 TND", "Livraison le jour-meme (grandes villes) : 15.0 TND")}</li>
                <li>{t("Free delivery on orders over 300 TND (standard only)", "Livraison gratuite au-dessus de 300 TND (standard)")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Packaging", "Emballage")}</h2>
              <p className="text-muted-foreground mb-2">
                {t(
                  "Orders are packed carefully to protect jars, bottles, and chocolates during transit.",
                  "Les commandes sont emballees dans des glacières isolees pour garder la temperature optimale.",
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Delivery Day & Time", "Jour et heure de livraison")}</h2>
              <p className="text-muted-foreground mb-2">
                {t(
                  "You receive an SMS with your delivery window. The driver calls before arrival.",
                  "Vous recevez un SMS avec votre plage de livraison. Le livreur appelle avant d'arriver.",
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Receiving Your Order", "Reception de votre commande")}</h2>
              <p className="text-muted-foreground mb-2">
                {t(
                  "Inspect your order immediately and contact us in case of issue.",
                  "Verifiez votre commande a la reception et contactez-nous en cas de probleme.",
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Contact & Support", "Contact et assistance")}</h2>
              <p className="text-muted-foreground">
                {t(
                  "For delivery issues, contact us via WhatsApp, phone, or email.",
                  "Pour tout souci de livraison, contactez-nous via WhatsApp, telephone ou email.",
                )}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

export default function RefundPolicyPage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">{t("Refund Policy", "Politique de remboursement")}</h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Condition Guarantee", "Garantie d'etat")}</h2>
              <p className="text-muted-foreground mb-4">
                {t(
                  "If your order arrives damaged or not as described, you are entitled to a refund or replacement.",
                  "Si votre commande arrive endommagee, non fraiche ou non conforme, vous avez droit a un remboursement ou un remplacement.",
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Return Window", "Delai de reclamation")}</h2>
              <p className="text-muted-foreground mb-4">
                {t(
                  "Issues must be reported within 24 hours of delivery with photos.",
                  "Les problemes doivent etre signales dans les 24h avec des photos.",
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Refund Process", "Processus de remboursement")}</h2>
              <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                <li>{t("Contact us within 24 hours with details", "Contactez-nous dans les 24h avec les details")}</li>
                <li>{t("Our team reviews your request", "Notre equipe analyse votre demande")}</li>
                <li>{t("COD orders: refund after verification", "Commandes COD : remboursement apres verification")}</li>
                <li>{t("Card orders: refund to original method in 3-5 business days", "Carte : remboursement sur le moyen initial en 3-5 jours ouvres")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Non-Refundable Items", "Articles non remboursables")}</h2>
              <p className="text-muted-foreground mb-2">
                {t(
                  "Items damaged after delivery or returned in poor condition cannot be refunded.",
                  "Les articles partiellement consommes ou mal conserves apres livraison ne sont pas remboursables.",
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Contact Us", "Contactez-nous")}</h2>
              <p className="text-muted-foreground">
                {t(
                  "For refund inquiries, contact us via WhatsApp, phone, or email with your order number.",
                  "Pour une demande de remboursement, contactez-nous via WhatsApp, telephone ou email avec votre numero de commande.",
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

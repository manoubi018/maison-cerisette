"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">{t("Privacy Policy", "Politique de confidentialite")}</h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Data Collection", "Collecte des donnees")}</h2>
              <p className="text-muted-foreground mb-4">
                {t(
                  "Maison Cerisette collects personal information needed to process orders and provide customer support.",
                  "Maison Cerisette collecte les informations personnelles necessaires au traitement des commandes et au support client.",
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Data Protection", "Protection des donnees")}</h2>
              <p className="text-muted-foreground mb-4">
                {t(
                  "Your data is stored securely and shared only with trusted delivery partners when required.",
                  "Vos donnees sont stockees de maniere securisee et partagees uniquement avec des partenaires de livraison de confiance.",
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Cookies</h2>
              <p className="text-muted-foreground mb-4">
                {t(
                  "We use cookies to improve your browsing experience and keep your cart session active.",
                  "Nous utilisons des cookies pour ameliorer votre navigation et conserver votre panier actif.",
                )}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">{t("Contact & Rights", "Droits et contact")}</h2>
              <p className="text-muted-foreground">
                {t(
                  "You may request access, modification, or deletion of your personal data at any time.",
                  "Vous pouvez demander a tout moment l'acces, la modification ou la suppression de vos donnees personnelles.",
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

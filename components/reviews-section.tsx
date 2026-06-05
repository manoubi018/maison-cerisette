"use client"

import { Star } from "lucide-react"

import { useLanguage } from "@/lib/language-context"

export function ReviewsSection() {
  const { language, t } = useLanguage()
  const reviews =
    language === "fr"
      ? [
          {
            name: "Meriem B.",
            city: "Tunis",
            rating: 5,
            text: "Commande propre, produits bien proteges et livraison rapide.",
          },
          {
            name: "Ahmed M.",
            city: "Sfax",
            rating: 5,
            text: "Le catalogue est clair, j'ai retrouve mes coffrets facilement.",
          },
          {
            name: "Leila K.",
            city: "Sousse",
            rating: 4,
            text: "Belle experience d'achat et service client reactif.",
          },
          {
            name: "Karim L.",
            city: "Nabeul",
            rating: 5,
            text: "Paiement a la livraison pratique. Je recommanderai.",
          },
        ]
      : [
          {
            name: "Meriem B.",
            city: "Tunis",
            rating: 5,
            text: "Clean order, well protected products, and fast delivery.",
          },
          {
            name: "Ahmed M.",
            city: "Sfax",
            rating: 5,
            text: "The catalog is clear and I found my gift boxes quickly.",
          },
          {
            name: "Leila K.",
            city: "Sousse",
            rating: 4,
            text: "A polished shopping experience with responsive support.",
          },
          {
            name: "Karim L.",
            city: "Nabeul",
            rating: 5,
            text: "Cash on delivery is practical. I will order again.",
          },
        ]

  return (
    <section className="py-16 bg-muted/35">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-balance mb-4">
            {t("Loved by Tunisian customers", "Apprecie par les clients tunisiens")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("A smoother way to order gourmet products online.", "Une facon plus fluide de commander des produits gourmands en ligne.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div key={`${review.name}-${review.city}`} className="bg-card border border-border p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <p className="text-sm mb-4 text-muted-foreground">"{review.text}"</p>

              <div className="border-t border-border pt-4">
                <p className="font-semibold text-sm">{review.name}</p>
                <p className="text-xs text-muted-foreground">
                  {review.city}, {t("Tunisia", "Tunisie")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

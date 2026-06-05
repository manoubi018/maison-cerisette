"use client"

import { useLanguage } from "@/lib/language-context"

export function LocationIndicators() {
  const { t } = useLanguage()

  return (
    <section className="bg-secondary/35 border-y border-border py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-3xl font-serif text-primary">G</span>
            <div>
              <p className="text-sm text-muted-foreground">{t("Selected by", "Selectionne par")}</p>
              <p className="font-semibold">Maison Cerisette</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border" />
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-2xl font-serif text-primary">TN</span>
            <div>
              <p className="text-sm text-muted-foreground">{t("Delivered across", "Livre partout en")}</p>
              <p className="font-semibold">Tunisia</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border" />
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-2xl font-serif text-primary">24</span>
            <div>
              <p className="text-sm text-muted-foreground">{t("Prepared within", "Prepare sous")}</p>
              <p className="font-semibold">{t("24 hours", "24 heures")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

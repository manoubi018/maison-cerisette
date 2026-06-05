"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"

import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-24 border-t border-border bg-secondary/45">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image src="/hero-cherries.jpg" alt="" fill className="object-cover" sizes="48px" />
            </span>
            <div>
              <div className="font-display text-lg font-semibold">Maison Cerisette</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Depuis 1962
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {t(
              "A family cherry house crafting preserves, liqueurs, chocolates, and syrups in small batches.",
              "Une maison familiale dediee a la cerise, des confitures aux liqueurs en petites series.",
            )}
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border border-border p-2 hover:border-accent hover:text-accent">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full border border-border p-2 hover:border-accent hover:text-accent">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

          <div>
            <h3 className="font-display text-base font-semibold">{t("Quick Links", "Visiter")}</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground">
                  {t("Catalog", "Catalogue")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  {t("Our story", "La maison")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  {t("Contact", "Contact")}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-foreground">
                  {t("Cart", "Mon panier")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold">{t("Contact", "Nous trouver")}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Tunis, Tunisie</span>
              </li>
              <li>
                <a href="tel:+216" className="flex gap-2 hover:text-foreground"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> +216 XX XXX XXXX</a>
              </li>
              <li>
                <a href="mailto:contact@maison-cerisette.tn" className="flex gap-2 hover:text-foreground"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> contact@maison-cerisette.tn</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-semibold">{t("Policies", "Horaires")}</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  Mar - Sam : 10h - 19h30
                  <br />
                  Dim : 11h - 18h
                  <br />
                  Lun : ferme
                </span>
              </li>
            </ul>
          </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          {t("Copyright 2026 Maison Cerisette. All rights reserved.", "Copyright 2026 Maison Cerisette. Tous droits reserves.")}
        </div>
      </div>
    </footer>
  )
}

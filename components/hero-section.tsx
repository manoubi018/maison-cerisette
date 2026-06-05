"use client"

import Image from "next/image"
import Link from "next/link"
import { Cherry, Search } from "lucide-react"

import { useLanguage } from "@/lib/language-context"

const heroImage = "/hero-cherries.jpg"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/45">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>
              {t("Artisan cherry house since 1962", "Maison artisanale de la cerise depuis 1962")}
            </span>
          </div>

          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.05] tracking-tight text-foreground md:text-6xl">
            L'art de la cerise,
            <br />
            <span className="italic text-accent">cueillie et preservee.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            Confitures, liqueurs, chocolats et sirops artisanaux prepares en petites
            series avec des cerises selectionnees.
          </p>

          <form className="mt-7 flex w-full max-w-xl items-center rounded-full border border-border bg-background pl-4 shadow-sm focus-within:border-accent">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              aria-label="Recherche"
              placeholder="Rechercher une confiture, une liqueur, un coffret..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Link
              href="/products"
              className="m-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90"
            >
              Explorer
            </Link>
          </form>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-xl">
            <Image
              src={heroImage}
              alt="Cerises fraiches Maison Cerisette"
              width={1600}
              height={1000}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-border bg-background p-4 shadow-lg sm:block">
            <div className="flex items-center gap-3">
              <Cherry className="h-5 w-5 text-accent" />
              <div>
                <div className="font-display text-sm font-semibold">Petites series</div>
                <div className="text-xs text-muted-foreground">sans conservateurs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

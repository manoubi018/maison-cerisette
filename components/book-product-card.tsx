"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import type { CatalogProduct } from "@/lib/catalog-products"
import { useLanguage } from "@/lib/language-context"

const coverColors = [
  "from-sky-500 to-sky-700",
  "from-slate-800 to-slate-950",
  "from-rose-500 to-red-800",
  "from-amber-500 to-orange-700",
  "from-emerald-500 to-teal-800",
  "from-indigo-500 to-blue-900",
]

export function BookProductCard({ product }: { product: CatalogProduct }) {
  const { t } = useLanguage()
  const color = coverColors[Number(product.id) % coverColors.length]
  const hasProductImage = Boolean(product.image && product.image !== "/placeholder.svg")

  return (
    <article className="group flex flex-col">
      <Link href={`/product/${product.id}`} className="relative block">
        <div
          className={`relative aspect-[2/3] w-full overflow-hidden rounded-sm shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:-translate-y-1 ${
            hasProductImage ? "bg-muted" : `bg-gradient-to-br ${color} text-white`
          }`}
        >
          {hasProductImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <>
              <div className="absolute inset-y-0 left-0 w-[6%] bg-black/30" />
              <div className="flex h-full flex-col justify-between p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">Maison Cerisette</div>
                <div>
                  <h3 className="font-display text-lg leading-tight">{product.name}</h3>
                  <p className="mt-2 text-[11px] uppercase tracking-widest text-white/80">
                    {product.origin || t("House selection", "Selection maison")}
                  </p>
                </div>
              </div>
            </>
          )}
          {hasProductImage ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3 text-white">
              <div className="line-clamp-2 font-display text-sm leading-tight">{product.name}</div>
            </div>
          ) : null}
        </div>
        {product.freshness === "arrived-today" ? (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            {t("Nouveaute", "Nouveaute")}
          </span>
        ) : null}
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={`/product/${product.id}`}
            className="block truncate font-display text-[15px] font-medium text-foreground hover:text-accent"
          >
            {product.name}
          </Link>
          <div className="truncate text-xs text-muted-foreground">
            {product.origin || t("House selection", "Selection maison")}
          </div>
        </div>
        <div className="shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
          {product.activeOffer ? (
            <div className="text-xs font-normal text-muted-foreground line-through">
              {product.originalPrice.toFixed(2)} TND
            </div>
          ) : null}
          {product.price.toFixed(2)} TND
        </div>
      </div>
      <Link
        href={`/product/${product.id}`}
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
        {t("View product", "Voir le produit")}
      </Link>
    </article>
  )
}

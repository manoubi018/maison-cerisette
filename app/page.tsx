"use client"

import Link from "next/link"

import type { CatalogProduct } from "@/lib/catalog-products"
import { useCart } from "@/lib/cart-context"
import { useCatalogProducts } from "@/lib/use-catalog-products"
import { useLanguage } from "@/lib/language-context"

const categories = [
  { name: "Confitures & Compotes", count: "12 produits", href: "/products?category=confitures" },
  { name: "Liqueurs & Spiritueux", count: "8 produits", href: "/products?category=liqueurs" },
  { name: "Chocolats & Confiseries", count: "15 produits", href: "/products?category=chocolats" },
  { name: "Sirops & Boissons", count: "6 produits", href: "/products?category=sirops" },
]

const reviews = [
  {
    text: "Une decouverte sublime. La confiture de cerise noire a un gout d'enfance, mais en plus raffine.",
    name: "Claire D.",
    city: "Lyon",
  },
  {
    text: "Les truffes coeur cerise sont absolument divines. Le packaging est a la hauteur du contenu.",
    name: "Antoine R.",
    city: "Paris",
  },
  {
    text: "La liqueur de griotte est une merveille. On retrouve la chaleur du sud et la patience du temps.",
    name: "Helene M.",
    city: "Bordeaux",
  },
]

const articles = [
  { title: "Le clafoutis comme grand-mere", category: "Recette", read: "6 min", img: "/blog-clafoutis.jpg" },
  { title: "Cocktail signature : La Cerisette", category: "Mixologie", read: "4 min", img: "/blog-cocktail.jpg" },
  { title: "Tarte rustique aux griottes", category: "Recette", read: "8 min", img: "/blog-tarte.jpg" },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbf7ef] text-[#2d1b18]">
      <Header />
      <main>
        <Hero />
        <Bestsellers />
        <Story />
        <Shop />
        <Newcomers />
        <Reviews />
        <Blog />
        <Contact />
      </main>
      <HomeFooter />
    </div>
  )
}

function CherryMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 52" className={className} aria-hidden="true">
      <path
        d="M21 23C17 12 20 5 29 2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M25 11c6-1 10 1 13 6-6 2-11 1-15-3"
        fill="currentColor"
        opacity=".55"
      />
      <circle cx="15" cy="33" r="12" fill="currentColor" />
      <circle cx="29" cy="35" r="11" fill="currentColor" opacity=".82" />
    </svg>
  )
}

function Header() {
  const { items } = useCart()
  const { language, setLanguage } = useLanguage()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 border-b border-[#e3d7cb] bg-[#fbf7f1]/95 backdrop-blur-md">
      <div className="flex h-[6.25rem] items-center px-3 sm:px-5 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-4">
          <span className="h-14 w-14 overflow-hidden rounded-full ring-1 ring-[#eadbd2] sm:h-16 sm:w-16">
            <img src="/hero-cherries.jpg" alt="Maison Cerisette" className="h-full w-full object-cover" />
          </span>
          <span className="leading-tight">
            <span className="block whitespace-nowrap font-serif text-[1.65rem] font-bold leading-none text-[#7a1022] lg:text-[1.85rem]">
              Maison Cerisette
            </span>
            <span className="mt-1 block text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#6b5e58]">
              Depuis 1962
            </span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 md:flex lg:gap-7">
          <Link href="/" className="rounded-full px-5 py-2 text-[1.35rem] font-medium text-[#5f554f] transition-colors hover:bg-[#f0d1d7]/70 hover:text-[#b8143b]">
            Home
          </Link>
          <Link href="/products" className="rounded-full bg-[#f0d1d7] px-5 py-2 text-[1.35rem] font-medium text-[#b8143b] transition-colors hover:bg-[#e8c1ca]">
            Catalog
          </Link>
          <a href="#histoire" className="rounded-full px-5 py-2 text-[1.35rem] font-medium text-[#5f554f] transition-colors hover:bg-[#f0d1d7]/70 hover:text-[#b8143b]">
            About
          </a>
          <a href="#contact" className="rounded-full px-5 py-2 text-[1.35rem] font-medium text-[#5f554f] transition-colors hover:bg-[#f0d1d7]/70 hover:text-[#b8143b]">
            Contact
          </a>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
          <Link href="/products" aria-label="Recherche" className="hidden h-11 w-11 items-center justify-center rounded-full text-[#4f4640] transition hover:bg-[#f0d1d7]/70 hover:text-[#b8143b] sm:flex">
            <SearchIcon />
          </Link>

          <Link href="/cart" className="inline-flex h-14 items-center gap-3 rounded-full bg-[#b8143b] px-5 text-xl font-bold text-white shadow-sm transition hover:bg-[#9f102f] sm:px-6">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-white/90">
              <BagIcon />
            </span>
            <span className="hidden sm:inline">Cart</span>
            <span className="grid h-7 min-w-7 place-items-center rounded-full bg-white/18 px-2 text-base font-bold tabular-nums">
              {cartCount}
            </span>
          </Link>

          <div className="hidden h-12 items-center rounded-full border border-[#e3d5cc] bg-[#fffaf5] p-0.5 sm:flex">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`h-10 rounded-full px-4 text-base font-bold transition ${
                language === "en" ? "bg-[#f0d1d7] text-[#b8143b]" : "text-[#5f554f]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              className={`h-10 rounded-full px-4 text-base font-bold transition ${
                language === "fr" ? "bg-[#f0d1d7] text-[#b8143b]" : "text-[#5f554f]"
              }`}
            >
              FR
            </button>
          </div>

          <Link href="/account" aria-label="Compte" className="flex h-11 w-11 items-center justify-center rounded-full text-[#1f1714] transition hover:bg-[#f0d1d7]/70">
            <UserIcon />
          </Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute -left-32 -top-20 h-[28rem] w-[28rem] rounded-[62%_38%_55%_45%/50%_60%_40%_50%] bg-[#f2e7d4]" />
      <div className="absolute right-0 top-40 h-72 w-72 rounded-[0_100%_0_100%] bg-[#557a55]/10" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-12 lg:grid-cols-12 lg:px-10 lg:pb-32 lg:pt-20">
        <div className="lg:col-span-6">
          <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9d183d]">
            <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-[#9d183d] align-middle" />
            Maison artisanale francaise
          </div>
          <h1 className="font-serif text-5xl leading-[1.05] text-[#4b1020] lg:text-7xl">
            L&apos;art de la cerise,
            <br />
            <em className="font-light italic text-[#3f6b45]">cueillie</em> et preservee
            <span className="text-[#9d183d]">.</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#665a52]">
            Depuis trois generations, nous transformons les cerises de nos vergers en confitures, liqueurs et douceurs d&apos;exception.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-[#9d183d] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#4b1020]">
              Decouvrir la boutique
              <ArrowIcon />
            </Link>
            <a href="#histoire" className="rounded-full border border-[#4b1020]/30 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#4b1020] transition hover:border-[#9d183d] hover:bg-[#9d183d] hover:text-white">
              Notre histoire
            </a>
          </div>
          <div className="mt-14 flex items-center gap-8 text-xs text-[#7f6f66]">
            <Stat n="62 ans" l="de savoir-faire" />
            <Divider />
            <Stat n="100%" l="artisanat" />
            <Divider />
            <Stat n="Sans" l="conservateurs" />
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[62%_38%_55%_45%/50%_60%_40%_50%] bg-[#f2e7d4]" />
            <img
              src="/hero-cherries.jpg"
              alt="Bol de cerises fraiches"
              className="h-[28rem] w-full rounded-[2rem] object-cover shadow-2xl lg:h-[32rem]"
            />
            <div className="absolute -bottom-6 left-4 max-w-[14rem] rounded-2xl border border-[#eadfce] bg-white p-5 shadow-xl sm:-left-6">
              <div className="mb-1 flex items-center gap-2 text-[#9d183d]">
                <CherryMark className="h-6 w-5" />
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em]">Recolte 2025</div>
              </div>
              <p className="font-serif text-base leading-snug text-[#4b1020]">
                Cerises noires selectionnees et preparees en petites series.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-serif text-2xl text-[#4b1020]">{n}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em]">{l}</div>
    </div>
  )
}

function Divider() {
  return <div className="h-10 w-px bg-[#eadfce]" />
}

function Bestsellers() {
  const { products, loading, error } = useCatalogProducts()
  const bestSellers = [...products]
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .slice(0, 4)

  return (
    <section className="bg-[#f2e7d4]/45 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9d183d]">Best-sellers</div>
            <h2 className="max-w-xl font-serif text-4xl text-[#4b1020] lg:text-5xl">
              Nos pieces signature, les preferees de la maison
            </h2>
          </div>
          <Link href="/products" className="rounded-full border border-[#4b1020]/30 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#4b1020] transition hover:border-[#9d183d] hover:bg-[#9d183d] hover:text-white">
            Voir toute la collection
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton />
        ) : error ? (
          <CatalogStateMessage message="Impossible de charger les produits depuis la BDD pour le moment." />
        ) : bestSellers.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {bestSellers.map((product, index) => (
              <ProductCard key={product.id} {...mapDbProductToHomeCard(product, index)} />
            ))}
          </div>
        ) : (
          <CatalogStateMessage message="Aucun produit actif trouve dans la BDD." />
        )}
      </div>
    </section>
  )
}

function mapDbProductToHomeCard(product: CatalogProduct, index: number) {
  return {
    name: product.name,
    price: `${Number(product.price).toFixed(2)} TND`,
    img: product.image || "/placeholder.svg",
    tag: product.activeOffer ? "Promotion" : product.isNew ? "Nouveau" : index < 2 ? "Best-seller" : "Selection",
    desc: product.description || product.origin || "Produit Maison Cerisette",
    href: `/product/${product.id}`,
  }
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white">
          <div className="aspect-[4/5] animate-pulse bg-[#eadfce]" />
          <div className="space-y-3 p-6">
            <div className="h-5 w-3/4 animate-pulse rounded bg-[#eadfce]" />
            <div className="h-4 w-full animate-pulse rounded bg-[#eadfce]" />
            <div className="h-5 w-20 animate-pulse rounded bg-[#eadfce]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CatalogStateMessage({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cdb9aa] bg-white/60 p-10 text-center text-[#665a52]">
      {message}
    </div>
  )
}

function ProductCard({
  name,
  price,
  img,
  tag,
  desc,
  href = "/products",
}: {
  name: string
  price: string
  img: string
  tag: string
  desc: string
  href?: string
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-transparent bg-white transition duration-500 hover:-translate-y-1.5 hover:border-[#9d183d]/20 hover:shadow-2xl">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f2e7d4]">
          <img src={img} alt={name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
          <span className="absolute left-4 top-4 rounded-full bg-[#fbf7ef]/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4b1020] backdrop-blur">
            {tag}
          </span>
        </div>
      </Link>
      <div className="p-6">
        <h3 className="font-serif text-xl leading-tight text-[#4b1020]">{name}</h3>
        <p className="mt-1.5 text-sm text-[#665a52]">{desc}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="font-serif text-xl text-[#9d183d]">{price}</span>
          <Link href={href} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#4b1020] transition hover:text-[#9d183d]">
            Ajouter
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#4b1020]/30">+</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

function Story() {
  return (
    <section id="histoire" className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
        <div className="relative order-2 lg:order-1 lg:col-span-6">
          <div className="absolute -right-8 -top-8 -z-10 h-48 w-48 rounded-[62%_38%_55%_45%/50%_60%_40%_50%] bg-[#557a55]/10" />
          <img src="/story-artisan.jpg" alt="Artisane Maison Cerisette" className="h-[30rem] w-full rounded-[2rem] object-cover lg:h-[34rem]" loading="lazy" />
          <div className="absolute -bottom-6 right-6 max-w-[15rem] rounded-2xl bg-[#9d183d] p-6 text-white">
            <div className="font-serif text-3xl italic leading-none">"</div>
            <p className="mt-1 font-serif text-base leading-snug">Le temps est notre meilleur ingredient.</p>
            <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] opacity-80">Madeleine, fondatrice</div>
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9d183d]">
            <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-[#9d183d] align-middle" />
            Notre histoire
          </div>
          <h2 className="font-serif text-4xl leading-tight text-[#4b1020] lg:text-5xl">
            Trois generations,
            <br />
            <em className="font-light italic text-[#3f6b45]">un seul fruit</em>, mille gestes.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-[#665a52]">
            Tout commence en 1962 dans un petit verger familial. Soixante ans plus tard, la maison preserve les memes gestes et les memes recettes.
          </p>
          <p className="mt-6 leading-relaxed text-[#665a52]">
            Chaque cerise est selectionnee avec soin. Nous travaillons en petites series, sans additif ni colorant, pour garder le gout juste du fruit.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#eadfce] pt-8">
            <StatBlock n="1962" l="Annee fondatrice" />
            <StatBlock n="12 ha" l="de vergers" />
            <StatBlock n="Bio" l="depuis 2008" />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatBlock({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-serif text-3xl text-[#9d183d]">{n}</div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#665a52]">{l}</div>
    </div>
  )
}

function Shop() {
  return (
    <section id="boutique" className="relative overflow-hidden bg-[#4b1020] py-24 text-white lg:py-32">
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-[62%_38%_55%_45%/50%_60%_40%_50%] bg-[#9d183d]/30" />
      <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-[0_100%_0_100%] bg-[#557a55]/20" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65">La boutique</div>
          <h2 className="font-serif text-4xl lg:text-5xl">Explorez nos categories</h2>
          <p className="mt-5 text-white/75">Une collection patiemment composee, des confitures aux liqueurs rares.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link key={category.name} href={category.href} className="group block rounded-2xl border border-white/15 p-8 transition hover:border-white/40 hover:bg-white/5">
              <div className="font-serif text-3xl text-white/45">0{index + 1}</div>
              <h3 className="mt-8 font-serif text-2xl leading-tight">{category.name}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">{category.count}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition group-hover:border-[#9d183d] group-hover:bg-[#9d183d]">
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Newcomers() {
  const { products, loading, error } = useCatalogProducts()
  const newestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)
  const primaryNewProduct = newestProducts[0]
  const secondaryNewProduct = newestProducts[1]

  return (
    <section id="nouveautes" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-stretch gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9d183d]">
              <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-[#9d183d] align-middle" />
              Nouveautes
            </div>
            <h2 className="font-serif text-4xl leading-tight text-[#4b1020] lg:text-5xl">
              La fraicheur de la <em className="font-light italic text-[#3f6b45]">saison</em>, en edition limitee.
            </h2>
            <p className="mt-6 leading-relaxed text-[#665a52]">
              Quelques pieces nouvelles, concues autour de la recolte 2025. Disponibles tant qu&apos;il en reste.
            </p>
            <Link href="/products" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#9d183d] transition-all hover:gap-3">
              Voir toutes les nouveautes
              <ArrowIcon />
            </Link>
          </div>
          <div className="lg:col-span-7">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white">
                    <div className="aspect-[4/5] animate-pulse bg-[#eadfce]" />
                    <div className="space-y-3 p-6">
                      <div className="h-5 w-3/4 animate-pulse rounded bg-[#eadfce]" />
                      <div className="h-4 w-full animate-pulse rounded bg-[#eadfce]" />
                      <div className="h-5 w-20 animate-pulse rounded bg-[#eadfce]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <CatalogStateMessage message="Impossible de charger les nouveautes depuis la BDD pour le moment." />
            ) : primaryNewProduct ? (
              <div className="grid gap-6 sm:grid-cols-2">
                <ProductCard {...mapDbProductToHomeCard(primaryNewProduct, 0)} tag="Nouveau" />
                <div className="flex flex-col justify-between rounded-2xl bg-[#557a55]/15 p-8 sm:translate-y-12">
                  <CherryMark className="h-14 w-12 text-[#9d183d]" />
                  <div>
                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#3f6b45]">
                      Arrivage BDD
                    </div>
                    <h3 className="font-serif text-2xl leading-tight text-[#4b1020]">
                      {secondaryNewProduct?.name ?? primaryNewProduct.name}
                    </h3>
                    <p className="mt-3 text-sm text-[#665a52]">
                      {secondaryNewProduct?.description || primaryNewProduct.description || "Dernier produit ajoute au catalogue."}
                    </p>
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <span className="font-serif text-2xl text-[#9d183d]">
                        {Number(secondaryNewProduct?.price ?? primaryNewProduct.price).toFixed(2)} TND
                      </span>
                      <Link
                        href={`/product/${secondaryNewProduct?.id ?? primaryNewProduct.id}`}
                        className="rounded-full bg-[#9d183d] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#4b1020]"
                      >
                        Voir produit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <CatalogStateMessage message="Aucune nouveaute active trouvee dans la BDD." />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="bg-[#f2e7d4]/45 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9d183d]">Avis clients</div>
          <h2 className="font-serif text-4xl text-[#4b1020] lg:text-5xl">Ce qu&apos;on en dit autour de la table</h2>
          <div className="mt-6 flex items-center justify-center gap-1 text-[#9d183d]">
            {[...Array(5)].map((_, index) => (
              <StarIcon key={index} />
            ))}
            <span className="ml-3 text-sm text-[#665a52]">4.9 / 5 - 2 480 avis verifies</span>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote key={review.name} className="rounded-2xl border border-[#eadfce] bg-white p-8 transition hover:shadow-lg">
              <div className="mb-2 font-serif text-5xl italic leading-none text-[#9d183d]">"</div>
              <p className="leading-relaxed text-[#2d1b18]/85">{review.text}</p>
              <footer className="mt-6 flex items-center justify-between border-t border-[#eadfce] pt-6">
                <div>
                  <div className="font-serif text-lg text-[#4b1020]">{review.name}</div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#665a52]">{review.city}</div>
                </div>
                <div className="flex gap-0.5 text-[#9d183d]">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon key={index} small />
                  ))}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

function Blog() {
  return (
    <section id="blog" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9d183d]">Le carnet</div>
            <h2 className="max-w-xl font-serif text-4xl text-[#4b1020] lg:text-5xl">Recettes & inspirations gourmandes</h2>
          </div>
          <a href="#blog" className="rounded-full border border-[#4b1020]/30 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#4b1020] transition hover:border-[#9d183d] hover:bg-[#9d183d] hover:text-white">
            Tous les articles
          </a>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {articles.map((article) => (
            <article key={article.title} className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#f2e7d4]">
                <img src={article.img} alt={article.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="mt-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em]">
                <span className="text-[#9d183d]">{article.category}</span>
                <span className="h-1 w-1 rounded-full bg-[#665a52]/40" />
                <span className="text-[#665a52]">{article.read} de lecture</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl leading-snug text-[#4b1020] transition group-hover:text-[#9d183d]">
                {article.title}
              </h3>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#9d183d] transition-all group-hover:gap-3">
                Lire l&apos;article
                <ArrowIcon />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="bg-[#f2e7d4]/45 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="grid gap-12 rounded-[2rem] border border-[#eadfce] bg-white p-10 shadow-sm lg:grid-cols-2 lg:p-16">
          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9d183d]">
              <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-[#9d183d] align-middle" />
              Contact
            </div>
            <h2 className="font-serif text-4xl leading-tight text-[#4b1020] lg:text-5xl">Une question, un mot doux ?</h2>
            <p className="mt-6 leading-relaxed text-[#665a52]">
              Nous repondons en personne, sous 48 heures. Pour les commandes professionnelles ou les visites, ecrivez-nous.
            </p>
            <div className="mt-10 space-y-5 text-sm">
              <ContactLine icon="M" label="Notre maison" value="Maison Cerisette, Tunis, Tunisie" />
              <ContactLine icon="@" label="E-mail" value="contact@maison-cerisette.tn" />
              <ContactLine icon="T" label="Telephone" value="+216 XX XXX XXXX" />
            </div>
          </div>
          <form className="space-y-5">
            <Field label="Votre nom" placeholder="Camille Durand" />
            <Field label="Votre e-mail" type="email" placeholder="camille@exemple.fr" />
            <Field label="Sujet" placeholder="Une commande speciale" />
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#665a52]">Votre message</label>
              <textarea rows={5} placeholder="Dites-nous tout" className="w-full resize-none rounded-xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 text-sm outline-none transition focus:border-[#9d183d] focus:bg-white" />
            </div>
            <button type="submit" className="inline-flex w-full justify-center rounded-full bg-[#9d183d] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#4b1020]">
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function ContactLine({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9d183d]/10 text-sm font-semibold text-[#9d183d]">
        {icon}
      </span>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#665a52]">{label}</div>
        <div className="mt-0.5 font-serif text-lg text-[#4b1020]">{value}</div>
      </div>
    </div>
  )
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#665a52]">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full rounded-xl border border-[#eadfce] bg-[#fbf7ef] px-4 py-3 text-sm outline-none transition focus:border-[#9d183d] focus:bg-white" />
    </div>
  )
}

function HomeFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#4b1020] pb-10 pt-20 text-white">
      <div className="absolute right-0 top-0 h-72 w-72 -translate-y-1/2 translate-x-1/4 rounded-[62%_38%_55%_45%/50%_60%_40%_50%] bg-[#9d183d]/25" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 grid items-center gap-10 border-b border-white/15 pb-14 lg:grid-cols-2">
          <div>
            <h3 className="font-serif text-3xl lg:text-4xl">Recevez nos lettres gourmandes</h3>
            <p className="mt-3 text-white/70">Recettes saisonnieres, arrivages et avant-premieres. Une lettre par mois, jamais plus.</p>
          </div>
          <form className="flex gap-3">
            <input type="email" placeholder="votre@email.fr" className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm outline-none placeholder:text-white/50 focus:border-white/60" />
            <button type="submit" className="rounded-full bg-[#fbf7ef] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#4b1020] transition hover:bg-[#f2e7d4]">
              S&apos;abonner
            </button>
          </form>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 text-white">
              <CherryMark className="h-10 w-9" />
              <div>
                <div className="font-serif text-xl">Maison Cerisette</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-70">Tunisie, depuis 1962</div>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
              Maison familiale artisanale dediee a la cerise. Confitures, liqueurs, chocolats et sirops elabores en petites series.
            </p>
            <div className="mt-6 flex gap-3">
              {["Instagram", "Facebook", "Pinterest", "TikTok"].map((social) => (
                <a key={social} href="#" aria-label={social} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:bg-white hover:text-[#4b1020]">
                  <span className="text-[10px] uppercase tracking-wider">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Boutique" links={["Confitures", "Liqueurs", "Chocolats", "Sirops", "Coffrets cadeaux", "Edition limitee"]} />
          <FooterCol title="Maison" links={["Notre histoire", "Le verger", "Savoir-faire", "Engagement bio", "Presse", "Recrutement"]} />
          <FooterCol title="Aide" links={["Livraison", "Retours", "Mentions legales", "CGV", "Confidentialite", "Contact"]} />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-xs text-white/60 md:flex-row">
          <div>Copyright 2026 Maison Cerisette. Tous droits reserves.</div>
          <div className="flex items-center gap-6">
            <span>Paiement securise</span>
            <span>Livraison en Tunisie</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="lg:col-span-2">
      <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">{title}</h4>
      <ul className="space-y-3 text-sm text-white/85">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition hover:text-white">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 7h14l-1.5 11a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon({ small = false }: { small?: boolean }) {
  return (
    <svg className={small ? "h-3.5 w-3.5" : "h-5 w-5"} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 3 7 7 .5-5.5 4.8L18 22l-6-4-6 4 1.5-7.7L2 9.5 9 9z" />
    </svg>
  )
}

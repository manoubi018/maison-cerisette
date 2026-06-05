"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, ShoppingBag, X } from "lucide-react"

import { AccountMenu } from "@/components/account-menu"
import { useCart } from "@/lib/cart-context"
import { useCatalogProducts } from "@/lib/use-catalog-products"
import { useLanguage } from "@/lib/language-context"

export function Navbar() {
  const { items } = useCart()
  const { categories } = useCatalogProducts()
  const { language, setLanguage } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const labels =
    language === "fr"
      ? {
          home: "Accueil",
          products: "Catalogue",
          about: "A propos",
          contact: "Contact",
          cart: "Panier",
          account: "Compte",
          orders: "Mes commandes",
          addresses: "Mes adresses",
          profile: "Mon profil",
          menu: "Menu",
        }
      : {
          home: "Home",
          products: "Catalog",
          about: "About",
          contact: "Contact",
          cart: "Cart",
          account: "Account",
          orders: "My Orders",
          addresses: "My Addresses",
          profile: "My Profile",
          menu: "Menu",
        }

  const navLinkClass = (active: boolean) =>
    `rounded-full px-5 py-2 text-[1.35rem] font-medium transition-colors ${
      active
        ? "bg-[#f0d1d7] text-[#b8143b]"
        : "text-[#5f554f] hover:bg-[#f0d1d7]/70 hover:text-[#b8143b]"
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e5d8cd] bg-[#fbf7f1]/95 backdrop-blur">
      <div className="mx-auto flex h-[6.25rem] max-w-none items-center gap-6 px-3 sm:px-5 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-4">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-background ring-1 ring-[#eadbd2] sm:h-16 sm:w-16">
            <Image
              src="/hero-cherries.jpg"
              alt="Maison Cerisette"
              fill
              className="object-cover"
              sizes="64px"
              priority
            />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block whitespace-nowrap font-serif text-[1.65rem] font-bold leading-none text-[#7a1022] lg:text-[1.85rem]">
              Maison Cerisette
            </span>
            <span className="mt-1 block text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#6b5e58]">
              Depuis 1962
            </span>
          </span>
        </Link>

        <div className="ml-4 hidden flex-1 items-center justify-center gap-5 md:flex lg:gap-7">
          <Link href="/" className={navLinkClass(pathname === "/")}>
            {labels.home}
          </Link>

          <div className="group relative">
            <Link href="/products" className={navLinkClass(pathname.startsWith("/products"))}>
              {labels.products}
            </Link>
            {categories.length > 0 ? (
              <div className="invisible absolute left-0 mt-3 w-56 rounded-2xl border border-[#e5d8cd] bg-[#fbf7f1] py-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="block px-4 py-2.5 text-sm text-[#5f554f] hover:bg-[#f0d1d7]/70 hover:text-[#b8143b]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <Link href="/about" className={navLinkClass(pathname.startsWith("/about"))}>
            {labels.about}
          </Link>
          <Link href="/contact" className={navLinkClass(pathname.startsWith("/contact"))}>
            {labels.contact}
          </Link>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
          <Link
            href="/products"
            className="hidden h-11 w-11 items-center justify-center rounded-full text-[#4f4640] transition hover:bg-[#f0d1d7]/70 hover:text-[#b8143b] sm:flex"
            aria-label="Recherche"
          >
            <Search className="h-6 w-6" />
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-14 items-center gap-3 rounded-full bg-[#b8143b] px-5 text-xl font-bold text-white shadow-sm transition hover:bg-[#9f102f] sm:px-6"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-white/90">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">{labels.cart}</span>
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

          <AccountMenu srLabel={labels.account} />

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#4f4640] hover:bg-[#f0d1d7] md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={labels.menu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-[#e5d8cd] bg-[#fbf7f1] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            <Link href="/" className="py-2.5 text-sm text-foreground">
              {labels.home}
            </Link>
            <Link href="/products" className="py-2.5 text-sm text-foreground">
              {labels.products}
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="py-2 pl-4 text-sm text-muted-foreground"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/about" className="py-2.5 text-sm text-foreground">
              {labels.about}
            </Link>
            <Link href="/contact" className="py-2.5 text-sm text-foreground">
              {labels.contact}
            </Link>
            <Link href="/cart" className="my-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#b8143b] px-3.5 py-2 text-sm font-medium text-white">
              <ShoppingBag className="h-4 w-4" />
              {labels.cart} {cartCount}
            </Link>
            <Link href="/account/orders" className="py-2.5 text-sm text-foreground">
              {labels.orders}
            </Link>
            <Link href="/account/addresses" className="py-2.5 text-sm text-foreground">
              {labels.addresses}
            </Link>
            <Link href="/account/profile" className="py-2.5 text-sm text-foreground">
              {labels.profile}
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  )
}

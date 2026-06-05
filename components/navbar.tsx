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
    `rounded-full px-3 py-1.5 text-sm transition-colors ${
      active
        ? "bg-[#f0d1d7] text-[#b8143b]"
        : "text-[#6b5e58] hover:text-[#2d1b18]"
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e5d8cd] bg-[#fbf7f1]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-background">
            <Image
              src="/maison-cerisette-logo.svg"
              alt="Maison Cerisette"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block whitespace-nowrap font-serif text-lg font-semibold leading-none text-[#7a1022]">
              Maison Cerisette
            </span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-[#6b5e58]">
              Depuis 1962
            </span>
          </span>
        </Link>

        <div className="ml-4 hidden items-center gap-1 md:flex">
          <Link href="/" className={navLinkClass(pathname === "/")}>
            {labels.home}
          </Link>

          <div className="group relative">
            <Link href="/products" className={navLinkClass(pathname.startsWith("/products"))}>
              {labels.products}
            </Link>
            {categories.length > 0 ? (
              <div className="invisible absolute left-0 mt-2 w-52 rounded-lg border border-[#e5d8cd] bg-[#fbf7f1] py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="block px-4 py-2.5 text-sm text-[#6b5e58] hover:bg-[#f0d1d7]/70 hover:text-[#2d1b18]"
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

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/products"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[#6b5e58] hover:bg-[#f0d1d7]/70 hover:text-[#2d1b18] sm:flex"
            aria-label="Recherche"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-9 items-center gap-2 rounded-full bg-[#b8143b] px-3.5 text-sm font-medium text-white hover:bg-[#9f102f]"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{labels.cart}</span>
            <span className="rounded-full bg-white/20 px-1.5 text-[11px] font-semibold tabular-nums">
              {cartCount}
            </span>
          </Link>

          <div className="hidden items-center rounded-full border border-[#e3d5cc] bg-[#fffaf5] p-0.5 sm:flex">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                language === "en" ? "bg-[#f0d1d7] text-[#b8143b]" : "text-[#5f554f]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                language === "fr" ? "bg-[#f0d1d7] text-[#b8143b]" : "text-[#5f554f]"
              }`}
            >
              FR
            </button>
          </div>

          <AccountMenu srLabel={labels.account} />

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#2d1b18] hover:bg-[#f0d1d7]/70 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={labels.menu}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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

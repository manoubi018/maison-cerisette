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

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-background">
            <Image src="/hero-cherries.jpg" alt="Maison Cerisette" fill className="object-cover" sizes="40px" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="font-display block whitespace-nowrap text-lg font-semibold leading-none text-primary">Maison Cerisette</span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Depuis 1962</span>
          </span>
        </Link>

        <div className="ml-4 hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              pathname === "/" ? "bg-accent/15 text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {labels.home}
          </Link>
          <div className="group relative">
            <Link
              href="/products"
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                pathname.startsWith("/products")
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {labels.products}
            </Link>
            {categories.length > 0 ? (
              <div className="invisible absolute left-0 mt-2 w-52 rounded-lg border border-border bg-background py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent/15 hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {[
            { href: "/about", label: labels.about },
            { href: "/contact", label: labels.contact },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/products"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent/15 hover:text-foreground sm:flex"
            aria-label="Recherche"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex h-9 items-center gap-2 rounded-full bg-accent px-3.5 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{labels.cart}</span>
            <span className="rounded-full bg-white/20 px-1.5 text-[11px] font-semibold tabular-nums">
              {cartCount}
            </span>
          </Link>

          <div className="hidden items-center rounded-full border border-border bg-background p-0.5 sm:flex">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${language === "en" ? "bg-accent/15 text-accent" : "text-muted-foreground"}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("fr")}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${language === "fr" ? "bg-accent/15 text-accent" : "text-muted-foreground"}`}
            >
              FR
            </button>
          </div>

          <AccountMenu srLabel={labels.account} />

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-accent/15 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={labels.menu}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-border bg-background md:hidden">
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
            <Link href="/cart" className="my-2 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground">
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

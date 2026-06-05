import type React from "react"
import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AccountProvider } from "@/lib/account-context"
import { CartProvider } from "@/lib/cart-context"
import { LanguageProvider } from "@/lib/language-context"
import { OrdersProvider } from "@/lib/orders-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
})

export const metadata: Metadata = {
  title: "Maison Cerisette - Epicerie fine artisanale",
  description:
    "Boutique en ligne Maison Cerisette avec catalogue gourmand, panier, compte client, commandes, paiement securise et livraison en Tunisie.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}>
        <LanguageProvider>
          <AccountProvider>
            <CartProvider>
              <OrdersProvider>
                {children}
                <Analytics />
              </OrdersProvider>
            </CartProvider>
          </AccountProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

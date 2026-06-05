import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartPageContent } from "@/components/cart-page"

export const metadata = {
  title: "Shopping Cart - Maison Cerisette",
  description: "Review your order and proceed to checkout",
}

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CartPageContent />
      </main>
      <Footer />
    </div>
  )
}

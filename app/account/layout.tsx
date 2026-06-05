import type { ReactNode } from "react"

import { AccountSidebar } from "@/components/account-sidebar"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-[linear-gradient(180deg,#f8fafc_0%,#f3f6fa_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start xl:grid-cols-[360px_minmax(0,1fr)]">
            <AccountSidebar />
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

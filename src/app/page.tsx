import { Metadata } from "next"
import { SidebarWithAuth } from "@/components/layout/SidebarWithAuth"
import HomePage from "@/components/HomePage"

export const metadata: Metadata = {
  title: "Priya Ahuja - Strategy & Clarity for Founders",
}

export default function RootPage() {
  return (
    <div className="flex min-h-screen bg-cream">
      <SidebarWithAuth />
      <main className="flex-1 md:ml-[240px] min-h-screen pt-[52px] md:pt-0">
        <HomePage />
      </main>
    </div>
  )
}

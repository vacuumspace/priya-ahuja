import { Metadata } from "next"
import { Sidebar } from "@/components/layout/Sidebar"
import HomePage from "@/components/HomePage"

export const metadata: Metadata = {
  title: "Priya Ahuja - Strategy & Clarity for Founders",
}

export default function RootPage() {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 ml-[240px] min-h-screen">
        <HomePage />
      </main>
    </div>
  )
}

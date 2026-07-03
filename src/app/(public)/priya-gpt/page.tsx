import type { Metadata } from "next"
import { auth, isAdmin } from "@/lib/auth"
import PriyaGptClient from "./PriyaGptClient"

export const metadata: Metadata = {
  title: "PriyaGPT",
  description: "Brainstorm your startup idea with PriyaGPT — an AI chat built to think through positioning, GTM, and pricing with you.",
}

export default async function PriyaGptPage() {
  const session = await auth()
  const isSignedIn = Boolean(session?.user?.id)
  const isAdminUser = isAdmin(session?.user?.email)

  return (
    <main className="min-h-screen bg-cream overflow-x-hidden flex flex-col">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>PriyaGPT</span>
      </div>

      <div className="flex-1 px-4 md:px-10 pt-6 pb-8">
        <PriyaGptClient isSignedIn={isSignedIn} isAdmin={isAdminUser} />
      </div>
    </main>
  )
}

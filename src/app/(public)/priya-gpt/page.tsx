import type { Metadata } from "next"
import { auth, isAdmin } from "@/lib/auth"
import PriyaGptClient from "./PriyaGptClient"

export const metadata: Metadata = {
  title: "PriyaGPT",
  description: "Brainstorm your startup idea with PriyaGPT - an AI chat built to think through positioning, GTM, and pricing with you.",
}

export default async function PriyaGptPage() {
  const session = await auth()
  const isSignedIn = Boolean(session?.user?.id)
  const isAdminUser = isAdmin(session?.user?.email)

  return (
    <div className="h-[calc(100dvh-52px)] md:h-screen bg-cream overflow-hidden flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col px-4 md:px-10 pt-2 pb-2 md:pt-6 md:pb-8 overflow-hidden">
        <PriyaGptClient isSignedIn={isSignedIn} isAdmin={isAdminUser} />
      </div>
    </div>
  )
}

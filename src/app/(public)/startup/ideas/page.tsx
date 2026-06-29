import type { Metadata } from "next"
import { auth, isAdmin } from "@/lib/auth"

export const metadata: Metadata = {
  title: "100 Startup Ideas for Indian Founders 2026",
  description: "100 non-obvious, high-potential startup ideas curated for Indian founders — each with the real problem, market opportunity, and why now. Not crowd-sourced. Not generic.",
  keywords: ["startup ideas India 2026", "startup ideas for Indian founders", "new business ideas India", "startup opportunities India", "high potential startup ideas"],
  alternates: { canonical: "https://priyaahuja.in/startup/ideas" },
  openGraph: {
    title: "100 Startup Ideas for Indian Founders 2026 | Priya Ahuja",
    description: "100 non-obvious, high-potential startup ideas for Indian founders — each with the real problem, market opportunity, and why now.",
    url: "https://priyaahuja.in/startup/ideas",
  },
}
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"
import { startupIdeas, STARTUP_IDEAS_SLUG } from "@/lib/startup-ideas-data"
import StartupIdeasClient from "./StartupIdeasClient"

export default async function StartupIdeasPage() {
  const session = await auth()
  const userEmail = session?.user?.email ?? null

  let isPaid = isAdmin(userEmail)
  if (!isPaid && userEmail) {
    const [row] = await db
      .select({ id: purchases.id })
      .from(purchases)
      .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(and(
        eq(purchases.userEmail, userEmail),
        eq(digitalProducts.slug, STARTUP_IDEAS_SLUG),
        isNotNull(purchases.downloadToken),
      ))
      .limit(1)
    isPaid = !!row
  }

  return (
    <StartupIdeasClient
        isPaid={isPaid}
        isAuthenticated={!!userEmail}
        ideas={startupIdeas}
        userEmail={userEmail}
        userName={session?.user?.name ?? null}
      />
  )
}

import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupMistakes } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import StartupMistakesClient from "./StartupMistakesClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Startup Mistakes: Founders Share What Went Wrong",
  description: "Real mistakes from Indian founders: fundraising, product, co-founder splits, validation, and more. Learn from what actually went wrong, not just the highlight reel.",
  keywords: ["startup mistakes", "founder mistakes India", "startup failure stories", "what not to do startup"],
  alternates: { canonical: "https://priyaahuja.in/startup/mistakes" },
  openGraph: {
    title: "Startup Mistakes: Founders Share What Went Wrong | Priya Ahuja",
    description: "Real mistakes from Indian founders: fundraising, product, co-founder splits, validation, and more.",
    url: "https://priyaahuja.in/startup/mistakes",
  },
}

export default async function StartupMistakesPage() {
  const session = await auth()

  const mistakes = await db
    .select()
    .from(startupMistakes)
    .where(eq(startupMistakes.status, "published"))
    .orderBy(desc(startupMistakes.publishedAt))

  return (
    <StartupMistakesClient
      mistakes={mistakes.map((m) => ({
        id: m.id,
        userName: m.userName,
        title: m.title,
        body: m.body,
        industry: m.industry,
        topic: m.topic,
        publishedAt: m.publishedAt ? m.publishedAt.toISOString() : m.createdAt.toISOString(),
      }))}
      isAuthenticated={Boolean(session?.user)}
    />
  )
}

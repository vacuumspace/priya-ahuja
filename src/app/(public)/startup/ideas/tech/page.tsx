import type { Metadata } from "next"
import { auth, isAdmin } from "@/lib/auth"

export const metadata: Metadata = {
  title: "100 Tech Startup Ideas for Indian Founders 2026",
  description: "100 non-obvious, high-potential tech startup ideas curated for Indian founders - each with the real problem, market opportunity, and why now. Not crowd-sourced. Not generic.",
  keywords: ["tech startup ideas India 2026", "startup ideas India 2026", "startup ideas for Indian founders", "new business ideas India", "startup opportunities India", "high potential startup ideas"],
  alternates: { canonical: "https://priyaahuja.in/startup/ideas/tech" },
  openGraph: {
    title: "100 Tech Startup Ideas for Indian Founders 2026 | Priya Ahuja",
    description: "100 non-obvious, high-potential tech startup ideas for Indian founders - each with the real problem, market opportunity, and why now.",
    url: "https://priyaahuja.in/startup/ideas/tech",
  },
}
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"
import { startupIdeas, STARTUP_IDEAS_SLUG } from "@/lib/startup-ideas-data"
import StartupIdeasClient from "../StartupIdeasClient"

export default async function TechStartupIdeasPage() {
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
      basePath="/startup/ideas"
      crumbLeft="startup · tech ideas 2026"
      crumbRight="100 tech ideas for Indian founders"
      headingLine1="100 tech startup ideas"
      headingLine2="for 2026"
      description="Curated unique and out of the box tech ideas for Indian founders, each with the real problem, market opportunity, and why now. Under tapped, non-obvious, and high potential ideas that you won't find elsewhere."
      signinNote="100 tech startup ideas · free access"
      servicesHeading="ready to build your tech idea?"
      services={[
        {
          title: "tech product development",
          description: "from MVP to full product - design, architecture, and development, shipped fast so you can start validating.",
          href: "/services/tech",
          cta: "build your product",
        },
        {
          title: "branding",
          description: "positioning, name, and a story users and investors get in seconds - backed by a logo and identity that look credible from day one.",
          href: "/services/branding",
          cta: "brand your startup",
        },
      ]}
    />
  )
}

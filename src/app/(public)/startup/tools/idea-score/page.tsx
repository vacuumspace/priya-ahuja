import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import StartupIdeaScoreClient from "./StartupIdeaScoreClient"

export const metadata = { title: "Startup Idea Score" }

export default async function StartupIdeaScorePage() {
  const [session, priceSetting] = await Promise.all([
    auth(),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "price_idea_score")).limit(1),
  ])
  const email = session?.user?.email ?? null
  const price = priceSetting[0] ? parseInt(priceSetting[0].value, 10) : 49900
  return (
    <StartupIdeaScoreClient
      userEmail={email}
      userName={session?.user?.name ?? ""}
      isAdmin={isAdmin(email)}
      price={price}
    />
  )
}

import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { siteSettings, toolUnlocks } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import StartupIdeaScoreClient from "./StartupIdeaScoreClient"

export const metadata = { title: "Startup Idea Score" }

export default async function StartupIdeaScorePage() {
  const [session, priceSetting] = await Promise.all([
    auth(),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "price_idea_score")).limit(1),
  ])
  const email = session?.user?.email ?? null
  const price = priceSetting[0] ? parseInt(priceSetting[0].value, 10) : 49900

  // A captured payment the user never got to use (closed tab mid-quiz) -
  // lets them go straight to the quiz instead of being asked to pay again.
  let hasPaidUnlock = false
  if (session?.user?.id) {
    const [unlock] = await db
      .select({ id: toolUnlocks.id })
      .from(toolUnlocks)
      .where(and(
        eq(toolUnlocks.userId, session.user.id),
        eq(toolUnlocks.tool, "startup-idea-score"),
        eq(toolUnlocks.status, "paid"),
      ))
      .limit(1)
    hasPaidUnlock = !!unlock
  }

  return (
    <StartupIdeaScoreClient
      userEmail={email}
      userName={session?.user?.name ?? ""}
      isAdmin={isAdmin(email)}
      price={price}
      hasPaidUnlock={hasPaidUnlock}
    />
  )
}

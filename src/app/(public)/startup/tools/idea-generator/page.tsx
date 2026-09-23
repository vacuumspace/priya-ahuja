import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { ideaGenReports, siteSettings, toolUnlocks } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import IdeaGeneratorIntroClient from "./IdeaGeneratorIntroClient"

export const metadata = { title: "Personalised Startup Idea Generator" }

export default async function IdeaGeneratorPage() {
  const [session, priceSetting] = await Promise.all([
    auth(),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "price_idea_generator")).limit(1),
  ])
  const email = session?.user?.email ?? null
  const price = priceSetting[0] ? parseInt(priceSetting[0].value, 10) : 99900

  let resumeId: string | null = null
  let existingReportId: string | null = null
  let hasPaidUnlock = false
  if (session?.user?.id) {
    const [latest] = await db
      .select({ id: ideaGenReports.id, status: ideaGenReports.status })
      .from(ideaGenReports)
      .where(eq(ideaGenReports.userId, session.user.id))
      .orderBy(desc(ideaGenReports.createdAt))
      .limit(1)

    if (latest?.status === "answering") {
      resumeId = latest.id
    } else if (latest) {
      existingReportId = latest.id
    } else {
      const [unlock] = await db
        .select({ id: toolUnlocks.id })
        .from(toolUnlocks)
        .where(and(
          eq(toolUnlocks.userId, session.user.id),
          eq(toolUnlocks.tool, "startup-idea-generator"),
          eq(toolUnlocks.status, "paid"),
        ))
        .limit(1)
      hasPaidUnlock = !!unlock
    }
  }

  return (
    <IdeaGeneratorIntroClient
      userEmail={email}
      userName={session?.user?.name ?? ""}
      price={price}
      resumeId={resumeId}
      existingReportId={existingReportId}
      hasPaidUnlock={hasPaidUnlock || isAdmin(email)}
    />
  )
}

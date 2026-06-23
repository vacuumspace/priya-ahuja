import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import StartupScoreClient from "@/app/(public)/tools/startup-score/StartupScoreClient"

export const metadata = { title: "Startup Fundability Score" }

export default async function FundabilityScorePage() {
  const [session, priceSetting] = await Promise.all([
    auth(),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "price_startup_score")).limit(1),
  ])
  const email = session?.user?.email ?? null
  const price = priceSetting[0] ? parseInt(priceSetting[0].value, 10) : 49900
  return (
    <StartupScoreClient
      userEmail={email}
      userName={session?.user?.name ?? ""}
      isAdmin={isAdmin(email)}
      price={price}
    />
  )
}

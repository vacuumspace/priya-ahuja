import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { siteSettings, pitchDeckUnlocks } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import PitchDeckAnalyserClient from "./PitchDeckAnalyserClient"

export const metadata = {
  title: "Pitch Deck Analyser",
  description: "Upload your pitch deck PDF and get an AI-powered investor-lens report - score out of 100, 20-section audit from problem to moat, story rewrites, and the red flags VCs never tell you about.",
}

export default async function PitchDeckAnalyserPage() {
  const [session, priceSetting] = await Promise.all([
    auth(),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "price_pitch_deck_analyser")).limit(1),
  ])
  const email = session?.user?.email ?? null
  const price = priceSetting[0] ? parseInt(priceSetting[0].value, 10) : 19900

  // A captured payment the user never got to use (closed tab, failed upload) -
  // lets them go straight to upload instead of being asked to pay again.
  let hasPaidUnlock = false
  if (session?.user?.id) {
    const [unlock] = await db
      .select({ id: pitchDeckUnlocks.id })
      .from(pitchDeckUnlocks)
      .where(and(eq(pitchDeckUnlocks.userId, session.user.id), eq(pitchDeckUnlocks.status, "paid")))
      .limit(1)
    hasPaidUnlock = !!unlock
  }

  return (
    <PitchDeckAnalyserClient
      userEmail={email}
      userName={session?.user?.name ?? ""}
      isAdmin={isAdmin(email)}
      price={price}
      hasPaidUnlock={hasPaidUnlock}
    />
  )
}

import { db } from "@/lib/db"
import { pitchDeckUnlocks } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Workshops whose registrants get a free, one-time (no expiry) unlock of the
// pitch deck analyser - matches the "Free" perks listed in the workshop's
// own description, so keep both in sync if this list changes.
const WORKSHOPS_GRANTING_PITCH_DECK_UNLOCK = ["investable-pitch-deck"]

// Grants a free pitch-deck-analyser credit by inserting a `pitchDeckUnlocks`
// row already marked "paid" - the analyser page/route already know how to
// find and consume an unused paid unlock, so no changes are needed there.
// Skips silently if the user already has any unlock row (bought, granted, or
// consumed before), so this never re-grants access they already had.
export async function grantWorkshopPitchDeckUnlock(workshopSlug: string, userId: string, registrationId: string) {
  if (!WORKSHOPS_GRANTING_PITCH_DECK_UNLOCK.includes(workshopSlug)) return

  const [existing] = await db
    .select({ id: pitchDeckUnlocks.id })
    .from(pitchDeckUnlocks)
    .where(eq(pitchDeckUnlocks.userId, userId))
    .limit(1)
  if (existing) return

  await db.insert(pitchDeckUnlocks).values({
    userId,
    razorpayOrderId: `workshop_free_${registrationId}`,
    amountPaise: 0,
    status: "paid",
  })
}

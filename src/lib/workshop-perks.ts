import { db } from "@/lib/db"
import { pitchDeckUnlocks } from "@/lib/db/schema"
import { eq, and, like } from "drizzle-orm"

// Workshops whose registrants get a free, one-time (no expiry) unlock of the
// pitch deck analyser - matches the "Free" perks listed in the workshop's
// own description, so keep both in sync if this list changes.
const WORKSHOPS_GRANTING_PITCH_DECK_UNLOCK = ["fundable-pitch-deck"]

const WORKSHOP_FREE_ORDER_PREFIX = "workshop_free_"

// Grants a free pitch-deck-analyser credit by inserting a `pitchDeckUnlocks`
// row already marked "paid" - the analyser page/route already know how to
// find and consume an unused paid unlock, so no changes are needed there.
// Skips silently if the user already received a workshop-granted free credit
// before (matched by the "workshop_free_" order id prefix this function
// itself uses), so it never grants a second one. Deliberately does NOT skip
// just because the user has any pitchDeckUnlocks row at all - an old
// "consumed" row from a real, unrelated purchase months ago (or a stale
// "pending" one) isn't a reason to withhold this separate perk.
export async function grantWorkshopPitchDeckUnlock(workshopSlug: string, userId: string, registrationId: string) {
  if (!WORKSHOPS_GRANTING_PITCH_DECK_UNLOCK.includes(workshopSlug)) return

  const [existing] = await db
    .select({ id: pitchDeckUnlocks.id })
    .from(pitchDeckUnlocks)
    .where(and(eq(pitchDeckUnlocks.userId, userId), like(pitchDeckUnlocks.razorpayOrderId, `${WORKSHOP_FREE_ORDER_PREFIX}%`)))
    .limit(1)
  if (existing) return

  await db.insert(pitchDeckUnlocks).values({
    userId,
    razorpayOrderId: `${WORKSHOP_FREE_ORDER_PREFIX}${registrationId}`,
    amountPaise: 0,
    status: "paid",
  })
}

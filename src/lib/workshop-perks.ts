import { db } from "@/lib/db"
import { pitchDeckUnlocks, toolUnlocks, workshopRegistrations, workshops } from "@/lib/db/schema"
import { eq, and, like, isNull } from "drizzle-orm"

// Workshops whose registrants get a free, one-time (no expiry) unlock of the
// pitch deck analyser - matches the "Free" perks listed in the workshop's
// own description, so keep both in sync if this list changes.
const WORKSHOPS_GRANTING_PITCH_DECK_UNLOCK = ["fundable-pitch-deck"]

// Same idea, for the startup idea score tool.
const WORKSHOPS_GRANTING_IDEA_SCORE_UNLOCK = ["hunting-startup-idea-worth-building"]

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

// Same pattern as grantWorkshopPitchDeckUnlock, but for the startup idea
// score tool (toolUnlocks, not pitchDeckUnlocks) - the route/page that
// consumes it already knows how to find an unused paid `toolUnlocks` row.
export async function grantWorkshopIdeaScoreUnlock(workshopSlug: string, userId: string, registrationId: string) {
  if (!WORKSHOPS_GRANTING_IDEA_SCORE_UNLOCK.includes(workshopSlug)) return

  const [existing] = await db
    .select({ id: toolUnlocks.id })
    .from(toolUnlocks)
    .where(and(
      eq(toolUnlocks.userId, userId),
      eq(toolUnlocks.tool, "startup-idea-score"),
      like(toolUnlocks.razorpayOrderId, `${WORKSHOP_FREE_ORDER_PREFIX}%`),
    ))
    .limit(1)
  if (existing) return

  await db.insert(toolUnlocks).values({
    tool: "startup-idea-score",
    userId,
    razorpayOrderId: `${WORKSHOP_FREE_ORDER_PREFIX}${registrationId}`,
    amountPaise: 0,
    status: "paid",
  })
}

// Called from the auth signIn event on every sign-in. A guest checkout has
// no account at registration time, so it can't be tied to a user or granted
// an account-scoped perk yet - once that same email signs in (whether for
// the first time ever, or as a returning user), this retroactively claims
// any still-unlinked guest registrations for it and runs the perk grant that
// was skipped back then.
export async function linkGuestWorkshopRegistrations(userId: string, email: string) {
  const guestRegs = await db
    .select()
    .from(workshopRegistrations)
    .where(and(
      isNull(workshopRegistrations.userId),
      eq(workshopRegistrations.userEmail, email),
      eq(workshopRegistrations.status, "confirmed"),
    ))

  for (const reg of guestRegs) {
    await db.update(workshopRegistrations).set({ userId }).where(eq(workshopRegistrations.id, reg.id))

    const [workshop] = await db.select({ slug: workshops.slug }).from(workshops).where(eq(workshops.id, reg.workshopId)).limit(1)
    if (workshop) {
      try {
        await grantWorkshopPitchDeckUnlock(workshop.slug, userId, reg.id)
      } catch (e) {
        console.error("grantWorkshopPitchDeckUnlock (post-link) failed:", e)
      }
      try {
        await grantWorkshopIdeaScoreUnlock(workshop.slug, userId, reg.id)
      } catch (e) {
        console.error("grantWorkshopIdeaScoreUnlock (post-link) failed:", e)
      }
    }
  }
}

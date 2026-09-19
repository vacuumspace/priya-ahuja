import { randomInt } from "crypto"
import { db } from "@/lib/db"
import { bookings, courseEnrollments, workshopRegistrations } from "@/lib/db/schema"
import { COURSE_GIFT_SERVICE_SLUG } from "@/lib/courses-data"
import { and, eq, isNotNull, ne } from "drizzle-orm"

// ₹1000 off one 1:1 session, per workshop registrant.
export const REFERRAL_DISCOUNT_PAISE = 100000

// No 0/O/1/I - the code gets read off a page and typed by hand.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function normalizeReferralCode(input: unknown): string {
  return typeof input === "string" ? input.trim().toUpperCase() : ""
}

function generateCode() {
  let suffix = ""
  for (let i = 0; i < 6; i++) suffix += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]
  return suffix
}

// One code per person (keyed on email, like the registrations themselves),
// reused if they register for a second workshop, so the gift stays one-time.
export async function ensureReferralCode(registration: { id: string; userEmail: string; referralCode: string | null }) {
  if (registration.referralCode) return registration.referralCode

  const [sibling] = await db
    .select({ referralCode: workshopRegistrations.referralCode })
    .from(workshopRegistrations)
    .where(and(
      eq(workshopRegistrations.userEmail, registration.userEmail),
      isNotNull(workshopRegistrations.referralCode),
      ne(workshopRegistrations.id, registration.id),
    ))
    .limit(1)

  let code = sibling?.referralCode ?? null
  if (!code) {
    for (let attempt = 0; attempt < 5 && !code; attempt++) {
      const candidate = generateCode()
      const [taken] = await db
        .select({ id: workshopRegistrations.id })
        .from(workshopRegistrations)
        .where(eq(workshopRegistrations.referralCode, candidate))
        .limit(1)
      if (!taken) code = candidate
    }
    if (!code) throw new Error("Could not generate a unique referral code")
  }

  await db.update(workshopRegistrations).set({ referralCode: code }).where(eq(workshopRegistrations.id, registration.id))
  return code
}

export type ReferralCheck =
  | { ok: true; code: string; discountPaise: number; kind: "workshop" | "course-gift" }
  | { ok: false; error: string }

// Valid = belongs to a confirmed workshop registration (fixed discount off any
// session) or a fully paid course enrolment (the whole brainstorm session free,
// for that one session only), and no live (non-cancelled) booking has used it yet.
export async function checkReferralCode(
  rawCode: unknown,
  service?: { slug: string; price: number },
): Promise<ReferralCheck> {
  const code = normalizeReferralCode(rawCode)
  if (!code) return { ok: false, error: "Enter a referral code" }

  const [owner] = await db
    .select({ id: workshopRegistrations.id })
    .from(workshopRegistrations)
    .where(and(eq(workshopRegistrations.referralCode, code), eq(workshopRegistrations.status, "confirmed")))
    .limit(1)

  let gift: { id: string } | undefined
  if (!owner) {
    ;[gift] = await db
      .select({ id: courseEnrollments.id })
      .from(courseEnrollments)
      .where(and(eq(courseEnrollments.giftCode, code), eq(courseEnrollments.status, "paid")))
      .limit(1)
  }
  if (!owner && !gift) return { ok: false, error: "Invalid referral code" }

  if (gift && service?.slug !== COURSE_GIFT_SERVICE_SLUG) {
    return { ok: false, error: "This code works only for the Startup Idea Brainstorming session" }
  }

  const [used] = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(and(eq(bookings.referralCode, code), ne(bookings.status, "cancelled")))
    .limit(1)
  if (used) return { ok: false, error: "This referral code has already been used" }

  if (gift && service) {
    return { ok: true, code, discountPaise: service.price, kind: "course-gift" }
  }
  return { ok: true, code, discountPaise: REFERRAL_DISCOUNT_PAISE, kind: "workshop" }
}

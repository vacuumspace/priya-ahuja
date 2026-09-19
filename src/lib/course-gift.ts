import { randomBytes } from "crypto"
import { db } from "@/lib/db"
import { courseEnrollments, courseGifts } from "@/lib/db/schema"
import { and, eq, ne } from "drizzle-orm"
import { sendCourseGiftLink, sendAdminCourseNotification } from "@/lib/mailer"
import { coursePaise, courseOfferOpen, getCourse, type Course } from "@/lib/courses-data"
import { finalizeCourseEnrollment, getUserEnrollment } from "@/lib/course-enrollment"
import { cardVersion } from "@/lib/gift-card"

export type CourseGift = typeof courseGifts.$inferSelect

function formatRupees(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`
}

// A gift is bought outright - no pre-registration. It costs the founder price
// while the offer is open AND founding seats remain (a founder-price gift uses
// one), and the regular price otherwise.
export function giftPricePaise(course: Course, seatsTaken: number, now = Date.now()): number {
  const paise = coursePaise(course)
  return courseOfferOpen(course, now) && seatsTaken < course.seatCap ? paise.founder : paise.list
}

export function newGiftToken(): string {
  return randomBytes(18).toString("base64url")
}

// The card image. `version` (see cardVersion) changes whenever the card is
// edited, so the new image is fetched instead of a cached old one.
export function giftCardUrl(token: string, version?: string, origin?: string): string {
  const base = origin ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://priyaahuja.in"
  return `${base}/api/courses/gift/card/${token}${version ? `?v=${version}` : ""}`
}

export function giftUrl(token: string, origin?: string): string {
  const base = origin ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://priyaahuja.in"
  return `${base}/school/courses/gift/${token}`
}

// Records a captured payment against a gift and sends the link. Idempotent -
// the verify route and the webhook can both call it for the same payment.
// A cancelled row is revived: money has landed, so it wins over a prior cancel.
export async function confirmGiftPayment(
  gift: CourseGift,
  paymentId: string,
  amountPaise: number,
  { sendEmail = true }: { sendEmail?: boolean } = {}
): Promise<CourseGift> {
  let current = gift

  if (!current.razorpayPaymentId) {
    const [updated] = await db
      .update(courseGifts)
      .set({
        status: current.status === "redeemed" ? "redeemed" : "paid",
        razorpayPaymentId: paymentId,
        amountPaid: amountPaise,
      })
      .where(eq(courseGifts.id, current.id))
      .returning()
    if (updated) current = updated
  }

  return finalizeGift(current, { sendEmail })
}

// The follow-ups once a gift link is live: the link email to the purchaser and
// a note to admin. The email is claimed atomically so a concurrent verify +
// webhook can't send it twice.
export async function finalizeGift(
  gift: CourseGift,
  { sendEmail = true }: { sendEmail?: boolean } = {}
): Promise<CourseGift> {
  if (!sendEmail || gift.linkEmailSent) return gift
  const course = getCourse(gift.courseSlug)
  if (!course) return gift

  const claimed = await db
    .update(courseGifts)
    .set({ linkEmailSent: true })
    .where(and(eq(courseGifts.id, gift.id), eq(courseGifts.linkEmailSent, false)))
    .returning({ id: courseGifts.id })
  if (claimed.length === 0) return gift

  sendCourseGiftLink({
    to: gift.purchaserEmail,
    name: gift.purchaserName,
    courseTitle: course.title,
    link: giftUrl(gift.token),
    cardUrl: giftCardUrl(gift.token, cardVersion(gift)),
    recipientName: gift.recipientName ?? "them",
    launchLabel: course.launchLabel,
  }).catch((e) => console.error("[mailer] sendCourseGiftLink failed:", e))

  sendAdminCourseNotification({
    courseTitle: course.title,
    kind: "gift",
    userName: gift.purchaserName,
    userEmail: gift.purchaserEmail,
    amountLabel: `${formatRupees(gift.amountPaid ?? gift.pricePaise)} gift purchase`,
  }).catch((e) => console.error("[mailer] sendAdminCourseNotification failed:", e))

  return gift
}

export type RedeemResult =
  | { ok: true; courseSlug: string }
  | { ok: false; error: string }

// Turns a paid gift into a normal, fully paid enrolment for `user`.
export async function redeemGift(
  token: string,
  user: { id: string; email: string; name: string },
): Promise<RedeemResult> {
  const [gift] = await db.select().from(courseGifts).where(eq(courseGifts.token, token)).limit(1)
  if (!gift || gift.status === "pending" || gift.status === "cancelled") {
    return { ok: false, error: "This gift link isn't valid" }
  }
  if (gift.status === "redeemed") return { ok: false, error: "This gift has already been claimed" }
  if (gift.purchaserId === user.id) {
    return { ok: false, error: "This is the link you bought - share it with the person you're gifting" }
  }

  const existing = await getUserEnrollment(gift.courseSlug, user.id)
  if (existing?.status === "paid") {
    return { ok: false, error: "You already have access to this course" }
  }

  // Claim first, atomically: only one person can flip a paid gift to redeemed.
  const [claimed] = await db
    .update(courseGifts)
    .set({ status: "redeemed", redeemedById: user.id, redeemedByEmail: user.email, redeemedAt: new Date() })
    .where(and(eq(courseGifts.id, gift.id), eq(courseGifts.status, "paid")))
    .returning()
  if (!claimed) return { ok: false, error: "This gift has already been claimed" }

  try {
    // An abandoned checkout is not an enrolment - clear it out of the way.
    if (existing?.status === "pending") {
      await db.update(courseEnrollments).set({ status: "cancelled" }).where(eq(courseEnrollments.id, existing.id))
    }
    const live = existing?.status === "pending" ? null : existing

    let enrollment: typeof courseEnrollments.$inferSelect
    if (live) {
      // Pre-registered already: the gift covers the rest.
      ;[enrollment] = await db
        .update(courseEnrollments)
        .set({ status: "paid", paidAt: new Date() })
        .where(eq(courseEnrollments.id, live.id))
        .returning()
    } else {
      ;[enrollment] = await db.insert(courseEnrollments).values({
        courseSlug: gift.courseSlug,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        status: "paid",
        lockedPricePaise: gift.pricePaise,
        paidAt: new Date(),
      }).returning()
    }

    await db.update(courseGifts).set({ enrollmentId: enrollment.id }).where(eq(courseGifts.id, gift.id))
    await finalizeCourseEnrollment(enrollment)
    return { ok: true, courseSlug: gift.courseSlug }
  } catch (err) {
    // Couldn't enrol them - give the gift back rather than burn it.
    console.error("redeemGift failed, releasing gift:", err)
    await db
      .update(courseGifts)
      .set({ status: "paid", redeemedById: null, redeemedByEmail: null, redeemedAt: null })
      .where(and(eq(courseGifts.id, gift.id), ne(courseGifts.status, "paid")))
    return { ok: false, error: "Something went wrong claiming this gift. Please try again." }
  }
}

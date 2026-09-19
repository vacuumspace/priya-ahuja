import { randomInt } from "crypto"
import { db } from "@/lib/db"
import { courseEnrollments, courseGifts, toolUnlocks, workshopRegistrations } from "@/lib/db/schema"
import { and, eq, gt, inArray, isNotNull, isNull, ne, or } from "drizzle-orm"
import { sendCourseEnrollmentConfirmation, sendAdminCourseNotification } from "@/lib/mailer"
import { coursePaise, getCourse } from "@/lib/courses-data"

export type CourseEnrollment = typeof courseEnrollments.$inferSelect
export type CoursePaymentStage = "preregister" | "balance"

// An unpaid pre-registration order holds its seat this long, so seats aren't
// tied up forever by abandoned checkouts but a real one in progress isn't lost.
const SEAT_HOLD_MS = 15 * 60 * 1000

// No 0/O/1/I - the code gets read off a page and typed by hand.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function formatRupees(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`
}

// A founding seat = a paid pre-registration, or a pre-registration checkout
// still within its hold window. Direct full-price purchases and admin test
// rows (no payment ids) don't take one.
function seatHoldFilter(courseSlug: string) {
  const holdCutoff = new Date(Date.now() - SEAT_HOLD_MS)
  return and(
    eq(courseEnrollments.courseSlug, courseSlug),
    ne(courseEnrollments.status, "cancelled"),
    or(
      isNotNull(courseEnrollments.preRegPaymentId),
      and(
        eq(courseEnrollments.status, "pending"),
        isNotNull(courseEnrollments.preRegOrderId),
        gt(courseEnrollments.createdAt, holdCutoff),
      ),
    ),
  )
}

// A gift bought at the founder price also holds a founding seat, so "first 100
// founders" stays true: paid gifts, or a gift checkout still in its hold window.
// Gifts bought at the regular price (offer over or seats gone) don't.
function giftSeatFilter(courseSlug: string) {
  const course = getCourse(courseSlug)
  const holdCutoff = new Date(Date.now() - SEAT_HOLD_MS)
  return and(
    eq(courseGifts.courseSlug, courseSlug),
    eq(courseGifts.pricePaise, course ? coursePaise(course).founder : -1),
    or(
      and(isNotNull(courseGifts.razorpayPaymentId), inArray(courseGifts.status, ["paid", "redeemed"])),
      and(eq(courseGifts.status, "pending"), gt(courseGifts.createdAt, holdCutoff)),
    ),
  )
}

export async function getSeatsTaken(courseSlug: string): Promise<number> {
  const [enrollments, gifts] = await Promise.all([
    db.select({ id: courseEnrollments.id }).from(courseEnrollments).where(seatHoldFilter(courseSlug)),
    db.select({ id: courseGifts.id }).from(courseGifts).where(giftSeatFilter(courseSlug)),
  ])
  return enrollments.length + gifts.length + (getCourse(courseSlug)?.offlineSeats ?? 0)
}

// Whether `holderId` (an enrolment or a gift) is within the first `cap` seat
// holders, oldest first. Run right after inserting a pending pre-registration or
// gift: two people racing for the last seat both insert, and only the earlier
// one keeps it.
export async function holdsFoundingSeat(courseSlug: string, holderId: string, cap: number): Promise<boolean> {
  const [enrollments, gifts] = await Promise.all([
    db
      .select({ id: courseEnrollments.id, createdAt: courseEnrollments.createdAt })
      .from(courseEnrollments)
      .where(seatHoldFilter(courseSlug)),
    db
      .select({ id: courseGifts.id, createdAt: courseGifts.createdAt })
      .from(courseGifts)
      .where(giftSeatFilter(courseSlug)),
  ])
  const holders = [...enrollments, ...gifts].sort(
    (x, y) => x.createdAt.getTime() - y.createdAt.getTime() || (x.id < y.id ? -1 : 1),
  )
  return holders.slice(0, cap).some((h) => h.id === holderId)
}

export async function getUserEnrollment(courseSlug: string, userId: string): Promise<CourseEnrollment | null> {
  const [row] = await db
    .select()
    .from(courseEnrollments)
    .where(and(
      eq(courseEnrollments.courseSlug, courseSlug),
      eq(courseEnrollments.userId, userId),
      ne(courseEnrollments.status, "cancelled"),
    ))
    .limit(1)
  return row ?? null
}

// Unique across both tables that hand out codes redeemable on the booking form.
async function generateGiftCode(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    let candidate = ""
    for (let i = 0; i < 6; i++) candidate += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]

    const [inEnrollments] = await db.select({ id: courseEnrollments.id }).from(courseEnrollments).where(eq(courseEnrollments.giftCode, candidate)).limit(1)
    if (inEnrollments) continue
    const [inWorkshops] = await db.select({ id: workshopRegistrations.id }).from(workshopRegistrations).where(eq(workshopRegistrations.referralCode, candidate)).limit(1)
    if (inWorkshops) continue
    return candidate
  }
  throw new Error("Could not generate a unique gift code")
}

// The free one-time startup score report card, granted as an already-paid
// tool unlock - the startup-score flow already knows how to find and consume one.
// The synthetic order id is unique per enrolment, so a retry can't double-grant.
async function grantStartupScoreUnlock(enrollment: CourseEnrollment) {
  await db
    .insert(toolUnlocks)
    .values({
      tool: "startup-score",
      userId: enrollment.userId,
      razorpayOrderId: `course_free_${enrollment.id}`,
      amountPaise: 0,
      status: "paid",
    })
    .onConflictDoNothing({ target: toolUnlocks.razorpayOrderId })
}

// Every side effect that follows a confirmed course payment: the free
// startup score and gift code (once fully paid), and the emails. Shared by the
// verify-payment route, the webhook safety net and the admin test bypass, so
// all three stay in sync. Each email is guarded by an atomic claim so a
// concurrent verify + webhook can't send it twice.
export async function finalizeCourseEnrollment(
  enrollment: CourseEnrollment,
  { sendEmail = true }: { sendEmail?: boolean } = {}
): Promise<CourseEnrollment> {
  const course = getCourse(enrollment.courseSlug)
  let current = enrollment

  // A pre-registration only locks the price - the free startup score and the
  // 1:1 session both unlock once the course is paid in full.
  if (current.status === "paid") {
    try {
      await grantStartupScoreUnlock(current)
    } catch (e) {
      console.error("grantStartupScoreUnlock failed:", e)
    }
  }

  if (current.status === "paid" && !current.giftCode) {
    try {
      const code = await generateGiftCode()
      const [updated] = await db
        .update(courseEnrollments)
        .set({ giftCode: code })
        .where(and(eq(courseEnrollments.id, current.id), isNull(courseEnrollments.giftCode)))
        .returning()
      if (updated) current = updated
      else {
        const [fresh] = await db.select().from(courseEnrollments).where(eq(courseEnrollments.id, current.id)).limit(1)
        if (fresh) current = fresh
      }
    } catch (e) {
      console.error("gift code generation failed:", e)
    }
  }

  if (!sendEmail || !course) return current

  const paymentPaise = coursePaise(course)
  const balancePaise = current.lockedPricePaise - (current.preRegAmountPaid ?? 0)

  if (current.status === "preregistered" && !current.preRegEmailSent) {
    const claimed = await db
      .update(courseEnrollments)
      .set({ preRegEmailSent: true })
      .where(and(eq(courseEnrollments.id, current.id), eq(courseEnrollments.preRegEmailSent, false)))
      .returning({ id: courseEnrollments.id })

    if (claimed.length > 0) {
      sendCourseEnrollmentConfirmation({
        to: current.userEmail,
        name: current.userName,
        courseTitle: course.title,
        kind: "preregistered",
        launchLabel: course.launchLabel,
        balanceLabel: formatRupees(balancePaise),
      }).catch((e) => console.error("[mailer] sendCourseEnrollmentConfirmation failed:", e))

      sendAdminCourseNotification({
        courseTitle: course.title,
        kind: "preregistered",
        userName: current.userName,
        userEmail: current.userEmail,
        amountLabel: `${formatRupees(current.preRegAmountPaid ?? paymentPaise.preRegister)} pre-registration`,
      }).catch((e) => console.error("[mailer] sendAdminCourseNotification failed:", e))
    }
  }

  if (current.status === "paid" && !current.enrolledEmailSent) {
    const claimed = await db
      .update(courseEnrollments)
      .set({ enrolledEmailSent: true })
      .where(and(eq(courseEnrollments.id, current.id), eq(courseEnrollments.enrolledEmailSent, false)))
      .returning({ id: courseEnrollments.id })

    if (claimed.length > 0) {
      sendCourseEnrollmentConfirmation({
        to: current.userEmail,
        name: current.userName,
        courseTitle: course.title,
        kind: "enrolled",
        launchLabel: course.launchLabel,
        giftCode: current.giftCode,
      }).catch((e) => console.error("[mailer] sendCourseEnrollmentConfirmation failed:", e))

      sendAdminCourseNotification({
        courseTitle: course.title,
        kind: "enrolled",
        userName: current.userName,
        userEmail: current.userEmail,
        amountLabel: `${formatRupees((current.preRegAmountPaid ?? 0) + (current.balanceAmountPaid ?? 0))} total paid`,
      }).catch((e) => console.error("[mailer] sendAdminCourseNotification failed:", e))
    }
  }

  return current
}

// Records a captured payment against an enrolment and runs the follow-ups.
// Idempotent - the verify route and the webhook can both call it for the same
// payment; whichever lands second finds the payment already recorded.
export async function confirmCoursePayment(
  enrollment: CourseEnrollment,
  stage: CoursePaymentStage,
  paymentId: string,
  amountPaise: number,
  { sendEmail = true }: { sendEmail?: boolean } = {}
): Promise<CourseEnrollment> {
  let current = enrollment

  if (stage === "preregister" && !current.preRegPaymentId) {
    const [updated] = await db
      .update(courseEnrollments)
      .set({
        // A pre-registration can only ever confirm a not-yet-paid row.
        status: current.status === "paid" ? "paid" : "preregistered",
        preRegPaymentId: paymentId,
        preRegAmountPaid: amountPaise,
        preRegisteredAt: new Date(),
      })
      .where(eq(courseEnrollments.id, current.id))
      .returning()
    if (updated) current = updated
  }

  if (stage === "balance" && !current.balancePaymentId) {
    const [updated] = await db
      .update(courseEnrollments)
      .set({
        status: "paid",
        balancePaymentId: paymentId,
        balanceAmountPaid: amountPaise,
        paidAt: new Date(),
      })
      .where(eq(courseEnrollments.id, current.id))
      .returning()
    if (updated) current = updated
  }

  return finalizeCourseEnrollment(current, { sendEmail })
}

export function balanceDuePaise(enrollment: CourseEnrollment): number {
  return Math.max(0, enrollment.lockedPricePaise - (enrollment.preRegAmountPaid ?? 0))
}

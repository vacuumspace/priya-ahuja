import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseEnrollments } from "@/lib/db/schema"
import { getRazorpayInstance } from "@/lib/razorpay"
import { and, eq } from "drizzle-orm"
import { coursePaise, courseLaunched, courseOfferOpen, getCourse } from "@/lib/courses-data"
import {
  balanceDuePaise,
  finalizeCourseEnrollment,
  getSeatsTaken,
  getUserEnrollment,
  holdsFoundingSeat,
} from "@/lib/course-enrollment"

function isUniqueViolation(err: unknown) {
  return !!err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23505"
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }
    const userId = session.user.id
    const userEmail = session.user.email

    const { courseSlug, stage, name } = await req.json()
    const course = typeof courseSlug === "string" ? getCourse(courseSlug) : undefined
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })
    if (stage !== "preregister" && stage !== "balance") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }
    const userName = typeof name === "string" ? name.trim() : ""
    if (!userName) return NextResponse.json({ error: "Enter your name" }, { status: 400 })

    const paise = coursePaise(course)
    const admin = isAdmin(userEmail)
    const existing = await getUserEnrollment(course.slug, userId)

    // An abandoned checkout leaves a pending row behind - replace it rather
    // than blocking the person from trying again.
    if (existing?.status === "pending") {
      await db.update(courseEnrollments).set({ status: "cancelled" }).where(eq(courseEnrollments.id, existing.id))
    }
    const live = existing?.status === "pending" ? null : existing

    if (stage === "preregister") {
      if (live) {
        return NextResponse.json(
          { error: live.status === "paid" ? "You're already enrolled" : "You've already pre-registered" },
          { status: 409 },
        )
      }
      if (!admin && !courseOfferOpen(course)) {
        return NextResponse.json({ error: "Pre-registration has closed" }, { status: 400 })
      }
      if (!admin && (await getSeatsTaken(course.slug)) >= course.seatCap) {
        return NextResponse.json({ error: "All founding seats are taken" }, { status: 409 })
      }

      // Admin bypass, matching the workshop pattern: no Razorpay, no payment
      // ids (a clear sign this was a free test), no emails to yourself.
      if (admin) {
        const [row] = await db.insert(courseEnrollments).values({
          courseSlug: course.slug,
          userId,
          userName,
          userEmail,
          status: "preregistered",
          lockedPricePaise: paise.founder,
          preRegisteredAt: new Date(),
        }).returning()
        const done = await finalizeCourseEnrollment(row, { sendEmail: false })
        return NextResponse.json({ skipPayment: true, enrollmentId: done.id, status: done.status, giftCode: done.giftCode })
      }

      const order = await getRazorpayInstance().orders.create({
        amount: paise.preRegister,
        currency: "INR",
        receipt: `course_pre_${Date.now()}`,
      })

      let row: typeof courseEnrollments.$inferSelect
      try {
        [row] = await db.insert(courseEnrollments).values({
          courseSlug: course.slug,
          userId,
          userName,
          userEmail,
          status: "pending",
          lockedPricePaise: paise.founder,
          preRegOrderId: order.id,
        }).returning()
      } catch (err) {
        if (isUniqueViolation(err)) {
          return NextResponse.json({ error: "You've already pre-registered" }, { status: 409 })
        }
        throw err
      }

      // Two people can pass the seat check above for the last seat at once;
      // ranking the seat-holders now settles it before anyone is charged.
      if (!(await holdsFoundingSeat(course.slug, row.id, course.seatCap - course.offlineSeats))) {
        await db.update(courseEnrollments).set({ status: "cancelled" }).where(eq(courseEnrollments.id, row.id))
        return NextResponse.json({ error: "All founding seats are taken" }, { status: 409 })
      }

      return NextResponse.json({
        orderId: order.id,
        amount: paise.preRegister,
        keyId: process.env.RAZORPAY_KEY_ID,
        enrollmentId: row.id,
      })
    }

    // stage === "balance": the rest of a pre-registration, or the full price
    // for someone who never pre-registered. Only opens once the course is live.
    if (live?.status === "paid") {
      return NextResponse.json({ error: "You're already enrolled" }, { status: 409 })
    }
    if (!admin && !courseLaunched(course)) {
      return NextResponse.json({ error: `Payment opens on ${course.launchLabel}` }, { status: 400 })
    }

    if (admin) {
      if (live) {
        const [row] = await db
          .update(courseEnrollments)
          .set({ status: "paid", paidAt: new Date() })
          .where(eq(courseEnrollments.id, live.id))
          .returning()
        const done = await finalizeCourseEnrollment(row, { sendEmail: false })
        return NextResponse.json({ skipPayment: true, enrollmentId: done.id, status: done.status, giftCode: done.giftCode })
      }
      const [row] = await db.insert(courseEnrollments).values({
        courseSlug: course.slug,
        userId,
        userName,
        userEmail,
        status: "paid",
        lockedPricePaise: paise.list,
        paidAt: new Date(),
      }).returning()
      const done = await finalizeCourseEnrollment(row, { sendEmail: false })
      return NextResponse.json({ skipPayment: true, enrollmentId: done.id, status: done.status, giftCode: done.giftCode })
    }

    const amount = live ? balanceDuePaise(live) : paise.list
    if (amount < 100) {
      return NextResponse.json({ error: "Nothing left to pay" }, { status: 400 })
    }

    const order = await getRazorpayInstance().orders.create({
      amount,
      currency: "INR",
      receipt: `course_bal_${Date.now()}`,
    })

    let enrollmentId: string
    if (live) {
      await db
        .update(courseEnrollments)
        .set({ balanceOrderId: order.id, userName })
        .where(and(eq(courseEnrollments.id, live.id), eq(courseEnrollments.status, "preregistered")))
      enrollmentId = live.id
    } else {
      try {
        const [row] = await db.insert(courseEnrollments).values({
          courseSlug: course.slug,
          userId,
          userName,
          userEmail,
          status: "pending",
          lockedPricePaise: paise.list,
          balanceOrderId: order.id,
        }).returning({ id: courseEnrollments.id })
        enrollmentId = row.id
      } catch (err) {
        if (isUniqueViolation(err)) {
          return NextResponse.json({ error: "You already have an enrolment for this course" }, { status: 409 })
        }
        throw err
      }
    }

    return NextResponse.json({
      orderId: order.id,
      amount,
      keyId: process.env.RAZORPAY_KEY_ID,
      enrollmentId,
    })
  } catch (err) {
    console.error("course create-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

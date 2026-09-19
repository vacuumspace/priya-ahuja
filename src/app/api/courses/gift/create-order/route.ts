import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseGifts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getRazorpayInstance } from "@/lib/razorpay"
import { coursePaise, getCourse } from "@/lib/courses-data"
import { finalizeGift, giftPricePaise, giftUrl, giftCardUrl, newGiftToken } from "@/lib/course-gift"
import { getSeatsTaken, holdsFoundingSeat } from "@/lib/course-enrollment"
import { cardVersion, tidy, tidyMessage, validateCardMessage, validateCardName } from "@/lib/gift-card"

// Starts a gift purchase. There's no limit on how many one person can buy.
// The price is worked out here, never taken from the client: the founder price
// while the offer is open and founding seats remain (a founder-price gift
// uses a seat), the regular price otherwise.
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }
    const purchaserId = session.user.id
    const purchaserEmail = session.user.email

    const { courseSlug, fromName, recipientName, message } = await req.json()
    const course = typeof courseSlug === "string" ? getCourse(courseSlug) : undefined
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

    const from = tidy(fromName)
    const recipient = tidy(recipientName)
    const note = tidyMessage(message)
    const problem =
      validateCardName(from, "your name") ?? validateCardName(recipient, "the name of the person you're gifting") ?? validateCardMessage(note)
    if (problem) return NextResponse.json({ error: problem }, { status: 400 })

    const seatsTaken = await getSeatsTaken(course.slug)
    const pricePaise = giftPricePaise(course, seatsTaken)
    const usesFoundingSeat = pricePaise === coursePaise(course).founder
    const token = newGiftToken()

    // Admin bypass, like the other course flows: no Razorpay, no payment ids
    // (a clear sign this was a free test - so it never takes a seat), no emails.
    if (isAdmin(purchaserEmail)) {
      const [row] = await db.insert(courseGifts).values({
        courseSlug: course.slug,
        purchaserId,
        purchaserName: from,
        purchaserEmail,
        recipientName: recipient,
        message: note || null,
        token,
        pricePaise,
        status: "paid",
      }).returning()
      await finalizeGift(row, { sendEmail: false })
      return NextResponse.json({
        skipPayment: true,
        giftId: row.id,
        token,
        link: giftUrl(token),
        cardUrl: giftCardUrl(token, cardVersion(row)),
      })
    }

    const order = await getRazorpayInstance().orders.create({
      amount: pricePaise,
      currency: "INR",
      receipt: `course_gift_${Date.now()}`,
    })

    const [row] = await db.insert(courseGifts).values({
      courseSlug: course.slug,
      purchaserId,
      purchaserName: from,
      purchaserEmail,
      recipientName: recipient,
      message: note || null,
      token,
      pricePaise,
      razorpayOrderId: order.id,
      status: "pending",
    }).returning({ id: courseGifts.id })

    // Two people can take the last founding seat at the same moment; ranking the
    // holders now settles it before anyone is charged.
    if (usesFoundingSeat && !(await holdsFoundingSeat(course.slug, row.id, course.seatCap - course.offlineSeats))) {
      await db.update(courseGifts).set({ status: "cancelled" }).where(eq(courseGifts.id, row.id))
      return NextResponse.json(
        { error: "The last founding seat was just taken. Please try again to see the regular price." },
        { status: 409 },
      )
    }

    return NextResponse.json({
      orderId: order.id,
      amount: pricePaise,
      keyId: process.env.RAZORPAY_KEY_ID,
      giftId: row.id,
    })
  } catch (err) {
    console.error("course gift create-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

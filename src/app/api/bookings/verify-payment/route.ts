import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bookings, availability } from "@/lib/db/schema"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { eq } from "drizzle-orm"
import { sendBookingConfirmation } from "@/lib/resend"

export async function POST(req: NextRequest) {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    if (!bookingId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    const [booking] = await db
      .update(bookings)
      .set({ status: "paid", razorpayPaymentId })
      .where(eq(bookings.id, bookingId))
      .returning()

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Mark the slot as booked so it disappears from the picker
    if (booking.slotId) {
      await db
        .update(availability)
        .set({ isBooked: true })
        .where(eq(availability.id, booking.slotId))
    }

    sendBookingConfirmation({
      to: booking.userEmail,
      name: booking.userName,
      serviceName: "your session",
      date: "TBD – we'll send a calendar invite",
      time: "",
      meetLink: booking.meetLink ?? undefined,
    }).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("verify-payment error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { workshopRegistrations, workshops } from "@/lib/db/schema"
import { verifyPaymentSignature, fetchRazorpayOrder } from "@/lib/razorpay"
import { eq } from "drizzle-orm"
import { finalizeWorkshopRegistration } from "@/lib/finalize-workshop-registration"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    const { registrationId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    if (!registrationId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const [registration] = await db
      .select()
      .from(workshopRegistrations)
      .where(eq(workshopRegistrations.id, registrationId))
      .limit(1)

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // A guest registration (no userId) has no session to check ownership
    // against - it's secured instead by needing both the registrationId and
    // a Razorpay signature that only the payer's own checkout would receive.
    // A signed-in registration must still match the calling session.
    if (registration.userId && registration.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (registration.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 })
    }

    const [workshop] = await db.select().from(workshops).where(eq(workshops.id, registration.workshopId)).limit(1)
    if (!workshop) {
      return NextResponse.json({ error: "Workshop not found" }, { status: 404 })
    }

    // Idempotency: if already confirmed AND post-payment side-effects completed, short-circuit
    if (registration.status === "confirmed" && registration.razorpayPaymentId && registration.calendarInviteSent) {
      return NextResponse.json({ success: true, meetLink: workshop.meetLink, referralCode: registration.referralCode })
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    if (!isValid) {
      await db.update(workshopRegistrations).set({ status: "cancelled" }).where(eq(workshopRegistrations.id, registrationId))
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // The order's amount was fixed at create-order time (from workshop.price
    // as it was then) and Razorpay charges exactly that - it can never be
    // paid at a different amount, so this is just reading back the amount
    // actually captured, not re-validating it against the *current* (possibly
    // since-edited) workshop price, which would otherwise reject a
    // legitimately paid order and strand it.
    let amountPaid: number
    try {
      const rzOrder = await fetchRazorpayOrder(razorpayOrderId)
      amountPaid = rzOrder.amount
    } catch (err) {
      console.error("Razorpay order fetch failed (continuing):", err)
      amountPaid = workshop.price
    }

    const [confirmed] = await db
      .update(workshopRegistrations)
      .set({ status: "confirmed", razorpayPaymentId, amountPaid })
      .where(eq(workshopRegistrations.id, registrationId))
      .returning()

    const { meetLink, referralCode } = await finalizeWorkshopRegistration(confirmed, workshop)

    return NextResponse.json({ success: true, meetLink, referralCode })
  } catch (err) {
    console.error("workshop verify-payment error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

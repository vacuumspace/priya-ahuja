import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bookings, services as servicesTable, availability } from "@/lib/db/schema"
import { getRazorpayInstance } from "@/lib/razorpay"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  try {
    const { serviceSlug, slotId, name, email, message } = await req.json()

    if (!serviceSlug || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const [service] = await db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.slug, serviceSlug))
      .limit(1)

    if (!service || !service.isActive) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // For call-type services, a slot must be provided
    if (service.type === "call" && !slotId) {
      return NextResponse.json({ error: "Please select a time slot" }, { status: 400 })
    }

    // Verify slot is still available
    if (slotId) {
      const [slot] = await db
        .select()
        .from(availability)
        .where(eq(availability.id, slotId))
        .limit(1)

      if (!slot || slot.isBooked) {
        return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 })
      }
    }

    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: service.price,
      currency: "INR",
      receipt: `booking_${Date.now()}`,
    })

    const [booking] = await db.insert(bookings).values({
      serviceId: service.id,
      slotId: slotId ?? null,
      userName: name,
      userEmail: email,
      message: message || null,
      razorpayOrderId: order.id,
      status: "pending",
    }).returning({ id: bookings.id })

    return NextResponse.json({
      orderId: order.id,
      amount: service.price,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: booking.id,
    })
  } catch (err) {
    console.error("create-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

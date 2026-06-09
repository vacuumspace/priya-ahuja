import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bookings, services as servicesTable } from "@/lib/db/schema"
import { getService } from "@/lib/services-data"
import { getRazorpayInstance } from "@/lib/razorpay"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  try {
    const { serviceSlug, name, email, message } = await req.json()

    if (!serviceSlug || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const service = getService(serviceSlug)
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Find matching DB service by slug to get its UUID
    const [dbService] = await db
      .select({ id: servicesTable.id })
      .from(servicesTable)
      .where(eq(servicesTable.slug, serviceSlug))
      .limit(1)

    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: service.price,
      currency: "INR",
      receipt: `booking_${Date.now()}`,
    })

    // Create pending booking (serviceId may be null if DB not seeded yet)
    const [booking] = await db.insert(bookings).values({
      serviceId: dbService?.id ?? "00000000-0000-0000-0000-000000000000",
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

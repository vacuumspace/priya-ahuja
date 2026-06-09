import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bookings, services as servicesTable, availability } from "@/lib/db/schema"
import { getRazorpayInstance } from "@/lib/razorpay"
import { eq, and } from "drizzle-orm"

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

    // Resolve slotId: synthetic IDs are "YYYY-MM-DDTHH:MM", real ones are UUIDs
    let resolvedSlotId: string | null = slotId ?? null
    if (slotId && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(slotId)) {
      const [date, startTime] = slotId.split("T")
      // Derive end time from service duration
      const [h, m] = startTime.split(":").map(Number)
      const endTotal = h * 60 + m + (service.durationMin ?? 30)
      const endTime = `${String(Math.floor(endTotal / 60)).padStart(2, "0")}:${String(endTotal % 60).padStart(2, "0")}`

      // Check not already booked
      const existing = await db
        .select({ id: availability.id, isBooked: availability.isBooked })
        .from(availability)
        .where(and(eq(availability.serviceId, service.id), eq(availability.date, date), eq(availability.startTime, startTime)))
        .limit(1)

      if (existing.length > 0 && existing[0].isBooked) {
        return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 })
      }

      if (existing.length === 0) {
        const [newSlot] = await db.insert(availability).values({ serviceId: service.id, date, startTime, endTime, isBooked: false }).returning({ id: availability.id })
        resolvedSlotId = newSlot.id
      } else {
        resolvedSlotId = existing[0].id
      }
    } else if (slotId) {
      const [slot] = await db.select().from(availability).where(eq(availability.id, slotId)).limit(1)
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
      slotId: resolvedSlotId,
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

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, services as servicesTable, availability } from "@/lib/db/schema"
import { getRazorpayInstance } from "@/lib/razorpay"
import { eq, and } from "drizzle-orm"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { serviceSlug, slotId, name, message } = await req.json()

    if (!serviceSlug || !name) {
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

    if (service.type === "call" && !slotId) {
      return NextResponse.json({ error: "Please select a time slot" }, { status: 400 })
    }

    let resolvedSlotId: string | null = slotId ?? null

    if (slotId) {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(slotId)) {
        // Datetime string — find or create the availability row then lock atomically
        const [date, startTime] = slotId.split("T")
        const [h, m] = startTime.split(":").map(Number)
        const endTotal = h * 60 + m + (service.durationMin ?? 30)
        const endTime = `${String(Math.floor(endTotal / 60)).padStart(2, "0")}:${String(endTotal % 60).padStart(2, "0")}`

        const [existing] = await db
          .select()
          .from(availability)
          .where(and(eq(availability.serviceId, service.id), eq(availability.date, date), eq(availability.startTime, startTime)))
          .limit(1)

        if (existing) {
          // Atomic update: only succeeds if the row is still unbooked
          const locked = await db
            .update(availability)
            .set({ isBooked: true })
            .where(and(eq(availability.id, existing.id), eq(availability.isBooked, false)))
            .returning({ id: availability.id })

          if (locked.length === 0) {
            return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 })
          }
          resolvedSlotId = locked[0].id
        } else {
          // Slot row doesn't exist yet — insert with isBooked: true
          const [newSlot] = await db
            .insert(availability)
            .values({ serviceId: service.id, date, startTime, endTime, isBooked: true })
            .returning({ id: availability.id })
          resolvedSlotId = newSlot.id
        }
      } else {
        // UUID slot id — atomic update: only succeeds if still unbooked
        const locked = await db
          .update(availability)
          .set({ isBooked: true })
          .where(and(eq(availability.id, slotId), eq(availability.isBooked, false)))
          .returning({ id: availability.id })

        if (locked.length === 0) {
          return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 })
        }
      }
    }

    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: 100, // TEMP: ₹1 for testing (original: service.price)
      currency: "INR",
      receipt: `booking_${Date.now()}`,
    })

    const [booking] = await db.insert(bookings).values({
      serviceId: service.id,
      slotId: resolvedSlotId,
      userName: name,
      userEmail: session.user.email,
      message: message || null,
      razorpayOrderId: order.id,
      status: "pending",
    }).returning({ id: bookings.id })

    return NextResponse.json({
      orderId: order.id,
      amount: 100, // TEMP: ₹1 for testing (original: service.price)
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: booking.id,
    })
  } catch (err) {
    console.error("create-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

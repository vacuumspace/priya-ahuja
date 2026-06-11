import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, services, availability } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const rows = await db
    .select({
      id: bookings.id,
      userName: bookings.userName,
      userEmail: bookings.userEmail,
      message: bookings.message,
      status: bookings.status,
      meetLink: bookings.meetLink,
      adminNotes: bookings.adminNotes,
      razorpayOrderId: bookings.razorpayOrderId,
      razorpayPaymentId: bookings.razorpayPaymentId,
      createdAt: bookings.createdAt,
      serviceTitle: services.title,
      serviceId: bookings.serviceId,
      slotDate: availability.date,
      slotStartTime: availability.startTime,
    })
    .from(bookings)
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .leftJoin(availability, eq(bookings.slotId, availability.id))
    .orderBy(desc(bookings.createdAt))

  return Response.json(rows)
}

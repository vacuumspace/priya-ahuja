import { db } from "@/lib/db"
import { bookings, services, availability, users } from "@/lib/db/schema"
import { eq, desc, asc, and, notInArray, like } from "drizzle-orm"
import BookingsClient from "./BookingsClient"

export default async function BookingsPage() {
  await db
    .update(bookings)
    .set({ adminSeen: true })
    .where(and(eq(bookings.adminSeen, false), notInArray(bookings.status, ["cancelled", "pending"])))

  const rows = await db
    .select({
      id: bookings.id,
      userName: bookings.userName,
      userEmail: bookings.userEmail,
      userId: users.id,
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
      feedbackRating: bookings.feedbackRating,
      feedbackText: bookings.feedbackText,
    })
    .from(bookings)
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .leftJoin(availability, eq(bookings.slotId, availability.id))
    .leftJoin(users, eq(bookings.userEmail, users.email))
    .where(like(bookings.razorpayPaymentId, "pay_%"))
    .orderBy(desc(availability.date), asc(availability.startTime))

  const serialized = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  }))

  return <BookingsClient initialBookings={serialized} />
}

import { db } from "@/lib/db"
import { bookings, services, availability, users } from "@/lib/db/schema"
import { eq, desc, and, notInArray } from "drizzle-orm"
import BookingsClient from "./BookingsClient"

export default async function BookingsPage() {
  // Mark all unseen confirmed/completed/paid bookings as seen
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
    .orderBy(desc(bookings.createdAt))

  const serialized = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  }))

  return <BookingsClient initialBookings={serialized} />
}

import { db } from "@/lib/db"
import { bookings, services, availability } from "@/lib/db/schema"
import { eq, asc, desc } from "drizzle-orm"
import ServicesClient from "./ServicesClient"

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab: defaultTab } = await searchParams
  const [servicesData, bookingsData] = await Promise.all([
    db.select().from(services).orderBy(asc(services.order)),
    db
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
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .leftJoin(availability, eq(bookings.slotId, availability.id))
      .orderBy(desc(bookings.createdAt)),
  ])

  const serializedBookings = bookingsData.map((b) => ({
    ...b,
    createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
  }))

  return <ServicesClient initialServices={servicesData} initialBookings={serializedBookings} defaultTab={defaultTab} />
}

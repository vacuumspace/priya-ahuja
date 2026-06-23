import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, services as servicesTable, digitalProducts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const email = session.user.email

  const [userBookings, userPurchases] = await Promise.all([
    db
      .select({
        id: bookings.id,
        status: bookings.status,
        createdAt: bookings.createdAt,
        meetLink: bookings.meetLink,
        serviceTitle: servicesTable.title,
        serviceSlug: servicesTable.slug,
        serviceType: servicesTable.type,
      })
      .from(bookings)
      .leftJoin(servicesTable, eq(bookings.serviceId, servicesTable.id))
      .where(eq(bookings.userEmail, email))
      .orderBy(desc(bookings.createdAt)),

    db
      .select({
        id: purchases.id,
        createdAt: purchases.createdAt,
        productTitle: digitalProducts.title,
        productSlug: digitalProducts.slug,
      })
      .from(purchases)
      .leftJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(eq(purchases.userEmail, email))
      .orderBy(desc(purchases.createdAt)),
  ])

  return NextResponse.json({ bookings: userBookings, purchases: userPurchases })
}

import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, startupScores, services, digitalProducts, users } from "@/lib/db/schema"
import { desc, eq, not, inArray } from "drizzle-orm"

const PAGE_SIZE = 10

export async function GET(req: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const offset = (page - 1) * PAGE_SIZE

  // Fetch all three sources
  const [allBookings, allPurchases, allScores] = await Promise.all([
    db
      .select({
        id: bookings.id,
        userName: bookings.userName,
        userEmail: bookings.userEmail,
        razorpayPaymentId: bookings.razorpayPaymentId,
        status: bookings.status,
        createdAt: bookings.createdAt,
        itemName: services.title,
        amount: services.price,
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(not(inArray(bookings.status, ["pending", "cancelled"]))),

    db
      .select({
        id: purchases.id,
        userName: purchases.userName,
        userEmail: purchases.userEmail,
        razorpayPaymentId: purchases.razorpayPaymentId,
        createdAt: purchases.createdAt,
        itemName: digitalProducts.title,
        amount: digitalProducts.price,
      })
      .from(purchases)
      .leftJoin(digitalProducts, eq(purchases.productId, digitalProducts.id)),

    db
      .select({
        id: startupScores.id,
        userId: startupScores.userId,
        razorpayPaymentId: startupScores.razorpayPaymentId,
        createdAt: startupScores.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(startupScores)
      .leftJoin(users, eq(startupScores.userId, users.id))
      .where(eq(startupScores.isPaid, true)),
  ])

  type TxRow = {
    id: string
    type: string
    userName: string
    userEmail: string
    itemName: string
    amount: number | null
    razorpayPaymentId: string | null
    status: string
    createdAt: Date
  }

  const all: TxRow[] = [
    ...allBookings.map((r) => ({
      id: r.id,
      type: "booking",
      userName: r.userName,
      userEmail: r.userEmail ?? "",
      itemName: r.itemName ?? "Session",
      amount: r.amount ?? null,
      razorpayPaymentId: r.razorpayPaymentId,
      status: r.status,
      createdAt: r.createdAt,
    })),
    ...allPurchases.map((r) => ({
      id: r.id,
      type: "template",
      userName: r.userName,
      userEmail: r.userEmail ?? "",
      itemName: r.itemName ?? "Template",
      amount: r.amount ?? null,
      razorpayPaymentId: r.razorpayPaymentId,
      status: "paid",
      createdAt: r.createdAt,
    })),
    ...allScores.map((r) => ({
      id: r.id,
      type: "score",
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      itemName: "Startup Score",
      amount: null,
      razorpayPaymentId: r.razorpayPaymentId,
      status: "paid",
      createdAt: r.createdAt,
    })),
  ]

  all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const total = all.length
  const page_data = all.slice(offset, offset + PAGE_SIZE).map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))

  return Response.json({ transactions: page_data, total, page, pageSize: PAGE_SIZE })
}

import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, startupScores, services, digitalProducts, users, priyaGptTimeTransactions } from "@/lib/db/schema"
import { and, desc, eq, inArray, isNotNull, like } from "drizzle-orm"

const PAGE_SIZE = 10

export async function GET(req: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const offset = (page - 1) * PAGE_SIZE
  const typeFilter = searchParams.get("type")

  // Fetch all sources
  const [allBookings, allPurchases, allScores, allPriyaGpt] = await Promise.all([
    db
      .select({
        id: bookings.id,
        userName: bookings.userName,
        userEmail: bookings.userEmail,
        razorpayPaymentId: bookings.razorpayPaymentId,
        status: bookings.status,
        createdAt: bookings.createdAt,
        itemName: services.title,
        amount: bookings.amountPaid,
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(inArray(bookings.status, ["confirmed", "completed", "paid"])),

    db
      .select({
        id: purchases.id,
        userName: purchases.userName,
        userEmail: purchases.userEmail,
        razorpayPaymentId: purchases.razorpayPaymentId,
        createdAt: purchases.createdAt,
        itemName: digitalProducts.title,
        slug: digitalProducts.slug,
        amount: purchases.amountPaid,
        price: digitalProducts.price,
      })
      .from(purchases)
      .leftJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(and(like(purchases.razorpayPaymentId, "pay_%"), isNotNull(purchases.amountPaid))),

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

    db
      .select({
        id: priyaGptTimeTransactions.id,
        amountPaise: priyaGptTimeTransactions.amountPaise,
        razorpayPaymentId: priyaGptTimeTransactions.razorpayPaymentId,
        createdAt: priyaGptTimeTransactions.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(priyaGptTimeTransactions)
      .leftJoin(users, eq(priyaGptTimeTransactions.userId, users.id))
      .where(eq(priyaGptTimeTransactions.reason, "purchase")),
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
      status: "paid",
      createdAt: r.createdAt,
    })),
    ...allPurchases.map((r) => ({
      id: r.id,
      type: r.slug === "angel-investor-list" ? "angel" : "template",
      userName: r.userName,
      userEmail: r.userEmail ?? "",
      itemName: r.itemName ?? "Template",
      amount: r.amount ?? r.price ?? null,
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
    ...allPriyaGpt.map((r) => ({
      id: r.id,
      type: "priyagpt",
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      itemName: "PriyaGPT Time",
      amount: r.amountPaise,
      razorpayPaymentId: r.razorpayPaymentId,
      status: "paid",
      createdAt: r.createdAt,
    })),
  ]

  const filtered = typeFilter ? all.filter((r) => r.type === typeFilter) : all
  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const total = filtered.length
  const page_data = filtered.slice(offset, offset + PAGE_SIZE).map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))

  return Response.json({ transactions: page_data, total, page, pageSize: PAGE_SIZE })
}

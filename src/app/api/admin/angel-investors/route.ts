import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { auth, isAdmin } from "@/lib/auth"
import { eq, desc, and, like } from "drizzle-orm"
import { angelInvestorsData } from "@/lib/angel-investors-data"

const ANGEL_SLUG = "angel-investor-list"
const PAGE_SIZE = 50
const TX_PAGE_SIZE = 10

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const tab = searchParams.get("tab") ?? "investors"
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const search = searchParams.get("search")?.trim().toLowerCase() ?? ""

  if (tab === "transactions") {
    const allRows = await db
      .select({
        id: purchases.id,
        userName: purchases.userName,
        userEmail: purchases.userEmail,
        razorpayPaymentId: purchases.razorpayPaymentId,
        downloadToken: purchases.downloadToken,
        createdAt: purchases.createdAt,
        amountPaid: purchases.amountPaid,
        price: digitalProducts.price,
      })
      .from(purchases)
      .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(and(eq(digitalProducts.slug, ANGEL_SLUG), like(purchases.razorpayPaymentId, "pay_%")))
      .orderBy(desc(purchases.createdAt))

    const total = allRows.length
    const revenue = allRows.reduce((sum, r) => sum + (r.amountPaid ?? r.price ?? 0), 0)
    const pageCount = Math.ceil(total / TX_PAGE_SIZE)
    const offset = (page - 1) * TX_PAGE_SIZE
    const transactions = allRows.slice(offset, offset + TX_PAGE_SIZE)

    return NextResponse.json({ transactions, total, revenue, page, pageCount })
  }

  // investors tab - in-memory filter + paginate
  let filtered = angelInvestorsData
  if (search) {
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(search) ||
      r.city.toLowerCase().includes(search) ||
      r.state.toLowerCase().includes(search)
    )
  }

  const total = filtered.length
  const offset = (page - 1) * PAGE_SIZE
  const rows = filtered.slice(offset, offset + PAGE_SIZE)

  return NextResponse.json({ investors: rows, total, page, pageCount: Math.ceil(total / PAGE_SIZE) })
}

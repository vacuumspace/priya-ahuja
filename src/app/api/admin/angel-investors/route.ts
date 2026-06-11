import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { angelInvestors, purchases, digitalProducts } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { eq, count, ilike, or, desc } from "drizzle-orm"

const ANGEL_SLUG = "angel-investor-list"
const PAGE_SIZE = 50

async function isAdmin(req: NextRequest) {
  const session = await auth()
  return !!session?.user?.email
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const tab = searchParams.get("tab") ?? "investors"
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const search = searchParams.get("search")?.trim() ?? ""

  if (tab === "transactions") {
    const rows = await db
      .select({
        id: purchases.id,
        userName: purchases.userName,
        userEmail: purchases.userEmail,
        razorpayPaymentId: purchases.razorpayPaymentId,
        downloadToken: purchases.downloadToken,
        createdAt: purchases.createdAt,
        price: digitalProducts.price,
      })
      .from(purchases)
      .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(eq(digitalProducts.slug, ANGEL_SLUG))
      .orderBy(desc(purchases.createdAt))

    const total = rows.length
    const revenue = rows.reduce((sum, r) => sum + (r.price ?? 0), 0)

    return NextResponse.json({ transactions: rows, total, revenue })
  }

  // investors tab
  const filter = search
    ? or(
        ilike(angelInvestors.name, `%${search}%`),
        ilike(angelInvestors.city, `%${search}%`),
        ilike(angelInvestors.state, `%${search}%`),
      )
    : undefined

  const [totalResult, rows] = await Promise.all([
    db.select({ count: count() }).from(angelInvestors).where(filter),
    db
      .select()
      .from(angelInvestors)
      .where(filter)
      .orderBy(angelInvestors.sno)
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
  ])

  const total = totalResult[0].count
  return NextResponse.json({ investors: rows, total, page, pageCount: Math.ceil(total / PAGE_SIZE) })
}

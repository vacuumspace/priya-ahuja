import { db } from "@/lib/db"
import { digitalProducts, purchases } from "@/lib/db/schema"
import { eq, desc, ne, isNotNull, and } from "drizzle-orm"
import ProductsClient from "./ProductsClient"

const ANGEL_SLUG = "angel-investor-list"

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab: defaultTab } = await searchParams

  // Mark all unseen purchases as seen now that admin is viewing the transactions tab
  if (!defaultTab || defaultTab === "transactions") {
    await db.update(purchases).set({ adminSeen: true }).where(eq(purchases.adminSeen, false))
  }

  const [productsData, purchasesData] = await Promise.all([
    db.select().from(digitalProducts).orderBy(desc(digitalProducts.createdAt)),
    db
      .select({
        id: purchases.id,
        userName: purchases.userName,
        userEmail: purchases.userEmail,
        razorpayPaymentId: purchases.razorpayPaymentId,
        downloadToken: purchases.downloadToken,
        createdAt: purchases.createdAt,
        amountPaid: purchases.amountPaid,
        productTitle: digitalProducts.title,
        productSlug: digitalProducts.slug,
      })
      .from(purchases)
      .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(and(ne(digitalProducts.slug, ANGEL_SLUG), isNotNull(purchases.razorpayPaymentId)))
      .orderBy(desc(purchases.createdAt)),
  ])

  const serializedProducts = productsData.map((p) => ({
    ...p,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
  }))
  const serializedPurchases = purchasesData.map((p) => ({
    ...p,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
  }))

  return <ProductsClient initialProducts={serializedProducts} initialPurchases={serializedPurchases} defaultTab={defaultTab} />
}

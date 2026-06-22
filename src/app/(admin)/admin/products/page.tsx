import { db } from "@/lib/db"
import { digitalProducts, purchases } from "@/lib/db/schema"
import { eq, desc, ne } from "drizzle-orm"
import ProductsClient from "./ProductsClient"

const ANGEL_SLUG = "angel-investor-list"

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab: defaultTab } = await searchParams
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
        price: digitalProducts.price,
        productTitle: digitalProducts.title,
        productSlug: digitalProducts.slug,
      })
      .from(purchases)
      .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(ne(digitalProducts.slug, ANGEL_SLUG))
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

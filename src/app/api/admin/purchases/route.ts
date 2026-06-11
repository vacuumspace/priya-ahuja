import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, desc, ne } from "drizzle-orm"

const ANGEL_SLUG = "angel-investor-list"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const rows = await db
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
    .orderBy(desc(purchases.createdAt))

  return Response.json(rows)
}

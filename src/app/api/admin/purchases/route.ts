import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, desc, notInArray } from "drizzle-orm"
import { INVESTOR_SLUGS } from "@/app/api/admin/investor-list/route"

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
    .where(notInArray(digitalProducts.slug, [...INVESTOR_SLUGS]))
    .orderBy(desc(purchases.createdAt))

  return Response.json(rows)
}

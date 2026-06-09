import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { digitalProducts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { isActive, title, price } = body

  const update: Record<string, unknown> = {}
  if (isActive !== undefined) update.isActive = isActive
  if (title !== undefined) update.title = title
  if (price !== undefined) update.price = price

  await db.update(digitalProducts).set(update).where(eq(digitalProducts.id, id))

  return Response.json({ ok: true })
}

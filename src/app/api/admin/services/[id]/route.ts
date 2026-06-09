import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { services } from "@/lib/db/schema"
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
  const { isActive, order, price, title, description } = body

  const update: Record<string, unknown> = {}
  if (isActive !== undefined) update.isActive = isActive
  if (order !== undefined) update.order = order
  if (price !== undefined) update.price = price
  if (title !== undefined) update.title = title
  if (description !== undefined) update.description = description

  await db.update(services).set(update).where(eq(services.id, id))

  return Response.json({ ok: true })
}

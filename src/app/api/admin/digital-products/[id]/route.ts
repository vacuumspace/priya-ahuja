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
  const { isActive, title, price, description, shortDescription, tag, fileUrl, previewImageUrl } = body

  const update: Record<string, unknown> = {}
  if (isActive !== undefined) update.isActive = isActive
  if (title !== undefined) update.title = title
  if (price !== undefined) update.price = price
  if (description !== undefined) update.description = description
  if (shortDescription !== undefined) update.shortDescription = shortDescription
  if (tag !== undefined) update.tag = tag
  if (fileUrl !== undefined) update.fileUrl = fileUrl
  if (previewImageUrl !== undefined) update.previewImageUrl = previewImageUrl

  await db.update(digitalProducts).set(update).where(eq(digitalProducts.id, id))

  return Response.json({ ok: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { id } = await params
  await db.delete(digitalProducts).where(eq(digitalProducts.id, id))

  return Response.json({ ok: true })
}

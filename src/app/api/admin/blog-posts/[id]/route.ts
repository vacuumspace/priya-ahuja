import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
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
  const { isPublished } = body

  const update: Record<string, unknown> = {}
  if (isPublished !== undefined) {
    update.isPublished = isPublished
    update.publishedAt = isPublished ? new Date() : null
  }

  await db.update(blogPosts).set(update).where(eq(blogPosts.id, id))

  return Response.json({ ok: true })
}

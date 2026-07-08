import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupMistakes } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const ALLOWED_FIELDS = ["status", "adminNotes", "title", "body", "industry", "topic"] as const

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const body = await req.json()
  const patch: Record<string, unknown> = {}
  for (const key of ALLOWED_FIELDS) {
    if (key in body) patch[key] = body[key]
  }
  if (patch.status === "published") {
    patch.publishedAt = new Date()
  }

  const [row] = await db
    .update(startupMistakes)
    .set(patch)
    .where(eq(startupMistakes.id, id))
    .returning()

  return Response.json(row)
}

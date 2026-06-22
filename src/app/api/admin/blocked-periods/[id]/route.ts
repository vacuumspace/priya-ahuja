import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { blockedPeriods } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) return new Response("Forbidden", { status: 403 })
  const { id } = await params
  await db.delete(blockedPeriods).where(eq(blockedPeriods.id, id))
  return Response.json({ ok: true })
}

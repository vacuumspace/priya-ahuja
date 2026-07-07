import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { userId } = await params
  await db
    .update(users)
    .set({ priyaGptBlocked: false, priyaGptBlockedReason: null, priyaGptBlockedAt: null, priyaGptBlockedBy: null })
    .where(eq(users.id, userId))

  return Response.json({ ok: true })
}

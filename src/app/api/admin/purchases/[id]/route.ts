import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { id } = await params

  const [updated] = await db
    .update(purchases)
    .set({ downloadToken: null, tokenExpiresAt: null })
    .where(eq(purchases.id, id))
    .returning({ id: purchases.id, downloadToken: purchases.downloadToken })

  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  return Response.json({ id: updated.id, revoked: true })
}

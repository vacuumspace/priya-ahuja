import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { serviceInquiries } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const body = await req.json()
  const [row] = await db
    .update(serviceInquiries)
    .set(body)
    .where(eq(serviceInquiries.id, id))
    .returning()

  return Response.json(row)
}

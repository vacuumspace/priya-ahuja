import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { serviceInquiries } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const rows = await db
    .select()
    .from(serviceInquiries)
    .orderBy(desc(serviceInquiries.createdAt))

  return Response.json(rows)
}

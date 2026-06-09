import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { services } from "@/lib/db/schema"
import { asc } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const rows = await db.select().from(services).orderBy(asc(services.order))
  return Response.json(rows)
}

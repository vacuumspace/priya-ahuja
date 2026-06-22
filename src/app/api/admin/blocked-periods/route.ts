import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { blockedPeriods } from "@/lib/db/schema"
import { asc } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) return new Response("Forbidden", { status: 403 })
  const rows = await db.select().from(blockedPeriods).orderBy(asc(blockedPeriods.startDate))
  return Response.json(rows)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) return new Response("Forbidden", { status: 403 })
  const { startDate, endDate, reason } = await request.json()
  const [row] = await db.insert(blockedPeriods).values({ startDate, endDate, reason: reason || null }).returning()
  return Response.json(row)
}

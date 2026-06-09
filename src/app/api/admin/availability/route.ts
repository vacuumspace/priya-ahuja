import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { availability, services } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"

export async function GET(request: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const serviceId = searchParams.get("serviceId")

  if (!serviceId) return new Response("Missing serviceId", { status: 400 })

  const rows = await db
    .select()
    .from(availability)
    .where(eq(availability.serviceId, serviceId))
    .orderBy(asc(availability.date), asc(availability.startTime))

  return Response.json(rows)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const body = await request.json()
  const { serviceId, date, startTime, endTime } = body

  if (!serviceId || !date || !startTime || !endTime) {
    return new Response("Missing required fields", { status: 400 })
  }

  const [row] = await db
    .insert(availability)
    .values({ serviceId, date, startTime, endTime, isBooked: false })
    .returning()

  return Response.json(row, { status: 201 })
}

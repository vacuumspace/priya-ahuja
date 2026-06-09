import { db } from "@/lib/db"
import { availability, services } from "@/lib/db/schema"
import { eq, and, gte } from "drizzle-orm"
import { asc } from "drizzle-orm"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const [service] = await db
    .select({ id: services.id })
    .from(services)
    .where(eq(services.slug, slug))
    .limit(1)

  if (!service) return new Response("Not found", { status: 404 })

  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  const slots = await db
    .select()
    .from(availability)
    .where(
      and(
        eq(availability.serviceId, service.id),
        eq(availability.isBooked, false),
        gte(availability.date, today)
      )
    )
    .orderBy(asc(availability.date), asc(availability.startTime))

  return Response.json(slots)
}

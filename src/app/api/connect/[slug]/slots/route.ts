import { db } from "@/lib/db"
import { availability, services, availabilitySchedule, availabilityConfig, bookings } from "@/lib/db/schema"
import { eq, and, gte } from "drizzle-orm"

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number)
  const total = h * 60 + m + minutes
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.slug, slug))
    .limit(1)

  if (!service) return new Response("Not found", { status: 404 })

  const slotDuration = service.durationMin ?? 30

  // Load schedule and config
  const scheduleRows = await db.select().from(availabilitySchedule).orderBy(availabilitySchedule.dayOfWeek)
  const [config] = await db.select().from(availabilityConfig).limit(1)
  const daysAhead = config?.daysAhead ?? 14

  // Load already-booked slots for this service (date+startTime pairs)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const bookedSlots = await db
    .select({ date: availability.date, startTime: availability.startTime })
    .from(availability)
    .innerJoin(bookings, eq(bookings.slotId, availability.id))
    .where(
      and(
        eq(availability.serviceId, service.id),
        gte(availability.date, today.toISOString().slice(0, 10))
      )
    )

  const bookedSet = new Set(bookedSlots.map((s) => `${s.date}T${s.startTime}`))

  // Generate slots for the next daysAhead days
  const result: { id: string; date: string; startTime: string; endTime: string }[] = []

  for (let i = 1; i <= daysAhead; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dayOfWeek = d.getDay()
    const dateStr = d.toISOString().slice(0, 10)

    const daySchedule = scheduleRows.find((s) => s.dayOfWeek === dayOfWeek)
    if (!daySchedule || !daySchedule.isActive) continue

    let current = daySchedule.startTime
    const endMins = toMinutes(daySchedule.endTime)

    while (toMinutes(current) + slotDuration <= endMins) {
      const endTime = addMinutes(current, slotDuration)
      const key = `${dateStr}T${current}`
      if (!bookedSet.has(key)) {
        result.push({ id: key, date: dateStr, startTime: current, endTime })
      }
      current = endTime
    }
  }

  return Response.json(result)
}

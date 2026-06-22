import { db } from "@/lib/db"
import { availability, services, availabilitySchedule, availabilityConfig, blockedPeriods } from "@/lib/db/schema"
import { eq, and, gte } from "drizzle-orm"
import { getCalendarBusySlots } from "@/lib/google-calendar"

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

  const [scheduleRows, config, blocked] = await Promise.all([
    db.select().from(availabilitySchedule).orderBy(availabilitySchedule.dayOfWeek),
    db.select().from(availabilityConfig).limit(1),
    db.select().from(blockedPeriods),
  ])

  const daysAhead = config[0]?.daysAhead ?? 14

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  const windowEnd = new Date(today)
  windowEnd.setDate(windowEnd.getDate() + daysAhead + 1)
  const windowEndStr = windowEnd.toISOString().slice(0, 10)

  // Load platform bookings + Google Calendar busy windows in parallel
  const [bookedSlots, gcalBusy] = await Promise.all([
    db
      .select({ date: availability.date, startTime: availability.startTime, endTime: availability.endTime })
      .from(availability)
      .where(and(eq(availability.isBooked, true), gte(availability.date, todayStr))),
    getCalendarBusySlots(todayStr, windowEndStr).catch(() => []), // degrade gracefully if GCal is unreachable
  ])

  // Index booked slots by date for fast overlap checks
  const bookedByDate = new Map<string, { startMin: number; endMin: number }[]>()
  for (const s of bookedSlots) {
    if (!bookedByDate.has(s.date)) bookedByDate.set(s.date, [])
    bookedByDate.get(s.date)!.push({ startMin: toMinutes(s.startTime), endMin: toMinutes(s.endTime) })
  }
  // Merge Google Calendar busy windows into the same index
  for (const b of gcalBusy) {
    if (!bookedByDate.has(b.date)) bookedByDate.set(b.date, [])
    bookedByDate.get(b.date)!.push({ startMin: b.startMin, endMin: b.endMin })
  }

  // Build blocked date set (inclusive range)
  const blockedDates = new Set<string>()
  for (const p of blocked) {
    const start = new Date(p.startDate + "T00:00:00")
    const end = new Date(p.endDate + "T00:00:00")
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      blockedDates.add(d.toISOString().slice(0, 10))
    }
  }

  const result: { id: string; date: string; startTime: string; endTime: string }[] = []

  for (let i = 1; i <= daysAhead; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dayOfWeek = d.getDay()
    const dateStr = d.toISOString().slice(0, 10)

    if (blockedDates.has(dateStr)) continue

    const daySchedules = scheduleRows.filter((s) => s.dayOfWeek === dayOfWeek && s.isActive)
    if (daySchedules.length === 0) continue

    const dayBooked = bookedByDate.get(dateStr) ?? []

    for (const daySchedule of daySchedules) {
      let current = daySchedule.startTime
      const endMins = toMinutes(daySchedule.endTime)

      while (toMinutes(current) + slotDuration <= endMins) {
        const endTime = addMinutes(current, slotDuration)
        const slotStart = toMinutes(current)
        const slotEnd = toMinutes(endTime)

        // Check overlap with any booked slot on this date
        const overlaps = dayBooked.some(
          (b) => slotStart < b.endMin && slotEnd > b.startMin
        )

        if (!overlaps) {
          result.push({ id: `${dateStr}T${current}`, date: dateStr, startTime: current, endTime })
        }
        current = endTime
      }
    }
  }

  return Response.json(result)
}

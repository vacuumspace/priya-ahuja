import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { availabilitySchedule, availabilityConfig } from "@/lib/db/schema"
import { eq, inArray } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const [config] = await db.select().from(availabilityConfig).limit(1)
  const schedule = await db.select().from(availabilitySchedule).orderBy(availabilitySchedule.dayOfWeek)

  return Response.json({ daysAhead: config?.daysAhead ?? 14, minDaysOffset: config?.minDaysOffset ?? 0, schedule })
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { daysAhead, minDaysOffset, schedule, deletedIds } = await request.json()

  // Update config
  const [existing] = await db.select({ id: availabilityConfig.id }).from(availabilityConfig).limit(1)
  if (existing) {
    await db.update(availabilityConfig).set({ daysAhead, minDaysOffset: minDaysOffset ?? 0 }).where(eq(availabilityConfig.id, existing.id))
  } else {
    await db.insert(availabilityConfig).values({ daysAhead, minDaysOffset: minDaysOffset ?? 0 })
  }

  // Delete removed rows
  if (deletedIds?.length) {
    await db.delete(availabilitySchedule).where(inArray(availabilitySchedule.id, deletedIds))
  }

  // Upsert each day row
  for (const day of schedule as { id: string; isNew?: boolean; dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[]) {
    if (day.isNew) {
      await db.insert(availabilitySchedule).values({
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
        isActive: day.isActive,
      })
    } else {
      await db
        .update(availabilitySchedule)
        .set({ startTime: day.startTime, endTime: day.endTime, isActive: day.isActive })
        .where(eq(availabilitySchedule.id, day.id))
    }
  }

  return Response.json({ ok: true })
}

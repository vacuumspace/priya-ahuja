import { db } from "@/lib/db"
import { priyaGptSessions } from "@/lib/db/schema"
import { isNotNull, sql } from "drizzle-orm"

const BASE_COUNT = 227
const START_DATE = new Date("2026-07-03T00:00:00Z")

// deterministic 2-or-3 "daily growth" per calendar day so the number doesn't jump around on refresh
function dailyIncrement(dateKey: string): number {
  let hash = 0
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) | 0
  }
  return 2 + (Math.abs(hash) % 2) // 2 or 3
}

function daysSinceStart(): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.max(0, Math.floor((Date.now() - START_DATE.getTime()) / msPerDay))
}

export async function GET() {
  const days = daysSinceStart()
  let syntheticGrowth = 0
  for (let i = 1; i <= days; i++) {
    const d = new Date(START_DATE.getTime() + i * 24 * 60 * 60 * 1000)
    syntheticGrowth += dailyIncrement(d.toISOString().slice(0, 10))
  }

  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(priyaGptSessions)
    .where(isNotNull(priyaGptSessions.rating))

  const realRatings = Number(row?.count ?? 0)

  return Response.json({ count: BASE_COUNT + syntheticGrowth + realRatings })
}

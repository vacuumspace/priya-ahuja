import { db } from "@/lib/db"
import { siteSettings, startupScores } from "@/lib/db/schema"
import { eq, count, sql } from "drizzle-orm"
import ToolsAdminClient from "./ToolsAdminClient"

export default async function AdminToolsPage() {
  const [settingsRows, totalRows, paidRows, recentRows] = await Promise.all([
    db.select().from(siteSettings),

    db.select({ count: count() }).from(startupScores),

    db
      .select({ count: count() })
      .from(startupScores)
      .where(eq(startupScores.isPaid, true)),

    db
      .select({
        date: sql<string>`DATE(created_at)`.as("date"),
        submissions: count(),
      })
      .from(startupScores)
      .groupBy(sql`DATE(created_at)`)
      .orderBy(sql`DATE(created_at) DESC`)
      .limit(7),
  ])

  const settings: Record<string, string> = {}
  for (const row of settingsRows) settings[row.key] = row.value

  const total = Number(totalRows[0].count)
  const paid = Number(paidRows[0].count)
  const revenue = paid * 99

  return (
    <ToolsAdminClient
      initialSettings={settings}
      analytics={{ total, paid, revenue, recentDays: recentRows }}
    />
  )
}

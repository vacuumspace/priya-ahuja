import { db } from "@/lib/db"
import { dailyWinEntries, userProfiles } from "@/lib/db/schema"
import { and, eq, lte, or, isNull, sql } from "drizzle-orm"

export type WallRow = { points: string[]; name: string | null }

// Shared by the /journal "today on the wall" preview and the full /journal/wall
// page - a public entry needs the journal-level toggle on, to have passed
// moderation (see the moderationFlagged comment in schema.ts), and - for a
// pre-loaded synthetic entry - to have reached its scheduledAt instant. Real
// entries have scheduledAt = null, so they're always immediately visible.
// Ordered by whichever of scheduledAt/createdAt made it visible, so real and
// synthetic entries interleave as if everyone posted through the same day.
export function getWallEntries(date: string): Promise<WallRow[]> {
  return db
    .select({ points: dailyWinEntries.points, name: userProfiles.journalDisplayName })
    .from(dailyWinEntries)
    .innerJoin(userProfiles, eq(userProfiles.userId, dailyWinEntries.userId))
    .where(and(
      eq(dailyWinEntries.entryDate, date),
      eq(userProfiles.journalVisibility, "public"),
      eq(dailyWinEntries.moderationFlagged, false),
      or(isNull(dailyWinEntries.scheduledAt), lte(dailyWinEntries.scheduledAt, new Date())),
    ))
    .orderBy(sql`coalesce(${dailyWinEntries.scheduledAt}, ${dailyWinEntries.createdAt})`)
}

export function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?"
}

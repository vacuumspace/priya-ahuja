import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { dailyWinEntries } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { isFillable, MAX_POINTS_PER_ENTRY, MAX_POINT_LENGTH } from "@/lib/daily-win-journal"
import { classifyMessage } from "@/lib/moderation"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const date: string = body.date

  if (!isFillable(date)) {
    return NextResponse.json({ error: "That date isn't part of the challenge, or is in the future." }, { status: 400 })
  }

  const points: string[] = Array.isArray(body.points)
    ? body.points.map((p: unknown) => (typeof p === "string" ? p.trim() : "")).filter(Boolean)
    : []

  if (points.length === 0 || points.length > MAX_POINTS_PER_ENTRY) {
    return NextResponse.json({ error: `Add 1-${MAX_POINTS_PER_ENTRY} wins.` }, { status: 400 })
  }
  if (points.some((p) => p.length > MAX_POINT_LENGTH)) {
    return NextResponse.json({ error: `Each win must be ${MAX_POINT_LENGTH} characters or less.` }, { status: 400 })
  }

  // Always checked, independent of the journal's current public/private
  // setting - see the moderationFlagged comment in schema.ts.
  const { flagged } = await classifyMessage(points.join(" / "))

  const [saved] = await db
    .insert(dailyWinEntries)
    .values({ userId: session.user.id, entryDate: date, points, moderationFlagged: flagged, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [dailyWinEntries.userId, dailyWinEntries.entryDate],
      set: { points, moderationFlagged: flagged, updatedAt: new Date() },
    })
    .returning()

  return NextResponse.json({ entry: saved })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")
  if (!date) return NextResponse.json({ error: "Missing date" }, { status: 400 })

  await db.delete(dailyWinEntries).where(and(eq(dailyWinEntries.userId, session.user.id), eq(dailyWinEntries.entryDate, date)))
  return NextResponse.json({ ok: true })
}

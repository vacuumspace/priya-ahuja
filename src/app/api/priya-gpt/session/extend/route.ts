import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions } from "@/lib/db/schema"
import { eq, and, gt, or, isNotNull, desc } from "drizzle-orm"
import { spendMinutes, InsufficientTimeError } from "@/lib/priya-gpt-time"

// POST: add freshly bought minutes onto the caller's currently running (or paused) session
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { minutes } = (await req.json()) as { minutes: number }
  if (!minutes || minutes <= 0) {
    return NextResponse.json({ error: "Invalid minutes" }, { status: 400 })
  }

  const [active] = await db
    .select()
    .from(priyaGptSessions)
    .where(
      and(
        eq(priyaGptSessions.userId, session.user.id),
        or(gt(priyaGptSessions.expiresAt, new Date()), isNotNull(priyaGptSessions.pausedAt))
      )
    )
    .orderBy(desc(priyaGptSessions.createdAt))
    .limit(1)

  if (!active) {
    return NextResponse.json({ error: "No active session to extend" }, { status: 404 })
  }

  try {
    await spendMinutes(session.user.id, minutes, "session_extend")
  } catch (err) {
    if (err instanceof InsufficientTimeError) {
      return NextResponse.json({ error: "Not enough time balance" }, { status: 402 })
    }
    console.error("priya-gpt session extend error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }

  const newExpiresAt = new Date(active.expiresAt.getTime() + minutes * 60 * 1000)
  const [updated] = await db
    .update(priyaGptSessions)
    .set({ expiresAt: newExpiresAt })
    .where(eq(priyaGptSessions.id, active.id))
    .returning()

  return NextResponse.json({ session: updated })
}

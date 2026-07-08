import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { spendMinutes, InsufficientTimeError } from "@/lib/priya-gpt-time"

// POST: add freshly bought minutes onto the caller's one chat thread - whether it's
// currently running, paused, or already timed out. There's only ever one thread per user,
// so buying more time always continues the same conversation instead of starting a new one.
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { minutes } = (await req.json()) as { minutes: number }
  if (!minutes || minutes <= 0) {
    return NextResponse.json({ error: "Invalid minutes" }, { status: 400 })
  }

  const [existing] = await db
    .select()
    .from(priyaGptSessions)
    .where(eq(priyaGptSessions.userId, session.user.id))
    .limit(1)

  try {
    await spendMinutes(session.user.id, minutes, "session_extend")
  } catch (err) {
    if (err instanceof InsufficientTimeError) {
      return NextResponse.json({ error: "Not enough time balance" }, { status: 402 })
    }
    console.error("priya-gpt session extend error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }

  // if the thread already timed out, restart the window from now rather than tacking
  // minutes onto a long-past expiry; otherwise extend the still-running countdown
  const alreadyExpired = !existing || (existing.expiresAt.getTime() <= Date.now() && !existing.pausedAt)
  const newExpiresAt = alreadyExpired
    ? new Date(Date.now() + minutes * 60 * 1000)
    : new Date(existing.expiresAt.getTime() + minutes * 60 * 1000)

  const [result] = existing
    ? await db
        .update(priyaGptSessions)
        .set({ expiresAt: newExpiresAt, pausedAt: null })
        .where(eq(priyaGptSessions.userId, session.user.id))
        .returning()
    : await db.insert(priyaGptSessions).values({ userId: session.user.id, expiresAt: newExpiresAt }).returning()

  return NextResponse.json({ session: result })
}

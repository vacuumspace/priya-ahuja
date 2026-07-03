import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions } from "@/lib/db/schema"
import { eq, and, gt, or, isNotNull, desc } from "drizzle-orm"
import { spendMinutes, getMinutesBalance, InsufficientTimeError } from "@/lib/priya-gpt-time"
import { getTimePackages } from "@/lib/priya-gpt-packages"

// a session is "alive" if it hasn't expired yet, or it's currently paused (frozen, doesn't expire while paused)
function aliveCondition(userId: string) {
  return and(eq(priyaGptSessions.userId, userId), or(gt(priyaGptSessions.expiresAt, new Date()), isNotNull(priyaGptSessions.pausedAt)))
}

// GET: return the caller's current active session, if any, plus purchasable time packages and balance
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [active] = await db
    .select()
    .from(priyaGptSessions)
    .where(aliveCondition(session.user.id))
    .orderBy(desc(priyaGptSessions.createdAt))
    .limit(1)

  const [packages, minutesBalance] = await Promise.all([
    getTimePackages(),
    getMinutesBalance(session.user.id),
  ])

  return NextResponse.json({ session: active ?? null, packages, minutesBalance })
}

// POST: start a new session, spending the caller's entire banked time balance (unless admin)
export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [existing] = await db
    .select()
    .from(priyaGptSessions)
    .where(aliveCondition(session.user.id))
    .limit(1)
  if (existing) {
    return NextResponse.json({ session: existing })
  }

  let sessionMinutes: number

  const balance = await getMinutesBalance(session.user.id)
  if (balance <= 0) {
    return NextResponse.json({ error: "Not enough time balance", needsPurchase: true }, { status: 402 })
  }
  try {
    await spendMinutes(session.user.id, balance, "session_start")
    sessionMinutes = balance
  } catch (err) {
    if (err instanceof InsufficientTimeError) {
      return NextResponse.json({ error: "Not enough time balance", needsPurchase: true }, { status: 402 })
    }
    console.error("priya-gpt spendMinutes error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }

  const expiresAt = new Date(Date.now() + sessionMinutes * 60 * 1000)
  const [created] = await db.insert(priyaGptSessions).values({ userId: session.user.id, expiresAt }).returning()

  return NextResponse.json({ session: created })
}

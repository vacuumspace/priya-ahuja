import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { spendMinutes, getMinutesBalance, InsufficientTimeError } from "@/lib/priya-gpt-time"
import { getTimePackages } from "@/lib/priya-gpt-packages"

// there's exactly one continuous chat thread per user - no separate "sessions" to start or
// end. expiresAt/pausedAt just track the metered time window on that one thread.
function isActive(row: { expiresAt: Date; pausedAt: Date | null }) {
  return Boolean(row.pausedAt) || row.expiresAt.getTime() > Date.now()
}

// GET: return the caller's chat thread (if it's ever been created), whether its timer is
// currently active, plus purchasable time packages and balance
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [row] = await db
    .select()
    .from(priyaGptSessions)
    .where(eq(priyaGptSessions.userId, session.user.id))
    .limit(1)

  const [packages, minutesBalance, [user]] = await Promise.all([
    getTimePackages(),
    getMinutesBalance(session.user.id),
    db.select({ priyaGptBlocked: users.priyaGptBlocked }).from(users).where(eq(users.id, session.user.id)).limit(1),
  ])

  return NextResponse.json({
    session: row ?? null,
    active: row ? isActive(row) : false,
    packages,
    minutesBalance,
    blocked: user?.priyaGptBlocked ?? false,
  })
}

// POST: (re)activate the timer on the caller's one chat thread, spending their entire
// banked time balance. If the thread is already active (running or paused), this is a
// no-op that just returns it as-is.
export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [existing] = await db
    .select()
    .from(priyaGptSessions)
    .where(eq(priyaGptSessions.userId, session.user.id))
    .limit(1)

  if (existing && isActive(existing)) {
    return NextResponse.json({ session: existing })
  }

  const balance = await getMinutesBalance(session.user.id)
  if (balance <= 0) {
    return NextResponse.json({ error: "Not enough time balance", needsPurchase: true }, { status: 402 })
  }
  try {
    await spendMinutes(session.user.id, balance, "session_start")
  } catch (err) {
    if (err instanceof InsufficientTimeError) {
      return NextResponse.json({ error: "Not enough time balance", needsPurchase: true }, { status: 402 })
    }
    console.error("priya-gpt spendMinutes error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }

  const expiresAt = new Date(Date.now() + balance * 60 * 1000)

  const [result] = existing
    ? await db
        .update(priyaGptSessions)
        .set({ expiresAt, pausedAt: null })
        .where(eq(priyaGptSessions.userId, session.user.id))
        .returning()
    : await db.insert(priyaGptSessions).values({ userId: session.user.id, expiresAt }).returning()

  return NextResponse.json({ session: result })
}

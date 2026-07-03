import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions } from "@/lib/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [paused] = await db
    .select()
    .from(priyaGptSessions)
    .where(and(eq(priyaGptSessions.userId, session.user.id), isNotNull(priyaGptSessions.pausedAt)))
    .limit(1)

  if (!paused || !paused.pausedAt) {
    return NextResponse.json({ error: "No paused session to resume" }, { status: 404 })
  }

  const pauseDurationMs = Date.now() - paused.pausedAt.getTime()
  const newExpiresAt = new Date(paused.expiresAt.getTime() + pauseDurationMs)

  const [updated] = await db
    .update(priyaGptSessions)
    .set({ pausedAt: null, expiresAt: newExpiresAt })
    .where(eq(priyaGptSessions.id, paused.id))
    .returning()

  return NextResponse.json({ session: updated })
}

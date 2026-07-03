import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions } from "@/lib/db/schema"
import { eq, and, gt, isNull } from "drizzle-orm"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [updated] = await db
    .update(priyaGptSessions)
    .set({ pausedAt: new Date() })
    .where(
      and(
        eq(priyaGptSessions.userId, session.user.id),
        gt(priyaGptSessions.expiresAt, new Date()),
        isNull(priyaGptSessions.pausedAt)
      )
    )
    .returning()

  if (!updated) {
    return NextResponse.json({ error: "No active session to pause" }, { status: 404 })
  }

  return NextResponse.json({ session: updated })
}

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { sessionId, rating, feedback } = body as { sessionId: string; rating: number; feedback?: string }
  if (!sessionId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 })
  }

  const [updated] = await db
    .update(priyaGptSessions)
    .set({ rating, ratingFeedback: feedback?.trim() || null })
    .where(and(eq(priyaGptSessions.id, sessionId), eq(priyaGptSessions.userId, session.user.id)))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}

import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions, priyaGptMessages } from "@/lib/db/schema"
import { eq, asc, inArray } from "drizzle-orm"

export async function GET(req: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")
  const userId = searchParams.get("userId")

  if (sessionId) {
    const [gptSession] = await db
      .select()
      .from(priyaGptSessions)
      .where(eq(priyaGptSessions.id, sessionId))
      .limit(1)
    if (!gptSession) return new Response("Not found", { status: 404 })

    const messages = await db
      .select()
      .from(priyaGptMessages)
      .where(eq(priyaGptMessages.sessionId, sessionId))
      .orderBy(asc(priyaGptMessages.createdAt))

    return Response.json({ sessions: [{ ...gptSession, messages }] })
  }

  if (!userId) return new Response("Missing sessionId or userId", { status: 400 })

  const sessions = await db
    .select()
    .from(priyaGptSessions)
    .where(eq(priyaGptSessions.userId, userId))
    .orderBy(asc(priyaGptSessions.startedAt))

  const sessionIds = sessions.map((s) => s.id)
  const messages = sessionIds.length
    ? await db
        .select()
        .from(priyaGptMessages)
        .where(inArray(priyaGptMessages.sessionId, sessionIds))
        .orderBy(asc(priyaGptMessages.createdAt))
    : []

  const bySession = sessions.map((s) => ({
    ...s,
    messages: messages.filter((m) => m.sessionId === s.id),
  }))

  return Response.json({ sessions: bySession })
}

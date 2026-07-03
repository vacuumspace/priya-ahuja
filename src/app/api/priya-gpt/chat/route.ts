import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions, priyaGptMessages } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"
import { sendChatMessage, type ChatMessage } from "@/lib/gemini"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")
  if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })

  const [gptSession] = await db
    .select()
    .from(priyaGptSessions)
    .where(and(eq(priyaGptSessions.id, sessionId), eq(priyaGptSessions.userId, session.user.id)))
    .limit(1)
  if (!gptSession) return NextResponse.json({ error: "Session not found" }, { status: 404 })

  const messages = await db
    .select()
    .from(priyaGptMessages)
    .where(eq(priyaGptMessages.sessionId, sessionId))
    .orderBy(asc(priyaGptMessages.createdAt))

  return NextResponse.json({ messages })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { sessionId, message } = body as { sessionId: string; message: string }
  if (!sessionId || !message?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const [gptSession] = await db
    .select()
    .from(priyaGptSessions)
    .where(and(eq(priyaGptSessions.id, sessionId), eq(priyaGptSessions.userId, session.user.id)))
    .limit(1)
  if (!gptSession) return NextResponse.json({ error: "Session not found" }, { status: 404 })

  if (gptSession.pausedAt) {
    return NextResponse.json({ error: "Session is paused. Resume it to keep chatting.", paused: true }, { status: 409 })
  }

  if (gptSession.expiresAt < new Date()) {
    return NextResponse.json({ error: "Session expired", expired: true }, { status: 410 })
  }

  const history = await db
    .select()
    .from(priyaGptMessages)
    .where(eq(priyaGptMessages.sessionId, sessionId))
    .orderBy(asc(priyaGptMessages.createdAt))

  const chatHistory: ChatMessage[] = history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))

  await db.insert(priyaGptMessages).values({ sessionId, role: "user", content: message })

  try {
    const reply = await sendChatMessage(chatHistory, message)
    const [saved] = await db.insert(priyaGptMessages).values({ sessionId, role: "assistant", content: reply }).returning()
    return NextResponse.json({ message: saved })
  } catch (err) {
    console.error("priya-gpt chat error:", err)
    return NextResponse.json({ error: "Chat failed. Please try again." }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions, priyaGptMessages, users } from "@/lib/db/schema"
import { eq, and, asc, desc, lt } from "drizzle-orm"
import { sendChatMessage, type ChatMessage } from "@/lib/gemini"
import { classifyMessage } from "@/lib/moderation"

const PAGE_SIZE = 20
const CONTACT_EMAIL = "hi@priyaahuja.in"

function requestIp(req: NextRequest): string | null {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")
  if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
  const before = searchParams.get("before") // ISO createdAt cursor; loads the page just older than this

  const [gptSession] = await db
    .select()
    .from(priyaGptSessions)
    .where(and(eq(priyaGptSessions.id, sessionId), eq(priyaGptSessions.userId, session.user.id)))
    .limit(1)
  if (!gptSession) return NextResponse.json({ error: "Session not found" }, { status: 404 })

  // fetch newest-first so LIMIT gets the latest page, then reverse to chronological order for display
  const page = await db
    .select()
    .from(priyaGptMessages)
    .where(
      before
        ? and(eq(priyaGptMessages.sessionId, sessionId), lt(priyaGptMessages.createdAt, new Date(before)))
        : eq(priyaGptMessages.sessionId, sessionId)
    )
    .orderBy(desc(priyaGptMessages.createdAt))
    .limit(PAGE_SIZE + 1)

  const hasMore = page.length > PAGE_SIZE
  const messages = page.slice(0, PAGE_SIZE).reverse()

  return NextResponse.json({ messages, hasMore })
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

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)
  if (user?.priyaGptBlocked) {
    return NextResponse.json({ error: "blocked", contactEmail: CONTACT_EMAIL }, { status: 403 })
  }

  const ip = requestIp(req)
  if (ip) {
    await db.update(users).set({ lastSeenIp: ip }).where(eq(users.id, session.user.id))
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

  const moderation = await classifyMessage(message)
  if (moderation.flagged) {
    await db
      .update(users)
      .set({ priyaGptBlocked: true, priyaGptBlockedReason: moderation.reason, priyaGptBlockedAt: new Date(), priyaGptBlockedBy: "auto" })
      .where(eq(users.id, session.user.id))
    return NextResponse.json({ error: "blocked", contactEmail: CONTACT_EMAIL }, { status: 403 })
  }

  try {
    const reply = await sendChatMessage(chatHistory, message)
    const [saved] = await db.insert(priyaGptMessages).values({ sessionId, role: "assistant", content: reply }).returning()
    return NextResponse.json({ message: saved })
  } catch (err) {
    console.error("priya-gpt chat error:", err)
    return NextResponse.json({ error: "Chat failed. Please try again." }, { status: 500 })
  }
}

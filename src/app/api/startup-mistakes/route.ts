import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupMistakes } from "@/lib/db/schema"
import { MISTAKE_INDUSTRIES, MISTAKE_TOPICS, MISTAKE_TITLE_MAX_LEN, MISTAKE_BODY_MAX_LEN } from "@/lib/startup-mistakes-data"
import { desc, eq } from "drizzle-orm"

export async function GET() {
  const rows = await db
    .select()
    .from(startupMistakes)
    .where(eq(startupMistakes.status, "published"))
    .orderBy(desc(startupMistakes.publishedAt))

  return Response.json(rows)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const { title, body: mistakeBody, industry, topic } = body

  if (typeof title !== "string" || !title.trim() || title.length > MISTAKE_TITLE_MAX_LEN) {
    return new Response("Invalid title", { status: 400 })
  }
  if (typeof mistakeBody !== "string" || !mistakeBody.trim() || mistakeBody.length > MISTAKE_BODY_MAX_LEN) {
    return new Response("Invalid body", { status: 400 })
  }
  if (!MISTAKE_INDUSTRIES.includes(industry)) {
    return new Response("Invalid industry", { status: 400 })
  }
  if (!MISTAKE_TOPICS.includes(topic)) {
    return new Response("Invalid topic", { status: 400 })
  }

  const [row] = await db
    .insert(startupMistakes)
    .values({
      userId: session.user.id,
      userName: session.user.name ?? "Anonymous Founder",
      title: title.trim(),
      body: mistakeBody.trim(),
      industry,
      topic,
    })
    .returning()

  return Response.json(row)
}

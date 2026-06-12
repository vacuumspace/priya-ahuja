import { db } from "@/lib/db"
import { customRequests } from "@/lib/db/schema"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, message, source } = body

  if (!name || !email || !message) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  const [row] = await db
    .insert(customRequests)
    .values({ name, email, message, source: source || null })
    .returning()

  return Response.json(row, { status: 201 })
}

import { db } from "@/lib/db"
import { serviceInquiries } from "@/lib/db/schema"

export async function POST(req: Request) {
  const body = await req.json()
  const { type, name, email, phone, budget, projectDescription } = body

  if (!type || !name || !email || !projectDescription) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  const [row] = await db
    .insert(serviceInquiries)
    .values({ type, name, email, phone: phone || null, budget: budget || null, projectDescription })
    .returning()

  return Response.json(row, { status: 201 })
}

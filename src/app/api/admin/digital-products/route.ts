import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { digitalProducts } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const rows = await db.select().from(digitalProducts).orderBy(desc(digitalProducts.createdAt))
  return Response.json(rows)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const body = await request.json()
  const { slug, title, shortDescription, description, price, tag, fileUrl } = body

  if (!slug || !title || !description || !price) {
    return new Response("Missing required fields", { status: 400 })
  }

  const [row] = await db
    .insert(digitalProducts)
    .values({
      slug,
      title,
      shortDescription: shortDescription || null,
      description,
      tag: tag || "template",
      price: Math.round(price * 100),
      fileUrl: fileUrl || null,
      isActive: false,
    })
    .returning()

  return Response.json(row, { status: 201 })
}

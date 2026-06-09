import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { services } from "@/lib/db/schema"
import { asc, max } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const rows = await db.select().from(services).orderBy(asc(services.order))
  return Response.json(rows)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const body = await request.json()
  const {
    slug, title, shortDescription, description, price, originalPrice,
    durationMin, type, tag, highlights, whoIsItFor,
    acceptsDeckLink, deckLinkLabel, deckLinkPlaceholder, urgencyNote,
  } = body

  if (!slug || !title || !description || !price || !type) {
    return new Response("Missing required fields", { status: 400 })
  }

  const [{ maxOrder }] = await db.select({ maxOrder: max(services.order) }).from(services)
  const nextOrder = (maxOrder ?? 0) + 1

  const [row] = await db
    .insert(services)
    .values({
      slug,
      title,
      shortDescription: shortDescription || null,
      description,
      price: Math.round(price * 100),
      originalPrice: originalPrice ? Math.round(originalPrice * 100) : null,
      durationMin: durationMin || null,
      type,
      tag: tag || "general",
      highlights: highlights || [],
      whoIsItFor: whoIsItFor || null,
      acceptsDeckLink: acceptsDeckLink ?? false,
      deckLinkLabel: deckLinkLabel || null,
      deckLinkPlaceholder: deckLinkPlaceholder || null,
      urgencyNote: urgencyNote || null,
      isActive: false,
      order: nextOrder,
    })
    .returning()

  return Response.json(row, { status: 201 })
}

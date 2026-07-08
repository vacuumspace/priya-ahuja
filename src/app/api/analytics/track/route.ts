import { db } from "@/lib/db"
import { analyticsEvents } from "@/lib/db/schema"

export async function POST(req: Request) {
  try {
    const { type, page, ctaId, sessionId } = await req.json()
    if (!type || !["pageview", "cta_click"].includes(type)) {
      return new Response("Bad Request", { status: 400 })
    }
    await db.insert(analyticsEvents).values({
      type,
      page: page ?? null,
      ctaId: ctaId ?? null,
      sessionId: sessionId ?? null,
    })
    return new Response(null, { status: 204 })
  } catch {
    // Silently swallow - analytics must never break the page
    return new Response(null, { status: 204 })
  }
}

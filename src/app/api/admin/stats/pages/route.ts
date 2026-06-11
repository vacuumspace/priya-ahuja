import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { analyticsEvents } from "@/lib/db/schema"
import { eq, count } from "drizzle-orm"

const PAGE_SIZE = 10

// Pages that have a paid CTA and which ctaId to look up
const PAGE_CTA_MAP: Record<string, string> = {
  "/fundraise/angel-investors": "angel-investors-buy",
  "/tools/startup-score": "startup-score-unlock",
  "/services/accounting": "inquiry-accounting",
  "/services/incorporation": "inquiry-incorporation",
  "/services/tech": "inquiry-tech",
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))

  const [pageViews, ctaClicks] = await Promise.all([
    db
      .select({ page: analyticsEvents.page, views: count(analyticsEvents.id) })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.type, "pageview"))
      .groupBy(analyticsEvents.page),

    db
      .select({ ctaId: analyticsEvents.ctaId, clicks: count(analyticsEvents.id) })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.type, "cta_click"))
      .groupBy(analyticsEvents.ctaId),
  ])

  const ctaMap: Record<string, number> = {}
  for (const r of ctaClicks) {
    if (r.ctaId) ctaMap[r.ctaId] = Number(r.clicks)
  }

  const sorted = pageViews
    .filter((r) => r.page)
    .map((r) => {
      const ctaId = PAGE_CTA_MAP[r.page!]
      return {
        page: r.page!,
        views: Number(r.views),
        ctaId: ctaId ?? null,
        ctaClicks: ctaId ? (ctaMap[ctaId] ?? 0) : null,
      }
    })
    .sort((a, b) => b.views - a.views)

  const total = sorted.length
  const offset = (page - 1) * PAGE_SIZE
  const rows = sorted.slice(offset, offset + PAGE_SIZE)

  return Response.json({ rows, total, page, pageSize: PAGE_SIZE })
}

import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const rows = await db.select().from(siteSettings)
  const settings: Record<string, string> = {}
  for (const row of rows) settings[row.key] = row.value
  return Response.json(settings)
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const body = await req.json()
  for (const [key, value] of Object.entries(body)) {
    await db
      .insert(siteSettings)
      .values({ key, value: String(value) })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value: String(value) } })
  }
  return Response.json({ ok: true })
}

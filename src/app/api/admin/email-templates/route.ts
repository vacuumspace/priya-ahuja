import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"

const EMAIL_KEYS = [
  "email_confirmation_subject",
  "email_confirmation_intro",
  "email_confirmation_footer",
  "email_admin_subject",
  "email_admin_intro",
  "email_cancellation_subject",
  "email_cancellation_body",
  "email_cancellation_footer",
  "email_download_subject",
  "email_download_intro",
  "email_download_footer",
]

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const rows = await db.select().from(siteSettings).where(inArray(siteSettings.key, EMAIL_KEYS))
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return NextResponse.json(settings)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updates: Record<string, string> = await req.json()

  for (const [key, value] of Object.entries(updates)) {
    if (!EMAIL_KEYS.includes(key)) continue
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value } })
  }

  return NextResponse.json({ success: true })
}

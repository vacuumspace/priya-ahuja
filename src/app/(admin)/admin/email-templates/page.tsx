import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"
import EmailTemplatesClient from "./EmailTemplatesClient"

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

export default async function EmailTemplatesPage() {
  const rows = await db.select().from(siteSettings).where(inArray(siteSettings.key, EMAIL_KEYS))
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))

  return <EmailTemplatesClient initialSettings={settings} />
}

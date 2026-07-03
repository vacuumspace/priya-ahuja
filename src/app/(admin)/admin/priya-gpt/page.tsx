import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import PriyaGptAdminClient from "./PriyaGptAdminClient"

export default async function AdminPriyaGptPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const settingsRows = await db.select().from(siteSettings)
  const settings: Record<string, string> = {}
  for (const row of settingsRows) settings[row.key] = row.value

  return <PriyaGptAdminClient initialSettings={settings} defaultTab={tab} />
}

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export type TimePackage = { price: number; minutes: number } // price in paise

export const DEFAULT_TIME_PACKAGES: TimePackage[] = [
  { price: 9900, minutes: 30 },
  { price: 14900, minutes: 60 },
]

export async function getTimePackages(): Promise<TimePackage[]> {
  const [row] = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "priyagpt_time_packages"))
    .limit(1)

  if (!row) return DEFAULT_TIME_PACKAGES

  try {
    const parsed = JSON.parse(row.value)
    if (Array.isArray(parsed) && parsed.length > 0 && parsed.every((p) => typeof p.price === "number" && typeof p.minutes === "number")) {
      return parsed
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_TIME_PACKAGES
}

import { Metadata } from "next"
import { SidebarWithAuth } from "@/components/layout/SidebarWithAuth"
import { Footer } from "@/components/layout/Footer"
import HomePage from "@/components/HomePage"
import { db } from "@/lib/db"
import { workshops } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import type { PromoWorkshop } from "@/components/WorkshopPromoPopup"

export const metadata: Metadata = {
  title: "Priya Ahuja - Startup & Fundraise Consultant",
}

// Registration-cutoff is 2h before the workshop starts, computed from the
// workshop row itself (the one source of truth) rather than a separate
// hardcoded deadline that could drift from the actual start time.
const PROMO_CUTOFF_MS_BEFORE_START = 2 * 60 * 60 * 1000

export default async function RootPage() {
  const active = await db
    .select()
    .from(workshops)
    .where(eq(workshops.isActive, true))
    .orderBy(asc(workshops.date), asc(workshops.startTime))

  // "soonest" must be the next workshop that hasn't started yet - ordering by
  // date alone would surface a past workshop (e.g. a historical record seeded
  // with an earlier date) ahead of the actual upcoming one.
  const now = new Date()
  const soonest = active.find((w) => new Date(`${w.date}T${w.startTime}:00+05:30`) > now)

  let promoWorkshop: PromoWorkshop | null = null
  if (soonest) {
    const start = new Date(`${soonest.date}T${soonest.startTime}:00+05:30`)
    const cutoff = new Date(start.getTime() - PROMO_CUTOFF_MS_BEFORE_START)
    if (now < cutoff) {
      promoWorkshop = {
        slug: soonest.slug,
        title: soonest.title,
        date: soonest.date,
        startTime: soonest.startTime,
        endTime: soonest.endTime,
        price: soonest.price,
        thumbnailUrl: soonest.thumbnailUrl,
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <SidebarWithAuth />
      <main className="flex-1 md:ml-[240px] min-h-screen pt-[52px] md:pt-0 overflow-x-hidden flex flex-col">
        <div className="flex-1">
          <HomePage promoWorkshop={promoWorkshop} />
        </div>
        <Footer />
      </main>
    </div>
  )
}

import { db } from "@/lib/db"
import { workshops, workshopRegistrations } from "@/lib/db/schema"
import { desc, count, eq, sum } from "drizzle-orm"
import WorkshopsClient from "./WorkshopsClient"

type SearchParams = Promise<{ tab?: string }>

export default async function AdminWorkshopsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams

  const [allWorkshops, registrationCount, perWorkshopStats] = await Promise.all([
    db.select().from(workshops).orderBy(desc(workshops.createdAt)),
    db.select({ count: count() }).from(workshopRegistrations),
    // Registered + sales (actual amount captured, not the workshop's listed
    // price) per workshop, for the list tab's columns.
    db
      .select({
        workshopId: workshopRegistrations.workshopId,
        registered: count(),
        sales: sum(workshopRegistrations.amountPaid),
      })
      .from(workshopRegistrations)
      .where(eq(workshopRegistrations.status, "confirmed"))
      .groupBy(workshopRegistrations.workshopId),
  ])

  const statsByWorkshop = Object.fromEntries(
    perWorkshopStats.map((s) => [s.workshopId, { registered: s.registered, sales: Number(s.sales ?? 0) }])
  )

  const serializedWorkshops = allWorkshops.map((w) => ({
    ...w,
    createdAt: w.createdAt.toISOString(),
    registered: statsByWorkshop[w.id]?.registered ?? 0,
    sales: statsByWorkshop[w.id]?.sales ?? 0,
  }))

  return (
    <WorkshopsClient
      initialWorkshops={serializedWorkshops}
      registrationCount={registrationCount[0].count}
      defaultTab={params.tab}
    />
  )
}

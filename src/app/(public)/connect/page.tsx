import { db } from "@/lib/db"
import { services as servicesTable } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { type Service } from "@/lib/services-data"
import { ServicesClient } from "./ServicesClient"

async function getActiveServices(): Promise<Service[]> {
  const rows = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.isActive, true))
    .orderBy(asc(servicesTable.order))

  return rows.map((row) => ({
    ...row,
    type: row.type as Service["type"],
    highlights: row.highlights ?? [],
  }))
}

export default async function ServicesPage() {
  const activeServices = await getActiveServices()

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>connect with me</span>
        <span>{activeServices.length} offerings</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          how can i
          <br />
          help you?
        </h1>
        <p className="font-sans text-base text-ink/60 max-w-md leading-relaxed">
          each session is focused, practical, and tailored to where you are right now.
          no generic advice, just clear thinking based on real deal experience.
        </p>
      </div>

      <ServicesClient services={activeServices} />
    </div>
  )
}

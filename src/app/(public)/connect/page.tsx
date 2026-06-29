import type { Metadata } from "next"
import { db } from "@/lib/db"
import { services as servicesTable } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { type Service } from "@/lib/services-data"
import { ServicesClient } from "./ServicesClient"

export const metadata: Metadata = {
  title: "Book a 1-on-1 Session with Priya Ahuja",
  description: "Book a direct session with Priya Ahuja — fundability review, pitch prep, startup strategy, idea validation, or investor Q&A. Trusted by 200+ Indian founders. Limited slots.",
  keywords: ["book session Priya Ahuja", "fundraise consultant India", "pitch deck review India", "startup advisor session", "1-on-1 founder coaching India"],
  alternates: { canonical: "https://priyaahuja.in/connect" },
  openGraph: {
    title: "Book a 1-on-1 Session with Priya Ahuja",
    description: "Fundability review, pitch prep, startup strategy, or idea validation — direct 1-on-1 with Priya Ahuja. Trusted by 200+ Indian founders.",
    url: "https://priyaahuja.in/connect",
  },
}

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "1-on-1 Startup & Fundraise Sessions",
  "provider": {
    "@type": "Person",
    "name": "Priya Ahuja",
    "url": "https://priyaahuja.in",
  },
  "areaServed": { "@type": "Country", "name": "India" },
  "serviceType": "Startup Advisory",
  "description": "Direct 1-on-1 sessions with Priya Ahuja — fundability review, pitch prep, startup strategy, and idea validation for Indian founders.",
  "url": "https://priyaahuja.in/connect",
}

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
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

import type { Metadata } from "next"
import { db } from "@/lib/db"
import { services as servicesTable } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { type Service } from "@/lib/services-data"
import { ServicesClient } from "./ServicesClient"
import { ConsultancyCta } from "./ConsultancyCta"

export const metadata: Metadata = {
  title: "Book a 1-on-1 Session with Priya Ahuja",
  description: "Book a direct session with Priya Ahuja - fundability review, pitch prep, startup strategy, idea validation, or investor Q&A. Trusted by 200+ Indian founders. Limited slots.",
  keywords: ["book session Priya Ahuja", "fundraise consultant India", "pitch deck review India", "startup advisor session", "1-on-1 founder coaching India"],
  alternates: { canonical: "https://priyaahuja.in/connect" },
  openGraph: {
    title: "Book a 1-on-1 Session with Priya Ahuja",
    description: "Fundability review, pitch prep, startup strategy, or idea validation - direct 1-on-1 with Priya Ahuja. Trusted by 200+ Indian founders.",
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
  "description": "Direct 1-on-1 sessions with Priya Ahuja - fundability review, pitch prep, startup strategy, and idea validation for Indian founders.",
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

      <div className="px-4 md:px-10 pt-12 pb-8 flex items-start justify-between gap-10">
        <div>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
            how can i
            <br />
            help you?
          </h1>
          <p className="font-sans text-base text-ink/60 max-w-md leading-relaxed">
            each session is focused, practical, and tailored to where you are right now.
            no generic advice, just clear thinking based on real experience.
          </p>
          <p className="font-sans text-base text-ink/60 max-w-md leading-relaxed mt-4">
            1:1 call charges are to make sure only serious founders books the call, and that
            the time and advice shared is valued.
          </p>
        </div>

        <div className="hidden md:block w-[420px] shrink-0 overflow-hidden">
          <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
            <div className="flex animate-marquee gap-6 w-max">
              {[
                { value: "250+", label: "founders advised", sub: "across fintech, saas, consumer-tech & d2c" },
                { value: "₹200cr+", label: "fundraise guided", sub: "across pre-seed to pre-series A & series A rounds" },
                { value: "5.0★", label: "avg. session rating", sub: "from 50+ independent reviews" },
                { value: "4 yrs", label: "inside startup investment", sub: "investment, strategy, m&a at groww, india's #1 retail investment app" },
                { value: "12+", label: "sectors covered", sub: "fintech, edtech, healthtech, b2b, d2c, social platforms & more" },
                { value: "100%", label: "actionable advice", sub: "every session ends with clear next steps you can act on today" },
                { value: "250+", label: "founders advised", sub: "across fintech, saas, consumer-tech & d2c" },
                { value: "₹200cr+", label: "fundraise guided", sub: "across pre-seed to pre-series A & series A rounds" },
                { value: "5.0★", label: "avg. session rating", sub: "from 50+ independent reviews" },
                { value: "4 yrs", label: "inside startup investment", sub: "investment, strategy, m&a at groww, india's #1 retail investment app" },
                { value: "12+", label: "sectors covered", sub: "fintech, edtech, healthtech, b2b, d2c, social platforms & more" },
                { value: "100%", label: "actionable advice", sub: "every session ends with clear next steps you can act on today" },
              ].map((s, i) => (
                <div key={i} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-4 py-4 w-52 shrink-0">
                  <p className="font-heading text-2xl font-800 text-ink leading-none">{s.value}</p>
                  <p className="font-sans text-[13px] font-semibold text-ink/70 mt-1.5">{s.label}</p>
                  <p className="font-sans text-[12px] text-ink/35 mt-0.5 leading-snug">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ServicesClient services={activeServices} />

      <div className="px-4 md:px-10 pb-16 -mt-6">
        <ConsultancyCta />
      </div>
    </div>
  )
}

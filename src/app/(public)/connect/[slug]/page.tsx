import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { services as servicesTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { formatPrice, getDurationLabel, type Service } from "@/lib/services-data"
import { BookingForm } from "./BookingForm"
import { CheckCircle, Clock, MessageSquare, FileText, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

async function getService(slug: string): Promise<Service | null> {
  const rows = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.slug, slug))
    .limit(1)

  const row = rows[0]
  if (!row || !row.isActive) return null

  return {
    ...row,
    type: row.type as Service["type"],
    highlights: row.highlights ?? [],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return {}
  const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://priyaahuja.in"}/connect/${slug}`
  const desc = service.shortDescription ?? service.description ?? `Book a ${service.title} session with Priya Ahuja`
  return {
    title: service.title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${service.title} — Priya Ahuja`,
      description: desc,
      images: [{ url: "/priyadp.jpeg", width: 1200, height: 630, alt: `${service.title} — Priya Ahuja` }],
    },
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <Link href="/connect" className="flex items-center gap-1.5 hover:text-ink transition-colors">
          <ArrowLeft size={11} />
          all connects
        </Link>
        <span className="text-[12px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
          {service.tag}
        </span>
      </div>

      <div className="px-4 md:px-10 pt-10 pb-16 max-w-3xl">
        <div className="mb-8">
          <p className="text-[13px] font-sans text-ink/40 uppercase tracking-widest mb-3">
            {getDurationLabel(service)}
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-800 text-ink leading-tight mb-4">
            {service.title}
          </h1>
          <p className="font-sans text-base text-ink/60 leading-relaxed max-w-xl">
            {service.description}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Booking card: appears first on mobile, right sidebar on md+ */}
          <div className="w-full md:w-80 flex-shrink-0 min-w-0 order-first md:order-last">
            <div className="bg-card border border-border rounded-2xl p-6 md:sticky md:top-6">
              <div className="flex items-center justify-between mb-1">
                <p className="font-heading text-3xl font-800 text-ink">{formatPrice(service.price)}</p>
                {service.originalPrice && (
                  <p className="text-sm text-ink/30 line-through font-sans">
                    {formatPrice(service.originalPrice)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-ink/40 mb-6">
                {service.type === "dm" ? (
                  <MessageSquare size={13} />
                ) : service.type === "report" ? (
                  <FileText size={13} />
                ) : service.urgencyNote ? (
                  <Zap size={13} />
                ) : (
                  <Clock size={13} />
                )}
                <span className="text-xs font-sans">{getDurationLabel(service)}</span>
              </div>

              <BookingForm service={service} />
            </div>
          </div>

          <div className="flex-1 order-last md:order-first">
            {service.highlights.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6 mb-4">
                <h2 className="font-heading text-base font-700 text-ink mb-4">what we&apos;ll cover</h2>
                <ul className="space-y-2.5">
                  {service.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5">
                      <CheckCircle size={14} className="text-peach-dark mt-0.5 flex-shrink-0" />
                      <span className="font-sans text-base text-ink/70">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.whoIsItFor && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-heading text-base font-700 text-ink mb-3">who is this for</h2>
                <p className="font-sans text-base text-ink/60 leading-relaxed">{service.whoIsItFor}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

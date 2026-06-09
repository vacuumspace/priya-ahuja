import { notFound } from "next/navigation"
import { getService, formatPrice, getDurationLabel } from "@/lib/services-data"
import { BookingForm } from "./BookingForm"
import { CheckCircle, Clock, MessageSquare, FileText, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return {
    title: service.title,
    description: service.shortDescription,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <Link href="/consult" className="flex items-center gap-1.5 hover:text-ink transition-colors">
          <ArrowLeft size={11} />
          all consults
        </Link>
        <span className="text-[10px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
          {service.tag}
        </span>
      </div>

      <div className="px-4 md:px-10 pt-10 pb-16 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-sans text-ink/40 uppercase tracking-widest mb-3">
            {getDurationLabel(service)}
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-800 text-ink leading-tight mb-4">
            {service.title}
          </h1>
          <p className="font-sans text-sm text-ink/60 leading-relaxed max-w-xl">
            {service.description}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: details */}
          <div className="flex-1">
            {/* What you get */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-4">
              <h2 className="font-heading text-base font-700 text-ink mb-4">what we&apos;ll cover</h2>
              <ul className="space-y-2.5">
                {service.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <CheckCircle size={14} className="text-peach-dark mt-0.5 flex-shrink-0" />
                    <span className="font-sans text-sm text-ink/70">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who it's for */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading text-base font-700 text-ink mb-3">who is this for</h2>
              <p className="font-sans text-sm text-ink/60 leading-relaxed">{service.whoIsItFor}</p>
            </div>
          </div>

          {/* Right: booking card */}
          <div className="md:w-80 flex-shrink-0">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-6">
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
        </div>
      </div>
    </div>
  )
}

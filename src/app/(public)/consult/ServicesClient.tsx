"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Clock, MessageSquare, FileText, Zap } from "lucide-react"
import { type Service, formatPrice, getDurationLabel } from "@/lib/services-data"

const FUNDRAISE_TAGS = ["fundraising"]
const STARTUP_TAGS = ["strategy", "deals", "career", "urgent"]

const tabs = ["all", "fundraise", "startup", "dm"] as const
type Tab = (typeof tabs)[number]

function filterByTab(tab: Tab, services: Service[]) {
  if (tab === "all") return services
  if (tab === "fundraise") return services.filter((s) => FUNDRAISE_TAGS.includes(s.tag))
  if (tab === "startup") return services.filter((s) => STARTUP_TAGS.includes(s.tag))
  if (tab === "dm") return services.filter((s) => s.type === "dm")
  return services
}

export function ServicesClient({ services }: { services: Service[] }) {
  const [active, setActive] = useState<Tab>("all")
  const filtered = filterByTab(active, services)

  return (
    <>
      <div className="px-4 md:px-10 pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`text-[11px] font-sans px-3 py-1.5 rounded-full border transition-all ${
                active === tab
                  ? "bg-ink text-cream border-ink"
                  : "bg-transparent text-ink/50 border-border hover:border-ink/30 hover:text-ink/70"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((service, i) => (
            <Link
              key={service.slug}
              href={`/consult/${service.slug}`}
              className="group block bg-card border border-border rounded-2xl p-6 hover:border-peach-dark/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-mono text-ink/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
                      {service.tag}
                    </span>
                  </div>
                  <h2 className="font-heading text-xl font-700 text-ink mb-2 normal-case">
                    {service.title}
                  </h2>
                  <p className="font-sans text-sm text-ink/60 leading-relaxed max-w-lg">
                    {service.shortDescription}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-sans font-700 text-ink text-lg">{formatPrice(service.price)}</p>
                  {service.originalPrice && (
                    <p className="text-xs text-ink/30 line-through font-sans">
                      {formatPrice(service.originalPrice)}
                    </p>
                  )}
                  <div className="flex items-center justify-end gap-1 mt-2 text-ink/40">
                    {service.type === "dm" ? (
                      <MessageSquare size={12} />
                    ) : service.type === "report" ? (
                      <FileText size={12} />
                    ) : service.urgencyNote ? (
                      <Zap size={12} />
                    ) : (
                      <Clock size={12} />
                    )}
                    <span className="text-[11px] font-sans">{getDurationLabel(service)}</span>
                  </div>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1 text-xs font-sans text-peach-dark font-semibold">
                      {service.type === "dm" ? (
                        <>send message <MessageSquare size={11} /></>
                      ) : (
                        <>book now <ArrowRight size={11} /></>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

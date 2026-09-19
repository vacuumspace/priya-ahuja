"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X, GraduationCap } from "lucide-react"
import { StartsInCountdown } from "@/components/StartsInCountdown"
import { formatWorkshopTimeRange, formatWorkshopPrice, formatWorkshopDate } from "@/lib/workshop-time"

export type PromoWorkshop = {
  slug: string
  title: string
  date: string
  startTime: string
  endTime: string
  price: number
  thumbnailUrl: string | null
}

export default function WorkshopPromoPopup({ workshop }: { workshop: PromoWorkshop | null }) {
  // No persisted dismissal - shows again every time this component mounts,
  // i.e. every landing on the home page, not just the first time.
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (!workshop) return
    const showTimer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(showTimer)
  }, [workshop])

  useEffect(() => {
    if (!visible) return
    const raf = requestAnimationFrame(() => setAnimateIn(true))
    return () => cancelAnimationFrame(raf)
  }, [visible])

  if (!workshop || dismissed || !visible) return null

  const close = () => setDismissed(true)

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 transition-opacity duration-1000 ease-out ${animateIn ? "opacity-100" : "opacity-0"}`}
      onClick={close}
    >
      <div
        className={`relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl overflow-hidden transition-all duration-1000 ease-out ${animateIn ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {workshop.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={workshop.thumbnailUrl} alt={workshop.title} className="w-full aspect-video object-cover" />
        ) : (
          <div className="w-full aspect-video bg-peach/30 flex items-center justify-center">
            <GraduationCap size={40} className="text-peach-dark/50" />
          </div>
        )}

        <div className="p-6 text-center">
          <p className="text-[11px] font-sans font-semibold uppercase tracking-wide text-peach-dark mb-1">upcoming workshop</p>
          <p className="font-heading text-xl font-800 text-ink normal-case mb-2">{workshop.title}</p>
          <p className="font-sans text-sm font-semibold text-ink/80 mb-1">
            {formatWorkshopDate(workshop.date)} · {formatWorkshopTimeRange(workshop.startTime, workshop.endTime)} IST
          </p>
          <StartsInCountdown
            startsAt={new Date(`${workshop.date}T${workshop.startTime}:00+05:30`).toISOString()}
            className="text-[13px] font-sans font-semibold text-peach-dark mb-1"
          />
          <p className="font-heading text-base font-600 text-ink/60 mb-5">{formatWorkshopPrice(workshop.price)}</p>
          <Link
            href={`/school/workshops/${workshop.slug}`}
            onClick={close}
            className="inline-flex items-center justify-center gap-2 w-full bg-ink text-cream font-sans font-semibold text-sm py-3 rounded-xl hover:bg-ink/80 transition-colors"
          >
            view details
          </Link>
        </div>
      </div>
    </div>
  )
}

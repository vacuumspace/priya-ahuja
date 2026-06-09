"use client"

import { useEffect, useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

type Service = {
  id: string
  slug: string
  title: string
  description: string
  price: number
  originalPrice: number | null
  durationMin: number | null
  type: string
  isActive: boolean
  order: number
}

function formatPrice(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN")
}

function ServiceRow({
  service,
  onUpdate,
  onMove,
  isFirst,
  isLast,
}: {
  service: Service
  onUpdate: (id: string, patch: Partial<Service>) => void
  onMove: (id: string, direction: "up" | "down") => void
  isFirst: boolean
  isLast: boolean
}) {
  const [price, setPrice] = useState(String(service.price / 100))

  const patch = async (data: Partial<Service>) => {
    await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    onUpdate(service.id, data)
  }

  return (
    <div className={`bg-card border rounded-2xl p-5 flex items-start gap-4 ${service.isActive ? "border-border" : "border-border opacity-60"}`}>
      {/* Reorder */}
      <div className="flex flex-col gap-1 pt-0.5">
        <button
          onClick={() => onMove(service.id, "up")}
          disabled={isFirst}
          className="p-1 rounded text-ink/30 hover:text-ink/60 disabled:opacity-20 transition-colors"
        >
          <ChevronUp size={14} />
        </button>
        <button
          onClick={() => onMove(service.id, "down")}
          disabled={isLast}
          className="p-1 rounded text-ink/30 hover:text-ink/60 disabled:opacity-20 transition-colors"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono text-ink/30">#{service.order}</span>
          <span className="text-[10px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">{service.type}</span>
        </div>
        <p className="font-heading text-base font-700 text-ink normal-case">{service.title}</p>
        <p className="font-sans text-xs text-ink/50 mt-1 leading-relaxed line-clamp-2">{service.description}</p>
      </div>

      {/* Price edit */}
      <div className="flex items-center gap-1.5 mt-1">
        <span className="text-sm font-sans text-ink/50">₹</span>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={() => {
            const val = Math.round(parseFloat(price) * 100)
            if (!isNaN(val)) patch({ price: val })
          }}
          className="w-24 text-sm font-sans bg-cream border border-border rounded-lg px-2 py-1 text-ink focus:outline-none focus:border-peach-dark/50"
        />
      </div>

      {/* Active toggle */}
      <button
        onClick={() => patch({ isActive: !service.isActive })}
        className={`mt-1 flex-shrink-0 w-10 h-5 rounded-full transition-colors relative ${service.isActive ? "bg-ink" : "bg-border"}`}
        aria-label={service.isActive ? "Deactivate" : "Activate"}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${service.isActive ? "left-5" : "left-0.5"}`}
        />
      </button>
    </div>
  )
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => { setServices(data); setLoading(false) })
  }, [])

  const handleUpdate = (id: string, patch: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const handleMove = async (id: string, direction: "up" | "down") => {
    const idx = services.findIndex((s) => s.id === id)
    if (direction === "up" && idx === 0) return
    if (direction === "down" && idx === services.length - 1) return

    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    const next = [...services]
    const aOrder = next[idx].order
    const bOrder = next[swapIdx].order
    next[idx] = { ...next[idx], order: bOrder }
    next[swapIdx] = { ...next[swapIdx], order: aOrder }
    ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
    setServices(next)

    await Promise.all([
      fetch(`/api/admin/services/${next[swapIdx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: aOrder }),
      }),
      fetch(`/api/admin/services/${next[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: bOrder }),
      }),
    ])
  }

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Services</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{services.length} services</p>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-ink/40">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {services.map((s, i) => (
            <ServiceRow
              key={s.id}
              service={s}
              onUpdate={handleUpdate}
              onMove={handleMove}
              isFirst={i === 0}
              isLast={i === services.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

export function formatTimeLeft(ms: number) {
  const totalMins = Math.floor(ms / 60_000)
  const d = Math.floor(totalMins / 1440)
  const h = Math.floor((totalMins % 1440) / 60)
  const m = totalMins % 60
  return [d > 0 && `${d}d`, (d > 0 || h > 0) && `${h}h`, `${m}m`].filter(Boolean).join(" ")
}

// Rendered only after mount so the server's "now" can't disagree with the
// client's and cause a hydration mismatch.
export function StartsInCountdown({ startsAt, className }: { startsAt: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  if (now === null) return null
  const msLeft = new Date(startsAt).getTime() - now
  return (
    <p className={className ?? "text-[13px] font-sans font-semibold text-peach-dark"}>
      {msLeft > 0 ? `starting in ${formatTimeLeft(msLeft)}` : "happening now"}
    </p>
  )
}

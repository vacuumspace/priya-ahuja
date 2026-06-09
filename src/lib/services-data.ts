// Types and helpers for services — data lives in the database

export type Service = {
  id: string
  slug: string
  title: string
  description: string
  shortDescription: string | null
  price: number // paise
  originalPrice: number | null // paise
  durationMin: number | null
  type: "call" | "dm" | "report"
  tag: string
  highlights: string[]
  whoIsItFor: string | null
  acceptsDeckLink: boolean
  deckLinkLabel: string | null
  deckLinkPlaceholder: string | null
  urgencyNote: string | null
  isActive: boolean
  order: number
}

export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`
}

export function getDurationLabel(service: Pick<Service, "type" | "durationMin" | "urgencyNote">): string {
  if (service.type === "dm") return "async · 2-day response"
  if (service.type === "report") return "written report · 3-day delivery"
  if (service.urgencyNote) return `${service.durationMin} min · ${service.urgencyNote}`
  return `${service.durationMin} min 1:1 call`
}

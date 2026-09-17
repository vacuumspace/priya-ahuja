// Shared between the registration modal (client) and create-order route
// (server-side validation), so the two never drift apart.
export const WORKSHOP_STAGES = [
  { value: "idea", label: "idea / pre-launch" },
  { value: "pre-seed", label: "pre-seed" },
  { value: "seed", label: "seed" },
  { value: "series-a", label: "series a" },
  { value: "series-b-plus", label: "series b+" },
  { value: "bootstrapped", label: "bootstrapped" },
] as const

export const WORKSHOP_SECTORS = [
  { value: "ai-b2b", label: "ai (b2b)" },
  { value: "ai-b2c", label: "ai (b2c)" },
  { value: "saas-b2b", label: "saas / b2b" },
  { value: "b2c-consumer", label: "b2c / consumer" },
  { value: "d2c", label: "d2c" },
  { value: "fintech", label: "fintech" },
  { value: "edtech", label: "edtech" },
  { value: "healthtech", label: "healthtech" },
  { value: "marketplace", label: "marketplace" },
  { value: "deeptech", label: "deeptech" },
  { value: "other", label: "other" },
] as const

export type WorkshopStage = (typeof WORKSHOP_STAGES)[number]["value"]
export type WorkshopSector = (typeof WORKSHOP_SECTORS)[number]["value"]

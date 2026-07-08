import grantsJson from "../../data/json/grants.json"

export type GrantSector =
  | "General"
  | "AgriTech"
  | "CleanTech"
  | "DeepTech"
  | "EdTech"
  | "FinTech"
  | "HealthTech"
  | "Manufacturing"
  | "Social Impact"
  | "Women-Led"
  | "Student-Led"
  | "Defence"
  | "Space"

export const ALL_SECTORS: GrantSector[] = [
  "General",
  "AgriTech",
  "CleanTech",
  "DeepTech",
  "EdTech",
  "FinTech",
  "HealthTech",
  "Manufacturing",
  "Social Impact",
  "Women-Led",
  "Student-Led",
  "Defence",
  "Space",
]

export type GrantType = "grant" | "loan" | "equity" | "credits" | "fellowship" | "accelerator"
export type GrantStage = "idea" | "prototype" | "early-revenue" | "growth" | "any"

export type StartupGrant = {
  slug: string
  title: string
  org: string
  sector: GrantSector
  grantType: GrantType
  stage: GrantStage
  amountLabel: string | null
  deadlineLabel: string
  description: string
  // gated fields - only shown after sign-in
  eligibility: string
  whatYouGet: string[]
  howToApply: string
  applyUrl: string
  featured?: boolean
}

export const grants: StartupGrant[] = grantsJson.grants as StartupGrant[]
export const lastRefreshed: string = grantsJson.lastRefreshed

export function getGrantBySlug(slug: string): StartupGrant | undefined {
  return grants.find((g) => g.slug === slug)
}

export function getGrantsBySector(sector: string): StartupGrant[] {
  if (sector === "All") return grants
  return grants.filter((g) => g.sector === sector)
}

export function getFeaturedGrants(): StartupGrant[] {
  return grants.filter((g) => g.featured)
}

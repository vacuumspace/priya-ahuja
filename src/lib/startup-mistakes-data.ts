export const MISTAKE_INDUSTRIES = [
  "D2C / E-commerce",
  "SaaS / B2B",
  "Fintech",
  "Edtech",
  "Healthtech",
  "Foodtech",
  "Marketplace",
  "AI / Deep Tech",
  "Media / Content",
  "Services / Agency",
  "Other",
] as const

export const MISTAKE_TOPICS = [
  "Fundraise",
  "Product",
  "Validation",
  "Idea",
  "Co-founder",
  "Hiring",
  "Marketing",
  "Sales",
  "Legal / Compliance",
  "Finance",
  "Mindset",
  "Other",
] as const

export type MistakeIndustry = (typeof MISTAKE_INDUSTRIES)[number]
export type MistakeTopic = (typeof MISTAKE_TOPICS)[number]

export const MISTAKE_TITLE_MAX_LEN = 60
export const MISTAKE_BODY_MAX_LEN = 300

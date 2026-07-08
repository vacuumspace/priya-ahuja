export const MISTAKE_INDUSTRIES = [
  "AI / Deep Tech",
  "Climate / Cleantech",
  "Consumer / Consumertech",
  "Consumer Social",
  "D2C / E-commerce",
  "Edtech",
  "Fintech",
  "Foodtech",
  "Gaming",
  "Hardware / IoT",
  "Healthtech",
  "HR Tech",
  "Legal Tech",
  "Logtech / Supply Chain",
  "Marketplace",
  "Media / Content",
  "Proptech",
  "SaaS / B2B",
  "Services / Agency",
  "Traveltech",
  "Web3 / Crypto",
  "Other",
] as const

export const MISTAKE_TOPICS = [
  "Co-founder",
  "Finance",
  "Fundraise",
  "Hiring",
  "Idea",
  "Legal / Compliance",
  "Marketing",
  "Mindset",
  "Product",
  "Sales",
  "Validation",
  "Other",
] as const

export type MistakeIndustry = (typeof MISTAKE_INDUSTRIES)[number]
export type MistakeTopic = (typeof MISTAKE_TOPICS)[number]

export const MISTAKE_TITLE_MAX_LEN = 60
export const MISTAKE_BODY_MAX_LEN = 300

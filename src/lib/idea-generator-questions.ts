// One-question-at-a-time intake for the Personalised Startup Idea Generator.
// The question set itself is the product's moat - never re-rendered to the
// user after submit, and never referenced by category in the generated
// report (see the synthesis prompt in idea-generator.ts).

export type QuestionType = "text" | "textarea" | "select" | "multiselect"

export type GenQuestion = {
  id: string
  prompt: string
  helper?: string
  type: QuestionType
  options?: string[]
  placeholder?: string
  optional?: boolean
}

export const IDEA_GEN_QUESTIONS: GenQuestion[] = [
  {
    id: "familyBackground",
    prompt: "what's your family background?",
    helper: "business family, service class, farming, first-generation earner - whatever applies.",
    type: "textarea",
    placeholder: "e.g. parents run a small textile trading business in Surat...",
  },
  {
    id: "education",
    prompt: "what's your education history?",
    helper: "degree, field, institution - and anything notable about it.",
    type: "textarea",
    placeholder: "e.g. B.Tech in mechanical engineering from NIT Trichy...",
  },
  {
    id: "workExperience",
    prompt: "walk me through your work experience.",
    helper: "companies, roles, years, what you actually did day to day.",
    type: "textarea",
    placeholder: "e.g. 4 years in pharma sales at Cipla, covering Tier-2 hospitals...",
  },
  {
    id: "skills",
    prompt: "what are you genuinely good at?",
    helper: "hard skills, soft skills, anything you'd back yourself on.",
    type: "textarea",
  },
  {
    id: "interests",
    prompt: "what are you interested in or passionate about outside work?",
    type: "textarea",
  },
  {
    id: "painPoints",
    prompt: "what's a problem you've personally run into that nobody's solved well?",
    helper: "the more specific and personal, the better - this is often the strongest idea seed.",
    type: "textarea",
    optional: true,
  },
  {
    id: "licenses",
    prompt: "do you hold any professional licenses or certifications?",
    helper: "CA, doctor, lawyer, engineer, any regulated qualification.",
    type: "text",
    optional: true,
  },
  {
    id: "audience",
    prompt: "do you have any personal audience or following?",
    type: "select",
    options: ["none", "small (under 5k)", "medium (5k-50k)", "large (50k+)"],
  },
  {
    id: "capital",
    prompt: "how much capital can you actually put in?",
    type: "select",
    options: ["under ₹1 lakh", "₹1-5 lakh", "₹5-25 lakh", "₹25 lakh+", "no personal capital"],
  },
  {
    id: "savingsRunway",
    prompt: "if you earned zero income, how long could you survive on savings?",
    type: "select",
    options: ["under 3 months", "3-6 months", "6-12 months", "12 months+", "no pressure either way"],
  },
  {
    id: "hoursPerWeek",
    prompt: "how many hours a week can you realistically give this?",
    type: "select",
    options: ["under 10 (side project)", "10-25", "25-40", "40+ (full-time)"],
  },
  {
    id: "employmentStatus",
    prompt: "what's your current employment situation?",
    type: "select",
    options: ["employed, no plan to quit yet", "employed, can quit in a few months", "already free / no job", "student", "freelance / consulting"],
  },
  {
    id: "riskAppetite",
    prompt: "how much risk are you comfortable taking on?",
    type: "select",
    options: ["low - need steady income", "medium - can absorb some loss", "high - fine betting big"],
  },
  {
    id: "growthAmbition",
    prompt: "are you looking to build a bootstrapped, owner-run business, or something VC-backable and scaled?",
    type: "select",
    options: ["bootstrap, owner-operated", "venture-scale, fundable", "not sure yet"],
  },
  {
    id: "coFounder",
    prompt: "are you building solo, or looking for a co-founder?",
    type: "select",
    options: ["solo", "looking for one", "already have one"],
  },
  {
    id: "salesComfort",
    prompt: "how do you feel about selling - cold calls, pitching, door-to-door?",
    type: "select",
    options: ["love it", "okay with it", "would rather avoid it"],
  },
  {
    id: "network",
    prompt: "who do you know that could actually help - investors, distributors, industry insiders?",
    type: "textarea",
    optional: true,
  },
  {
    id: "existingAssets",
    prompt: "do you already have any assets that could help - property, equipment, an audience, inventory?",
    type: "textarea",
    optional: true,
  },
  {
    id: "location",
    prompt: "where are you based, and would you relocate for the right opportunity?",
    type: "text",
    placeholder: "e.g. Pune, open to relocating within India",
  },
  {
    id: "businessTypePreference",
    prompt: "any preference on the type of business?",
    type: "multiselect",
    options: ["D2C / brand", "SaaS / tech", "services", "marketplace", "content / media", "deep tech", "no preference"],
    optional: true,
  },
  {
    id: "industriesToAvoid",
    prompt: "any industries you'd rather not touch?",
    type: "textarea",
    optional: true,
  },
  {
    id: "timeline",
    prompt: "how soon do you want to start?",
    type: "select",
    options: ["within a month", "1-3 months", "3-6 months", "just exploring for now"],
  },
  {
    id: "pastAttempts",
    prompt: "have you tried starting something before? what happened?",
    type: "textarea",
    optional: true,
  },
  {
    id: "ageLifeStage",
    prompt: "what's your age / life stage?",
    helper: "young and flexible, married with dependents, etc. - shapes time horizon and risk framing.",
    type: "text",
  },
]

export type IdeaGenAnswers = Record<string, string | string[]>

export type Service = {
  slug: string
  title: string
  shortDescription: string
  description: string
  price: number // paise
  originalPrice?: number // paise
  durationMin: number | null
  type: "call" | "dm" | "report"
  tag: string
  highlights: string[]
  whoIsItFor: string
  acceptsDeckLink?: boolean
  deckLinkLabel?: string
  deckLinkPlaceholder?: string
  urgencyNote?: string
}

export const SERVICES: Service[] = [
  // ─── FUNDRAISING ────────────────────────────────────────────────────────────
  {
    slug: "pitch-deck-analysis",
    title: "Pitch Deck Analysis",
    shortDescription: "Detailed written teardown of your deck — structure, story, and investor perception.",
    description:
      "Share your pitch deck link and I'll return a comprehensive written analysis covering narrative arc, slide-by-slide feedback, red flags investors will spot, and specific rewrites. You'll get an actionable report within 3 business days — the kind of feedback VCs give each other, not polite suggestions.",
    price: 350000, // ₹3,500
    originalPrice: 500000,
    durationMin: null,
    type: "report",
    tag: "fundraising",
    acceptsDeckLink: true,
    deckLinkLabel: "pitch deck link",
    deckLinkPlaceholder: "google drive / notion / docsend link (view access required)",
    highlights: [
      "Slide-by-slide written feedback",
      "Narrative arc and investor perception audit",
      "Red flags and common VC objections flagged",
      "Specific language and rewrite suggestions",
      "Market sizing and traction slide critique",
      "Delivered as a structured report within 3 business days",
    ],
    whoIsItFor:
      "Founders preparing to start fundraising or who have sent decks and received silence. Also great before a major investor meeting where you need a sharp external eye.",
  },
  {
    slug: "fundraising-readiness-audit",
    title: "Fundraising Readiness Audit",
    shortDescription: "A 45-min deep dive to know if you're truly ready to raise — and what to fix first.",
    description:
      "Most founders start fundraising too early or with the wrong materials. In this session we'll assess your readiness across six dimensions: narrative clarity, financial model quality, traction narrative, investor targeting, data room completeness, and founder-market fit articulation. You'll leave with a clear priority list of what to fix before your next conversation.",
    price: 350000, // ₹3,500
    originalPrice: 450000,
    durationMin: 45,
    type: "call",
    tag: "fundraising",
    acceptsDeckLink: true,
    deckLinkLabel: "share your deck or one-pager (optional)",
    deckLinkPlaceholder: "google drive / notion / docsend link",
    highlights: [
      "Six-dimension fundraising readiness scorecard",
      "Narrative clarity and investor storytelling review",
      "Financial model and unit economics check",
      "Traction narrative — are you presenting metrics correctly?",
      "Data room checklist and what's missing",
      "Priority action list before you start sending decks",
    ],
    whoIsItFor:
      "Founders thinking about raising in the next 1–6 months who want to avoid the most common mistakes that kill deals before they start.",
  },
  {
    slug: "investor-targeting-strategy",
    title: "Investor Targeting & Outreach Strategy",
    shortDescription: "Build the right investor list and craft outreach that actually gets replies.",
    description:
      "Sending cold emails into the void? Most founder outreach fails because of poor targeting, generic messaging, and no sequencing strategy. I'll help you map the right investors for your stage and sector, craft a concise and compelling cold email, and build a systematic outreach process so you spend less time chasing and more time closing.",
    price: 280000, // ₹2,800
    originalPrice: 350000,
    durationMin: 30,
    type: "call",
    tag: "fundraising",
    highlights: [
      "Investor persona mapping by stage, thesis, and portfolio fit",
      "Building a tiered outreach list (warm vs. cold)",
      "Cold email and intro request templates",
      "Follow-up sequencing and timing",
      "How to leverage mutual connections and AngelList",
      "Managing the pipeline without a CRM headache",
    ],
    whoIsItFor:
      "Founders who are starting to reach out to investors or who have been sending emails with low reply rates and need a systematic approach.",
  },
  {
    slug: "term-sheet-deep-dive",
    title: "Term Sheet Deep Dive",
    shortDescription: "Understand every clause before you sign — economic, control, and exit implications.",
    description:
      "A term sheet is exciting and full of clauses that can fundamentally reshape your company. I'll walk you through the key economic terms, control provisions, and protective clauses, flag anything non-standard, and help you understand what you can and should negotiate. You'll come out knowing exactly what you're agreeing to.",
    price: 280000, // ₹2,800
    originalPrice: 350000,
    durationMin: 30,
    type: "call",
    tag: "fundraising",
    highlights: [
      "Pre-money valuation, dilution, and ESOP pool mechanics",
      "Liquidation preferences: 1x, 2x, participating vs. non-participating",
      "Board composition and investor consent matters",
      "Anti-dilution provisions: broad-based vs. full ratchet",
      "Pro-rata rights, information rights, and drag-along",
      "What's market standard and what's worth pushing back on",
    ],
    whoIsItFor:
      "Founders who have received a term sheet and want a clear-eyed walkthrough before engaging lawyers — so you go in informed, not just nodding.",
  },

  // ─── STRATEGY ────────────────────────────────────────────────────────────────
  {
    slug: "startup-strategy",
    title: "Startup Strategy & Growth Session",
    shortDescription: "Pressure-test your strategy with someone who's seen both sides of the table.",
    description:
      "Bring your hardest strategic question — GTM, pricing, positioning, hiring sequencing, or your 12-month roadmap. I'll stress-test your assumptions, surface blind spots, and help you sharpen your thinking using frameworks from corporate development and FinTech. No generic frameworks, just focused thinking on your specific problem.",
    price: 280000, // ₹2,800
    originalPrice: 350000,
    durationMin: 30,
    type: "call",
    tag: "strategy",
    highlights: [
      "GTM strategy — channels, sequencing, and CAC assumptions",
      "Pricing strategy and revenue model stress-test",
      "Competitive positioning and moat articulation",
      "Hiring plan and when to make which bets",
      "12-month roadmap prioritisation",
      "Blind-spot identification through corp dev lens",
    ],
    whoIsItFor:
      "Early-stage founders who want a sharp external perspective from someone embedded in the FinTech and startup ecosystem — not a consultant who'll restate your own slides.",
  },
  {
    slug: "gtm-strategy-review",
    title: "Go-to-Market Strategy Review",
    shortDescription: "Validate your distribution playbook before you burn budget proving it.",
    description:
      "GTM is where most startups bleed money quietly. In this 45-minute session, we'll map your ideal customer profile precisely, challenge your channel assumptions, sequence your acquisition bets, and figure out whether you're selling to the right buyer in the right way. I'll draw on what I've seen work (and fail) across FinTech and consumer startups.",
    price: 350000, // ₹3,500
    originalPrice: 450000,
    durationMin: 45,
    type: "call",
    tag: "strategy",
    highlights: [
      "ICP definition and segmentation — who exactly is the first buyer?",
      "Channel selection and distribution sequencing",
      "Sales motion: self-serve, inside sales, or enterprise?",
      "Partnerships and BD as a GTM lever",
      "CAC and payback period reality check",
      "First 90-day GTM execution playbook",
    ],
    whoIsItFor:
      "Founders who have product-market fit signals but aren't sure how to scale distribution, or who are burning on channels without traction.",
  },
  {
    slug: "unit-economics-financial-model",
    title: "Unit Economics & Financial Model Review",
    shortDescription: "Know your numbers cold — and present them in a way investors understand.",
    description:
      "Investors can smell a shaky financial model from across a Zoom call. Share your model and we'll go through your unit economics, cohort assumptions, burn rate, and path to profitability together. I'll help you build a model that's both defensible in a due diligence conversation and honest enough that you can actually use it to run your business.",
    price: 350000, // ₹3,500
    originalPrice: 500000,
    durationMin: 45,
    type: "call",
    tag: "strategy",
    acceptsDeckLink: true,
    deckLinkLabel: "share your financial model or deck (optional)",
    deckLinkPlaceholder: "google sheets / notion link (view access required)",
    highlights: [
      "Unit economics: CAC, LTV, payback period, and contribution margin",
      "Cohort analysis and retention assumptions",
      "Burn rate and runway calculation",
      "Revenue model structure and growth assumptions",
      "Path to profitability narrative",
      "How to present financials to investors without overpromising",
    ],
    whoIsItFor:
      "Founders preparing for investor diligence or who want to get their numbers in order before they're asked hard questions they can't answer.",
  },

  // ─── DEALS & FINANCE ─────────────────────────────────────────────────────────
  {
    slug: "cap-table-dilution-modeling",
    title: "Cap Table & Dilution Modeling",
    shortDescription: "Understand your ownership today, at exit, and after every future round.",
    description:
      "Founders are often shocked by how much dilution compounds across rounds. In this session I'll walk you through your current cap table, model out dilution scenarios for your next raise, explain ESOP pool mechanics, and show you how to think about exit math at different valuations — so you understand what the numbers actually mean for you and your co-founders.",
    price: 280000, // ₹2,800
    originalPrice: 350000,
    durationMin: 30,
    type: "call",
    tag: "deals",
    highlights: [
      "Current cap table walkthrough and clean-up",
      "Dilution modeling across multiple round scenarios",
      "ESOP pool mechanics and refresh strategy",
      "Pro-rata rights and their dilutive impact",
      "Exit waterfall: who gets what at which valuation",
      "Founder vesting and acceleration provisions",
    ],
    whoIsItFor:
      "Founders who've done at least one round and want to understand what their next raise will do to their ownership — before they commit to a valuation.",
  },
  {
    slug: "acqui-hire-ma-readiness",
    title: "M&A & Acqui-hire Readiness",
    shortDescription: "Is your startup acquisition-ready? Structure, diligence, and negotiation basics.",
    description:
      "Getting acquisition interest is exciting and confusing. I'll walk you through what acquirers actually look at, how to read strategic intent vs. acqui-hire intent, what your data room needs to contain, and how to protect your interests in a process where the acquirer has the home advantage. This is the session I wished founders took before they came to the table.",
    price: 350000, // ₹3,500
    originalPrice: 500000,
    durationMin: 45,
    type: "call",
    tag: "deals",
    highlights: [
      "Strategic vs. financial acquirer mindset",
      "How acquirers value early-stage startups",
      "Data room essentials for M&A diligence",
      "Letter of Intent (LOI) key terms explained",
      "Acqui-hire vs. full acquisition: how to read the room",
      "Reps, warranties, and escrow basics",
    ],
    whoIsItFor:
      "Founders who have received acquisition interest, are thinking about strategic options, or want to understand M&A before they're in a live process.",
  },

  // ─── CAREER ──────────────────────────────────────────────────────────────────
  {
    slug: "vc-career-mentorship",
    title: "VC / Corp Dev Career Mentorship",
    shortDescription: "Break into venture capital or corporate development — from someone inside it.",
    description:
      "Thinking about a career in venture capital or corporate development? I'll walk you through what these roles actually look like day-to-day (not the LinkedIn version), how to position yourself without warm intros, how to evaluate opportunities, and what the hiring process actually looks for. Specific and honest — not inspirational fluff.",
    price: 180000, // ₹1,800
    originalPrice: 250000,
    durationMin: 30,
    type: "call",
    tag: "career",
    highlights: [
      "What VC and Corp Dev roles actually involve day-to-day",
      "How to network into these roles without warm intros",
      "Resume and LinkedIn positioning review",
      "Evaluating VC vs. Corp Dev vs. in-house strategy",
      "Deal sourcing, diligence, and portfolio work explained",
      "How to stand out in a process that runs on pattern-matching",
    ],
    whoIsItFor:
      "MBA students, consultants, bankers, or operators who want to transition into venture capital or corporate development and need a realistic view of the path.",
  },

  // ─── ASYNC ───────────────────────────────────────────────────────────────────
  {
    slug: "founder-sos",
    title: "Founder SOS — Urgent 1:1",
    shortDescription: "Something just happened. Get 45 focused minutes within 48 hours.",
    description:
      "A co-founder conflict, a term sheet that needs a fast read, an investor meeting in 48 hours you're not prepared for, or a strategic decision with a hard deadline. This slot is reserved for urgent situations where you need focused, expert thinking fast — not in two weeks.",
    price: 500000, // ₹5,000
    durationMin: 45,
    type: "call",
    tag: "urgent",
    urgencyNote: "scheduled within 48 hours of booking",
    highlights: [
      "Priority scheduling within 48 hours",
      "Full 45-minute focused session",
      "Any topic: fundraising, strategy, conflict, deals",
      "Pre-call prep note reviewed in advance",
      "Follow-up voice note summary after the call",
    ],
    whoIsItFor:
      "Founders facing a time-sensitive decision or crisis where waiting isn't an option — and who need clear, expert thinking fast.",
  },
  {
    slug: "priority-dm",
    title: "Priority DM",
    shortDescription: "One focused question. A detailed, personal response within 2 business days.",
    description:
      "Have a specific question that deserves a real answer but doesn't need a full call? Send it over as a written message and I'll give it proper attention — a detailed, personalised written response within 2 business days. Great for quick sanity checks, opinion on a specific clause, or a focused question on strategy, fundraising, or careers.",
    price: 10000, // ₹100
    durationMin: null,
    type: "dm",
    tag: "async",
    highlights: [
      "Detailed written response within 2 business days",
      "Personalised — not a template or generic advice",
      "No scheduling required",
      "Great for single focused questions",
      "Topics: fundraising, strategy, career, deals",
    ],
    whoIsItFor:
      "Anyone with a specific question that needs a thoughtful, considered answer — not a Google search or a generic LinkedIn post.",
  },
]

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`
}

export function getDurationLabel(service: Service): string {
  if (service.type === "dm") return "async · 2-day response"
  if (service.type === "report") return "written report · 3-day delivery"
  if (service.urgencyNote) return `${service.durationMin} min · ${service.urgencyNote}`
  return `${service.durationMin} min 1:1 call`
}

// Shared types + helpers for the Pitch Deck Analyser report.
// The report JSON is produced by Gemini (see pitch-deck-analysis.ts), stored in
// pitch_deck_analyses.report, and rendered by PitchDeckReportView.

export type SectionReview = {
  name: string
  present: boolean
  slideRef: string | null
  score: number // 0-10
  feedback: string
  fix: string | null
}

export type Improvement = {
  title: string
  severity: "critical" | "important" | "polish"
  why: string
  how: string
}

export type StoryRewrite = {
  slide: string
  current: string
  suggested: string
  why: string
}

export type DimensionReview = { score: number; assessment: string } // score 0-10

export type PitchDeckReport = {
  overallScore: number // 0-100
  verdict: string
  deckSnapshot: {
    company: string
    oneLiner: string
    stage: string
    sector: string
    ask: string
  }
  dimensions: {
    story: DimensionReview
    clarity: DimensionReview
    evidence: DimensionReview
    design: DimensionReview
  }
  sections: SectionReview[]
  strengths: string[]
  improvements: Improvement[]
  redFlags: string[]
  investorQuestions: string[]
  rewrites: StoryRewrite[]
  actionPlan: string[]
}

// The 20 lenses every early-stage deck is judged against, in narrative order.
// Some are literal slides (problem, team, the ask); others are questions the deck
// must answer somewhere (niche & wedge, why now, moat) even without a dedicated slide.
export const DECK_SECTIONS = [
  "cover & one-liner",
  "problem",
  "niche & wedge",
  "solution",
  "product",
  "why now",
  "market size",
  "business model",
  "unit economics",
  "traction",
  "customer proof",
  "competition",
  "moat & defensibility",
  "go-to-market",
  "team",
  "founder-market fit",
  "financials & projections",
  "the ask",
  "use of funds & milestones",
  "vision & endgame",
] as const

export function getDeckScoreBand(score: number): { label: string; color: string; directional: string } {
  if (score >= 80) return {
    label: "vc-ready story",
    color: "text-green-700",
    directional: "your deck tells a fundable story. polish the details flagged below, then focus your energy on targeting the right investors and nailing the live delivery - the deck itself is no longer the bottleneck.",
  }
  if (score >= 65) return {
    label: "fundable with fixes",
    color: "text-blue-700",
    directional: "the core story works, but a few sections will trigger doubts in an investor's head. fix the critical items below before your next send-out - a good deck with one weak slide still gets a pass.",
  }
  if (score >= 50) return {
    label: "good bones, weak story",
    color: "text-amber-700",
    directional: "the substance may be there, but the deck isn't selling it. investors spend under 3 minutes on a cold deck - right now yours doesn't earn a meeting. rework the narrative arc before sending it to anyone on your target list.",
  }
  if (score >= 35) return {
    label: "story needs a rework",
    color: "text-orange-700",
    directional: "this deck would get filtered out at first pass. don't patch individual slides - restructure the whole narrative around problem → solution → proof → why now → why you. use the section feedback below as your rebuild checklist.",
  }
  return {
    label: "not pitch-ready yet",
    color: "text-red-700",
    directional: "the deck is missing too much of what investors need to say yes to a meeting. before rebuilding slides, get clear on the underlying answers - who has this problem, why your solution wins, and what proof you have. then rebuild from scratch.",
  }
}

export function deckDimensionColor(score: number): string {
  // score is 0-10
  if (score >= 7.5) return "bg-green-400"
  if (score >= 5) return "bg-peach-dark"
  if (score >= 2.5) return "bg-amber-400"
  return "bg-red-400"
}

export const MAX_DECK_SIZE_BYTES = 4 * 1024 * 1024 // 4 MB - Vercel request body limit is 4.5 MB

// ── Sample report shown (blurred for signed-out users) on the intro screen ──
export const SAMPLE_DECK_REPORT: PitchDeckReport = {
  overallScore: 58,
  verdict: "there's a real business hiding in this deck, but the story undersells it. the problem slide describes a category, not a pain; traction is buried on slide 11 when it's your strongest card; and the ask doesn't say what the money buys. an investor skimming this gives it 90 seconds and moves on.",
  deckSnapshot: {
    company: "KiranaStack",
    oneLiner: "inventory and credit management app for kirana stores",
    stage: "pre-seed, ₹8L revenue run-rate",
    sector: "B2B SaaS / retail tech",
    ask: "₹1.5 Cr seed round (use of funds not specified)",
  },
  dimensions: {
    story: { score: 5, assessment: "the deck reads as a feature list, not a story. there's no tension - the problem slide doesn't make me feel the shopkeeper's pain, so the solution lands flat. your best asset (40% month-on-month retention) appears on slide 11; a story-first deck would put proof right behind the solution." },
    clarity: { score: 6, assessment: "individual slides are readable but several try to make 3 points at once. slide 6 has 90+ words - an investor reads none of them. one idea per slide, headline as the takeaway." },
    evidence: { score: 5, assessment: "claims outrun proof. '10M kirana stores need this' is asserted, not shown. the 200 paying stores you do have are worth more than the 10M you don't - lead with what's real." },
    design: { score: 7, assessment: "clean and consistent. charts on slides 9-10 are too dense for a first read - simplify to one number per chart with a trend arrow." },
  },
  sections: [
    { name: "cover & one-liner", present: true, slideRef: "slide 1", score: 6, feedback: "the one-liner says what you build, not why it matters. 'inventory app for kiranas' describes the product; investors fund outcomes.", fix: "rewrite as outcome: 'helping 10M kirana stores stop losing ₹15,000/month to dead stock'." },
    { name: "problem", present: true, slideRef: "slide 2", score: 4, feedback: "describes the kirana market broadly instead of one shopkeeper's specific pain. no number on what the problem costs.", fix: "open with one store owner, one day, one loss. make the cost concrete - then zoom out to the market." },
    { name: "niche & wedge", present: true, slideRef: "slides 3, 8", score: 7, feedback: "credit ledger first, inventory second is a sharp, believable wedge - kiranas already track credit daily, so you enter through an existing habit.", fix: "say this explicitly on one slide. right now the wedge is implied across two slides instead of owned as your strategy." },
    { name: "solution", present: true, slideRef: "slides 3-4", score: 6, feedback: "clear feature walkthrough, but it never says why this wins vs. doing nothing (the real competitor for kiranas).", fix: "frame each feature as the pain it kills. cut the feature list from 8 to the 3 that drive retention." },
    { name: "product", present: true, slideRef: "slides 5-6", score: 6, feedback: "screenshots are clear but slide 6 tries to show 8 features at once with 90+ words of caption.", fix: "one screenshot, one caption, one takeaway per slide. show the 30-second daily flow a shopkeeper actually does." },
    { name: "why now", present: false, slideRef: null, score: 0, feedback: "nothing in the deck answers 'why does this win now and not five years ago?' - UPI adoption, cheap smartphones, and post-COVID digitisation of kiranas are your obvious tailwinds, and they're absent.", fix: "add one slide: 2-3 shifts that make this inevitable now, each with a number." },
    { name: "market size", present: true, slideRef: "slide 7", score: 2, feedback: "claims a $50B TAM with no source and no path from your 200 stores to that number.", fix: "build bottom-up: stores × subscription price × realistic penetration. a small credible number beats a big hollow one." },
    { name: "business model", present: true, slideRef: "slide 9", score: 5, feedback: "₹499/month subscription is stated, but nothing on pricing tiers, collection method, or why a kirana keeps paying in month 6.", fix: "add what triggers an upgrade and your current collection rate - kiranas churn on payment friction, not product." },
    { name: "unit economics", present: false, slideRef: null, score: 0, feedback: "no CAC, no LTV, no margin anywhere. at ₹499/month an investor immediately wonders what it costs you to acquire and serve one store - the deck is silent.", fix: "even rough numbers with stated assumptions beat silence: onboarding cost per store, monthly serving cost, payback months." },
    { name: "traction", present: true, slideRef: "slide 11", score: 7, feedback: "200 paying stores and 40% MoM retention is genuinely strong for pre-seed - but it's buried at the back of the deck.", fix: "move traction to slide 5, right after the solution. proof beats promises." },
    { name: "customer proof", present: true, slideRef: "slide 11", score: 4, feedback: "the retention number is there but no voice of the customer - no quote, no named store, no before/after.", fix: "add one shopkeeper's quote with their name and a number: 'I recovered ₹12,000 of dead stock in my first month.'" },
    { name: "competition", present: false, slideRef: null, score: 0, feedback: "no competition slide at all. investors read that as 'hasn't looked', never as 'has no competition' - Khatabook and OkCredit are one feature launch away.", fix: "add a 2x2 or table positioned on your wedge: credit + inventory together, built for the store not the supplier." },
    { name: "moat & defensibility", present: false, slideRef: null, score: 0, feedback: "nothing explains why this stays yours once it works. price is implied as the edge - price is not a moat, any funded competitor undercuts it.", fix: "name the moat you're building toward: per-store transaction data, switching costs of a migrated ledger, or supplier network effects." },
    { name: "go-to-market", present: true, slideRef: "slide 12", score: 5, feedback: "'field agents + referrals' is a real channel but there's no cost, conversion rate, or plan to make it repeatable beyond the founders' city.", fix: "show the math of one agent: stores visited → converted → monthly cost. then show how many agents ₹1.5 Cr buys." },
    { name: "team", present: true, slideRef: "slide 13", score: 7, feedback: "8 years in FMCG distribution plus a technical co-founder is a credible pairing for this exact problem.", fix: "cut the advisor logos; they dilute. give the two founders one proof-point line each instead." },
    { name: "founder-market fit", present: true, slideRef: "slide 13", score: 6, feedback: "the distribution background answers 'why you' implicitly, but the deck never says what you know about kiranas that nobody else in the room knows.", fix: "one line: the insight from 8 years in the field that competitors with more money don't have." },
    { name: "financials & projections", present: true, slideRef: "slide 10", score: 3, feedback: "₹100 Cr revenue in year 3 with no assumptions shown - investors don't believe the number and it costs credibility on every other slide.", fix: "show the driver tree: stores × price × churn. cut the hockey stick to 18-24 months of defensible math." },
    { name: "the ask", present: true, slideRef: "slide 14", score: 3, feedback: "says '₹1.5 Cr' but not what it buys, what milestones it hits, or how long it lasts.", fix: "add: 18-month runway → 2,000 stores → ₹1 Cr ARR → seed metrics. investors fund milestones, not time." },
    { name: "use of funds & milestones", present: false, slideRef: null, score: 0, feedback: "no breakdown of where ₹1.5 Cr goes. an unallocated ask reads as 'we'll figure it out' - the most expensive sentence in fundraising.", fix: "three lines: % to team, % to GTM, % to product - each tied to a milestone and a date." },
    { name: "vision & endgame", present: false, slideRef: null, score: 0, feedback: "the deck ends at the ask. nothing says what KiranaStack becomes if this works - the OS for 10M stores? the credit rail for informal retail? investors fund the big version.", fix: "close with one slide: the wedge today, the platform in 5 years, and the first expansion step in between." },
  ],
  strengths: [
    "real paying customers with strong retention - rare at pre-seed and your single best card",
    "founder-market fit is visible: 8 years in FMCG distribution shows up in the GTM slide",
    "the wedge is sharp - credit ledger first, inventory second, is a believable land-and-expand",
  ],
  improvements: [
    { title: "restructure around proof, not promise", severity: "critical", why: "the deck's order (problem → market → product → 6 slides later, traction) makes an investor form doubts before you answer them.", how: "new order: hook → problem → solution → traction → market → model → team → ask. your retention number should appear by slide 5." },
    { title: "quantify the problem", severity: "critical", why: "'kiranas struggle with inventory' is a category observation. no VC writes a cheque for a category observation.", how: "one number: 'the average kirana loses ₹15,000/month to dead stock and unpaid credit'. source it or derive it from your own customer data." },
    { title: "make the ask a plan", severity: "important", why: "an unspecified ₹1.5 Cr reads as 'we'll figure it out' - the most expensive sentence in fundraising.", how: "break it into 3 milestones with numbers and dates. show the metric this round unlocks for the next round." },
  ],
  redFlags: [
    "TAM slide claims $50B with no source and no bottom-up path - instant credibility hit",
    "no competition slide at all. investors read that as 'hasn't looked' - never as 'has no competition'",
    "financial projections show ₹100 Cr revenue in year 3 with no assumptions shown",
  ],
  investorQuestions: [
    "what does acquiring one store cost you today, and how does that change at 2,000 stores?",
    "why won't Khatabook or OkCredit add your inventory features next quarter?",
    "of your 200 stores, how many did the founders personally onboard vs. a repeatable channel?",
  ],
  rewrites: [
    { slide: "slide 1 - one-liner", current: "KiranaStack - smart inventory management for kirana stores", suggested: "KiranaStack - 200 kirana stores run on us daily to stop losing ₹15,000/month to dead stock", why: "leads with proof and a quantified outcome instead of a product category." },
    { slide: "slide 14 - the ask", current: "raising ₹1.5 Cr to accelerate growth", suggested: "raising ₹1.5 Cr for 18 months: 200 → 2,000 stores, ₹1 Cr ARR, and the retention data to price a seed round", why: "turns money-for-time into money-for-milestones - the framing investors actually underwrite." },
  ],
  actionPlan: [
    "reorder the deck: traction moves to slide 5, before market size",
    "rewrite the problem slide around one shopkeeper's quantified loss",
    "add a competition slide - 2x2 or table, positioned on your wedge",
    "rebuild the ask slide as milestones: what ₹1.5 Cr buys, by when, measured how",
    "cut slide 6's word count by 70% - headline carries the takeaway",
  ],
}

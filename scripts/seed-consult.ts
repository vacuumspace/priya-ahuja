import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { max } from "drizzle-orm"
import { services } from "../src/lib/db/schema"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema: { services } })

const items = [
  // ── Fundraise (tag: fundraising) ─────────────────────────────────────────
  {
    slug: "fundraise-strategy-call",
    title: "Fundraise Strategy Call",
    shortDescription: "A focused 45-min call to sharpen your fundraising thesis, narrative, and target investor list.",
    description: "We'll audit your current fundraising approach and build a sharp game plan — target cheque sizes, investor personas, warm intro paths, and the narrative that makes VCs lean in.",
    price: 500000, // ₹5,000 in paise
    durationMin: 45,
    type: "call",
    tag: "fundraising",
    highlights: ["Funding thesis review", "Investor persona mapping", "Warm intro strategy", "Narrative sharpening"],
    whoIsItFor: "Founders preparing for seed or Series A who want a second pair of eyes before they start pinging investors.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your pitch deck (optional)",
    deckLinkPlaceholder: "https://drive.google.com/...",
  },
  {
    slug: "pitch-deck-teardown",
    title: "Pitch Deck Teardown",
    shortDescription: "Async review of your pitch deck with written feedback on story, slides, and investor red flags.",
    description: "Send your deck, get back a detailed written teardown covering story arc, slide-by-slide feedback, numbers that need context, and the three things most likely to get you a pass.",
    price: 800000, // ₹8,000 in paise
    type: "report",
    tag: "fundraising",
    highlights: ["Story & structure critique", "Slide-by-slide notes", "Red flag identification", "Delivered in 48 hours"],
    whoIsItFor: "Founders who have a draft deck and want investor-level feedback before sending it out.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your pitch deck",
    deckLinkPlaceholder: "https://drive.google.com/...",
  },
  {
    slug: "investor-outreach-strategy",
    title: "Investor Outreach Strategy",
    shortDescription: "Build a targeted outreach plan with prioritised investor lists and message templates.",
    description: "We'll build your 30-name shortlist, prioritise by fit and conviction, and write outreach copy that doesn't sound like every other founder email.",
    price: 600000,
    durationMin: 45,
    type: "call",
    tag: "fundraising",
    highlights: ["Investor shortlist (30 names)", "Tier 1 / Tier 2 prioritisation", "Intro request templates", "Cold outreach copy"],
    whoIsItFor: "Founders who are ready to start reaching out but aren't sure where to begin or how to stand out.",
    acceptsDeckLink: false,
  },
  {
    slug: "term-sheet-walkthrough",
    title: "Term Sheet Walkthrough",
    shortDescription: "Understand every clause in your term sheet before you sign — what's standard, what's not, and what to push back on.",
    description: "We'll go through your term sheet line by line. I'll flag what's market, what's aggressive, and where you have room to negotiate without burning the relationship.",
    price: 750000,
    durationMin: 60,
    type: "call",
    tag: "fundraising",
    highlights: ["Clause-by-clause review", "Valuation & dilution modelling", "Negotiation tactics", "Founder-friendly terms checklist"],
    whoIsItFor: "Founders who have received a term sheet and want to understand it deeply before responding.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your term sheet (confidential)",
    deckLinkPlaceholder: "https://drive.google.com/...",
  },
  {
    slug: "fundraise-readiness-audit",
    title: "Fundraise Readiness Audit",
    shortDescription: "Find out if you're actually ready to raise — and what's missing before you hit the market.",
    description: "An honest assessment of your metrics, story, team, and timing. You'll leave knowing exactly what gaps to close before you start talking to investors — so you don't waste the round.",
    price: 400000,
    durationMin: 30,
    type: "call",
    tag: "fundraising",
    highlights: ["Traction & metrics review", "Story readiness check", "Timing assessment", "Gap list with priorities"],
    whoIsItFor: "Founders thinking about raising in the next 3–6 months who want an honest outside view.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your deck or one-pager (optional)",
    deckLinkPlaceholder: "https://drive.google.com/...",
  },

  // ── Startup (tags: strategy / deals / career / urgent) ────────────────────
  {
    slug: "startup-strategy-session",
    title: "Startup Strategy Session",
    shortDescription: "A sharp 45-min working session on your biggest strategic challenge right now.",
    description: "Bring your most pressing strategic question — go-to-market, pricing, positioning, pivot decision, competitor response. We'll work through it together and leave with a clear next move.",
    price: 500000,
    durationMin: 45,
    type: "call",
    tag: "strategy",
    highlights: ["Structured problem framing", "Options mapping", "Decision framework", "Clear action plan"],
    whoIsItFor: "Founders stuck on a strategic decision and wanting a sharp thinking partner for one session.",
    acceptsDeckLink: false,
  },
  {
    slug: "product-market-fit-review",
    title: "Product-Market Fit Review",
    shortDescription: "Diagnose where you are on the PMF curve and what signals you should be chasing.",
    description: "We'll look at your retention curves, activation funnel, qualitative signals, and the cohort data that actually tells you if you're onto something. You'll leave with a clear PMF thesis and the 2–3 experiments worth running next.",
    price: 600000,
    durationMin: 45,
    type: "call",
    tag: "strategy",
    highlights: ["Retention & activation audit", "Qualitative signal review", "PMF hypothesis", "Prioritised experiment list"],
    whoIsItFor: "Early-stage founders unsure whether they've found PMF or just noise.",
    acceptsDeckLink: false,
  },
  {
    slug: "deal-review-prep",
    title: "Deal Review & Due Diligence Prep",
    shortDescription: "Get your data room, metrics narrative, and DD responses investor-ready.",
    description: "We'll stress-test your numbers, identify the questions you'll get asked, and make sure your data room tells a coherent story — so due diligence becomes a confidence-builder, not a liability.",
    price: 700000,
    durationMin: 60,
    type: "call",
    tag: "deals",
    highlights: ["Data room review", "Metrics narrative prep", "Common DD question walkthrough", "Red flag mitigation"],
    whoIsItFor: "Founders in active fundraising who are about to enter or are mid-way through due diligence.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your data room or financials (confidential)",
    deckLinkPlaceholder: "https://drive.google.com/...",
  },
  {
    slug: "co-founder-hiring-advice",
    title: "Co-founder & Key Hire Advice",
    shortDescription: "Make your most important hiring decisions with a clear framework and outside perspective.",
    description: "Whether you're evaluating a co-founder, hiring your first engineer, or deciding between two VP candidates — we'll build the criteria, red flags list, and interview arc that helps you get this right.",
    price: 450000,
    durationMin: 45,
    type: "call",
    tag: "career",
    highlights: ["Role spec sharpening", "Evaluation criteria", "Red flags checklist", "Interview structure"],
    whoIsItFor: "Founders making a critical hire or co-founder decision in the next 30 days.",
    acceptsDeckLink: false,
  },
  {
    slug: "quick-fire-advice",
    title: "Quick-Fire Advice",
    shortDescription: "30 min, one question, real answers — for when you need clarity fast.",
    description: "Sometimes you just need 30 minutes with someone who's seen the movie before. Bring your one burning question and leave with a clear point of view.",
    price: 300000,
    durationMin: 30,
    type: "call",
    tag: "urgent",
    highlights: ["No prep required", "One focused question", "Clear POV delivered", "Same-week availability"],
    urgencyNote: "Same-week slots available",
    acceptsDeckLink: false,
  },

  // ── DM ────────────────────────────────────────────────────────────────────
  {
    slug: "ask-me-anything-dm",
    title: "Ask Me Anything — Priority DM",
    shortDescription: "Send me your question async. I'll reply with a detailed, thoughtful answer within 48 hours.",
    description: "Not every question needs a call. Send me a detailed message — deck, context, the question — and I'll reply with a proper written response within 48 hours. No fluff, no 30-second voice notes.",
    price: 200000,
    type: "dm",
    tag: "async",
    highlights: ["Async — no scheduling needed", "Detailed written reply", "48-hour turnaround", "Perfect for focused questions"],
    whoIsItFor: "Anyone who has a specific question and wants a thoughtful written answer without the overhead of a call.",
    acceptsDeckLink: true,
    deckLinkLabel: "Attach a deck or doc (optional)",
    deckLinkPlaceholder: "https://drive.google.com/...",
  },
]

async function seed() {
  const [{ maxOrder }] = await db.select({ maxOrder: max(services.order) }).from(services)
  let nextOrder = (maxOrder ?? 0) + 1

  for (const item of items) {
    const row = await db
      .insert(services)
      .values({
        slug: item.slug,
        title: item.title,
        shortDescription: item.shortDescription ?? null,
        description: item.description,
        price: item.price,
        originalPrice: null,
        durationMin: item.durationMin ?? null,
        type: item.type,
        tag: item.tag,
        highlights: item.highlights ?? [],
        whoIsItFor: item.whoIsItFor ?? null,
        acceptsDeckLink: item.acceptsDeckLink ?? false,
        deckLinkLabel: item.deckLinkLabel ?? null,
        deckLinkPlaceholder: item.deckLinkPlaceholder ?? null,
        urgencyNote: (item as any).urgencyNote ?? null,
        isActive: true,
        order: nextOrder++,
      })
      .returning({ id: services.id, slug: services.slug })

    console.log(`✓ ${row[0].slug}`)
  }

  console.log(`\nDone — ${items.length} services added.`)
}

seed().catch((err) => { console.error(err); process.exit(1) })

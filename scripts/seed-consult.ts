import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { services } from "../src/lib/db/schema"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema: { services } })

const items = [
  // ── Fundraise ────────────────────────────────────────────────────────────────
  {
    slug: "pitch-deck-teardown-discussion",
    title: "Pitch Deck Teardown & Discussion",
    shortDescription: "Live teardown of your pitch deck — slide by slide, story, numbers, and red flags, followed by a working discussion.",
    description: "We'll go through your deck together in real time. I'll break down what's working, what's killing your story, and where investors will check out. You'll leave with specific rewrites, not vague suggestions.",
    price: 800000,
    durationMin: 60,
    type: "call",
    tag: "fundraising",
    highlights: ["Slide-by-slide live critique", "Story & narrative review", "Numbers and traction framing", "Investor red flag identification", "Rewrite priorities"],
    whoIsItFor: "Founders with a draft deck ready to send out who want honest, investor-level feedback before hitting inboxes.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your pitch deck (required)",
    deckLinkPlaceholder: "https://drive.google.com/... or docsend link",
    deckLinkRequired: true,
  },
  {
    slug: "fundraise-strategy",
    title: "Fundraise Strategy",
    shortDescription: "A focused session to sharpen your fundraising thesis, investor targeting, and overall raise narrative.",
    description: "We'll audit your fundraising approach end to end — target cheque sizes, the right investor personas, warm intro paths, and the narrative that makes VCs lean in. You'll leave with a clear game plan.",
    price: 600000,
    durationMin: 45,
    type: "call",
    tag: "fundraising",
    highlights: ["Funding thesis sharpening", "Investor persona mapping", "Warm intro strategy", "Round size & valuation framing", "Raise narrative clarity"],
    whoIsItFor: "Founders preparing for seed or Series A who want a second pair of eyes before they start pinging investors.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your pitch deck (optional)",
    deckLinkPlaceholder: "https://drive.google.com/...",
  },
  {
    slug: "fundraise-readiness-due-diligence-prep",
    title: "Fundraise Readiness & Due Diligence Prep",
    shortDescription: "Find out if you're truly ready to raise — and stress-test your data room, metrics, and DD responses before investors do.",
    description: "An honest readiness assessment plus hands-on DD prep. We'll check your traction, story, team signals, and timing — then drill into your data room and the questions you'll face in diligence so nothing catches you off guard.",
    price: 700000,
    durationMin: 60,
    type: "call",
    tag: "fundraising",
    highlights: ["Raise readiness honest check", "Metrics & traction review", "Data room structure review", "Common DD question walkthrough", "Red flag mitigation"],
    whoIsItFor: "Founders thinking about raising in the next 3–6 months, or already in active fundraising heading into diligence.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your deck or data room (optional)",
    deckLinkPlaceholder: "https://drive.google.com/...",
  },
  {
    slug: "term-sheet-discussion",
    title: "Term Sheet Discussion",
    shortDescription: "Understand every clause in your term sheet before you sign — what's market, what's aggressive, and where to push back.",
    description: "We'll go through your term sheet line by line. I'll flag what's standard, what's founder-unfriendly, and where you have room to negotiate without burning the relationship. No legalese, just plain talk.",
    price: 750000,
    durationMin: 60,
    type: "call",
    tag: "fundraising",
    highlights: ["Clause-by-clause walkthrough", "Valuation & dilution modelling", "What's market vs. aggressive", "Negotiation tactics", "Founder-friendly terms checklist"],
    whoIsItFor: "Founders who've received a term sheet and want to understand it deeply before responding.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your term sheet (confidential)",
    deckLinkPlaceholder: "https://drive.google.com/...",
  },
  {
    slug: "pitch-deck-preparation",
    title: "Pitch Deck Preparation",
    shortDescription: "Build your pitch deck from scratch or restructure an existing one into a story investors actually want to fund.",
    description: "Whether you're starting from zero or have a draft, we'll structure the narrative, sequence the slides, and make sure every page earns its place. Covers story arc, key slides, numbers to lead with, and what to leave out.",
    price: 900000,
    durationMin: 60,
    type: "call",
    tag: "fundraising",
    highlights: ["Deck structure & story arc", "Slide sequence & flow", "Key metrics to lead with", "What investors look for per slide", "Before/after feedback"],
    whoIsItFor: "Founders building their first fundraising deck or reworking one that isn't getting traction.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your current deck or outline (optional)",
    deckLinkPlaceholder: "https://drive.google.com/...",
  },

  {
    slug: "financial-projection-preparation",
    title: "Financial Projection Preparation",
    shortDescription: "Build investor-ready financial projections that are defensible, credible, and tell the right story about your growth.",
    description: "We'll work through your financial model together — revenue assumptions, unit economics, cost structure, and the 3-year projections investors will poke holes in. You'll leave with a model that holds up under scrutiny and a clear narrative to go with it.",
    price: 850000,
    durationMin: 60,
    type: "call",
    tag: "fundraising",
    highlights: [
      "Revenue model & assumption review",
      "Unit economics deep-dive (CAC, LTV, payback)",
      "Cost structure & burn rate clarity",
      "3-year projection build or audit",
      "Investor-ready model narrative",
      "Sensitivity analysis walkthrough",
    ],
    whoIsItFor: "Founders preparing for fundraising who need a financial model that investors will actually believe — not just a spreadsheet with optimistic hockey sticks.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your financial model (optional)",
    deckLinkPlaceholder: "https://docs.google.com/spreadsheets/... or drive link",
  },

  // ── Startup ───────────────────────────────────────────────────────────────────
  {
    slug: "startup-idea-brainstorming",
    title: "Startup Idea Brainstorming",
    shortDescription: "Work through raw ideas, stress-test them, and find the ones actually worth building.",
    description: "A focused working session to sharpen your idea space. We'll stress-test your assumptions, identify the real problem you're solving, pressure-check the market, and figure out which ideas have founder-market fit vs. which are mirages.",
    price: 400000,
    durationMin: 45,
    type: "call",
    tag: "strategy",
    highlights: ["Idea stress-testing", "Problem vs. solution clarity", "Market size sanity check", "Founder-market fit assessment", "Prioritised shortlist of ideas"],
    whoIsItFor: "Early-stage founders with 2–5 ideas who want to think clearly about which one to commit to.",
    acceptsDeckLink: false,
  },
  {
    slug: "launch-gtm-strategy",
    title: "Launch & GTM Strategy",
    shortDescription: "Build a focused go-to-market plan — who to target first, how to reach them, and what a successful launch looks like.",
    description: "We'll map your ICP, define your first channel, set launch milestones, and figure out what 'working' looks like in the first 90 days. No theory — a plan you can actually execute.",
    price: 550000,
    durationMin: 45,
    type: "call",
    tag: "strategy",
    highlights: ["ICP definition", "Channel prioritisation", "Launch sequencing", "90-day milestones", "What 'traction' looks like for your business"],
    whoIsItFor: "Founders 4–8 weeks from launch who need a clear, executable GTM plan rather than a marketing deck.",
    acceptsDeckLink: false,
  },
  {
    slug: "product-review",
    title: "Product Review",
    shortDescription: "An honest outside look at your product — what's working, what's breaking the experience, and what to fix first.",
    description: "I'll review your product (live walkthrough or recorded demo) and give direct, prioritised feedback on UX, core loop, onboarding, and the features that are pulling focus away from what matters.",
    price: 500000,
    durationMin: 45,
    type: "call",
    tag: "strategy",
    highlights: ["Core loop evaluation", "Onboarding friction audit", "UX & flow review", "Feature prioritisation feedback", "Quick wins vs. deep fixes"],
    whoIsItFor: "Founders with a working product who want a sharp outside perspective before their next build sprint.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share a demo link or screen recording (optional)",
    deckLinkPlaceholder: "https://loom.com/... or product URL",
  },
  {
    slug: "branding-positioning-analysis",
    title: "Branding & Positioning Analysis",
    shortDescription: "Get clear on what you stand for, who you're for, and why you're different — so your positioning does the selling.",
    description: "We'll audit your current positioning, find the gaps between how you describe yourself and how your market perceives you, and build a sharper, more differentiated point of view that resonates with the right buyers.",
    price: 500000,
    durationMin: 45,
    type: "call",
    tag: "strategy",
    highlights: ["Positioning audit", "Differentiation clarity", "Messaging hierarchy", "ICP language alignment", "Tagline & category framing"],
    whoIsItFor: "Founders whose product is solid but whose messaging isn't converting — or who are entering a crowded market.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your current pitch/website/one-pager (optional)",
    deckLinkPlaceholder: "https://yoursite.com or drive link",
  },
  {
    slug: "startup-strategy",
    title: "Startup Strategy",
    shortDescription: "A working session on your biggest strategic challenge — go-to-market, pricing, pivot, or competitive response.",
    description: "Bring your most pressing strategic question and we'll work through it together. Structured problem framing, options mapping, and a clear point of view on the right move — not a list of considerations.",
    price: 500000,
    durationMin: 45,
    type: "call",
    tag: "strategy",
    highlights: ["Structured problem framing", "Options mapping", "Decision framework", "Competitive context", "Clear action plan"],
    whoIsItFor: "Founders stuck on a strategic decision and wanting a sharp thinking partner for one focused session.",
    acceptsDeckLink: false,
  },
  {
    slug: "product-development-discussion",
    title: "Product Development Discussion",
    shortDescription: "Work through your product roadmap, build vs. buy decisions, and what to ship next with a founder who's been there.",
    description: "We'll dig into your current roadmap, the bets you're making, and the tradeoffs between speed and quality. Whether it's prioritisation, hiring your first engineer, or deciding what not to build — this is the session for it.",
    price: 500000,
    durationMin: 45,
    type: "call",
    tag: "strategy",
    highlights: ["Roadmap prioritisation", "Build vs. buy decisions", "Velocity vs. quality tradeoffs", "First engineering hire timing", "What to cut from the backlog"],
    whoIsItFor: "Founders making key product decisions — especially early-stage teams figuring out what to build next.",
    acceptsDeckLink: true,
    deckLinkLabel: "Share your roadmap or product spec (optional)",
    deckLinkPlaceholder: "https://notion.so/... or drive link",
  },
]

async function seed() {
  // Clear all existing services first
  await db.delete(services)
  console.log("Cleared existing services.")

  let order = 1
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
        urgencyNote: null,
        isActive: true,
        order: order++,
      })
      .returning({ id: services.id, slug: services.slug })

    console.log(`✓ ${row[0].slug}`)
  }

  console.log(`\nDone — ${items.length} services added.`)
}

seed().catch((err) => { console.error(err); process.exit(1) })

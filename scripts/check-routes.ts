/**
 * Health check script - verifies all public routes return 200.
 * Run with: npx tsx scripts/check-routes.ts
 * Make sure the dev server (or prod) is running at BASE_URL.
 */

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { services } from "../src/lib/db/schema"
import { eq } from "drizzle-orm"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const BASE_URL = process.env.HEALTH_CHECK_BASE_URL || "http://localhost:3000"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

// ── Static routes ────────────────────────────────────────────────────────────
const STATIC_ROUTES = [
  "/",
  "/connect",
  "/blog",
  "/fundraise",
  "/fundraise/blog",
  "/fundraise/angel-investors",
  "/fundraise/tools",
  "/fundraise/tools/fundability-score",
  "/fundraise/tools/pitch-deck-analyser",
  "/fundraise/templates",
  "/startup",
  "/startup/blog",
  "/startup/ideas",
  "/startup/ideas/tech",
  "/startup/ideas/d2c",
  "/startup/tools",
  "/startup/tools/idea-score",
  "/startup/templates",
  "/templates",
  "/tools",
  "/tools/startup-score",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/profile",
  "/services/accounting",
  "/services/tech",
  "/services/branding",
  "/services/incorporation",
]

// ── Blog slugs (from blog-data.ts) ───────────────────────────────────────────
const BLOG_SLUGS = [
  "vc-back-channel-reference-checks",
  "cofounder-breakup-legal-playbook",
  "second-investor-matters-more",
  "post-raise-quiet-period",
  "revenue-based-financing-india",
  "board-meeting-what-vcs-actually-want",
  "what-you-dont-build-startup-focus",
  "founder-secondary-sales",
  "first-ten-hires-culture-debt",
  "seed-to-series-a-valley",
  "series-how-to-pick-a-startup-idea",
  "series-finding-the-right-cofounder",
  "series-how-to-build-an-mvp",
  "series-first-gtm-plan",
  "series-acquiring-first-100-customers",
  "series-product-roadmap-early-stage",
  "series-market-positioning",
  "series-startup-metrics-that-matter",
  "series-what-is-product-market-fit",
  "series-fundraising-for-first-time-founders",
  "series-how-to-name-your-startup",
  "how-to-build-a-pitch-deck",
  "investor-update-mis-template",
  "how-to-raise-first-round-india",
  "safe-vs-equity-india-founders",
  "startup-valuation-pre-money-india",
  "angel-vs-vc-which-investor-india",
  "due-diligence-checklist-startup",
  "term-sheet-explained-india",
  "building-investor-relationships-before-raise",
  "cap-table-management-founders",
  "cofounder-agreement-complete-guide",
  "startup-incorporation-legal-structure-india",
  "esop-employee-stock-options-startup-india",
  "startup-financial-basics-burn-runway",
  "building-founding-team-culture-early",
  "how-to-find-angel-investors-india",
  "startup-idea-validation-checklist",
  "when-to-raise-vs-bootstrap-india",
  "common-fundraising-mistakes-first-time-founders",
  "safe-vs-ccps-india-founders",
  "what-vcs-look-for-pitch-deck",
  "pre-seed-fundraising-india-2025",
  "startup-idea-generation-framework",
]

// ── Template slugs (from templates-data.ts) ──────────────────────────────────
const TEMPLATE_SLUGS = [
  "investor-outreach-templates",
  "fundraising-checklist",
  "first-10-customers-playbook",
  "hiring-your-first-5",
  "product-spec-templates",
  "growth-experiment-tracker",
  "founder-weekly-operating-system",
  "term-sheet-template",
  "valuation-methodologies",
  "transaction-documents",
  "data-bible",
  "financial-model-general",
  "pitch-deck-template",
  "nda-fundraise",
  "kmp-agreement",
  "employee-agreement",
  "gtm-plan",
  "startup-idea-analysis",
  "market-positioning",
  "value-proposition",
  "employee-offer-letter",
  "founders-agreement",
  "nda-startup",
  "investor-update-email",
  "cap-table-template",
]

async function checkUrl(path: string): Promise<{ path: string; status: number; ok: boolean }> {
  const url = `${BASE_URL}${path}`
  try {
    const res = await fetch(url, { redirect: "follow" })
    return { path, status: res.status, ok: res.status < 400 }
  } catch (err) {
    return { path, status: 0, ok: false }
  }
}

async function main() {
  console.log(`\nChecking routes against ${BASE_URL}\n`)

  // Verify server is reachable before running the full check
  try {
    await fetch(`${BASE_URL}/`, { signal: AbortSignal.timeout(5000) })
  } catch {
    console.error(`❌  Cannot reach ${BASE_URL} - is the dev server running?\n    Start it with: npm run dev\n`)
    process.exit(1)
  }

  // Build route list
  const routes: string[] = [...STATIC_ROUTES]

  // Add blog routes
  for (const slug of BLOG_SLUGS) routes.push(`/blog/${slug}`)

  // Add template routes
  for (const slug of TEMPLATE_SLUGS) routes.push(`/templates/${slug}`)

  // Fetch active service slugs from DB
  console.log("Fetching active services from DB...")
  const activeServices = await db
    .select({ slug: services.slug })
    .from(services)
    .where(eq(services.isActive, true))

  if (activeServices.length === 0) {
    console.warn("⚠  No active services found in DB - /connect/[slug] routes skipped.\n")
  } else {
    for (const { slug } of activeServices) routes.push(`/connect/${slug}`)
  }

  console.log(`Checking ${routes.length} routes...\n`)

  // Check all routes with concurrency limit
  const CONCURRENCY = 10
  const results: { path: string; status: number; ok: boolean }[] = []

  for (let i = 0; i < routes.length; i += CONCURRENCY) {
    const batch = routes.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.all(batch.map(checkUrl))
    results.push(...batchResults)
    process.stdout.write(`  ${Math.min(i + CONCURRENCY, routes.length)}/${routes.length} checked...\r`)
  }

  console.log("\n")

  const failed = results.filter((r) => !r.ok)
  const passed = results.filter((r) => r.ok)

  if (failed.length === 0) {
    console.log(`✅  All ${passed.length} routes returned 2xx/3xx.\n`)
  } else {
    console.log(`✅  ${passed.length} routes OK`)
    console.log(`❌  ${failed.length} routes FAILED:\n`)
    for (const r of failed) {
      const status = r.status === 0 ? "ERR" : r.status
      console.log(`  [${status}]  ${r.path}`)
    }
    console.log()
    process.exit(1)
  }
}

main().catch((err) => { console.error(err); process.exit(1) })

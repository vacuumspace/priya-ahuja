/**
 * Weekly grant refresh script.
 * Run via GitHub Actions every Monday.
 * Fetches live data from sources that have accessible APIs/feeds,
 * merges with the curated base data, and writes back to grants-data.json.
 *
 * Usage: node scripts/refresh-grants.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = join(__dirname, "../src/lib/grants-data.json")

// ── Helpers ──────────────────────────────────────────────────────────────────

async function safeFetch(url, opts = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; grants-bot/1.0)",
        Accept: "application/json, text/xml, text/html",
        ...opts.headers,
      },
      signal: AbortSignal.timeout(12000),
      ...opts,
    })
    return res
  } catch {
    return null
  }
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

// ── Source 1: Grants.gov SEARCH API (US federal grants for tech/startups) ───
// Endpoint documented at https://www.grants.gov/web/grants/search-grants.html
async function fetchGrantsGov() {
  console.log("[grants.gov] Fetching US federal grants...")
  const res = await safeFetch(
    "https://apply07.grants.gov/grantsws/rest/opportunities/search/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keyword: "startup innovation technology small business",
        oppStatuses: "posted",
        rows: 20,
        sortBy: "openDate|desc",
      }),
    }
  )
  if (!res?.ok) {
    console.log("[grants.gov] FAILED — skipping")
    return []
  }
  const data = await res.json().catch(() => null)
  if (!data?.oppHits) {
    console.log("[grants.gov] No results")
    return []
  }

  const items = data.oppHits
    .filter((g) => g.title && g.agencyName)
    .map((g) => ({
      slug: slugify(`${g.title}-${g.agencyName}`),
      title: g.title,
      org: g.agencyName,
      sector: "General",
      amountLabel: g.awardCeiling
        ? `Up to $${Number(g.awardCeiling).toLocaleString()}`
        : null,
      deadlineLabel: g.closeDate
        ? `Deadline: ${g.closeDate}`
        : "Check portal for deadline",
      description: g.synopsis
        ? g.synopsis.slice(0, 300)
        : `US federal grant from ${g.agencyName}.`,
      eligibility:
        "Open to US-registered entities and foreign organizations in some cases. Check the full listing for eligibility details.",
      applyUrl: `https://www.grants.gov/search-results-detail/${g.id}`,
      source: "grants.gov",
      _live: true,
    }))

  console.log(`[grants.gov] Found ${items.length} grants`)
  return items
}

// ── Source 2: PIB RSS — filter startup/DPIIT/MSME press releases ─────────────
async function fetchPIBRSS() {
  console.log("[PIB RSS] Fetching Indian govt startup announcements...")
  const res = await safeFetch(
    "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3"
  )
  if (!res?.ok) {
    console.log("[PIB RSS] FAILED — skipping")
    return []
  }
  const xml = await res.text().catch(() => "")
  if (!xml) return []

  // Parse <item> blocks from RSS
  const items = []
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g)
  for (const match of itemMatches) {
    const block = match[1]
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]>/)?.[1]?.trim()
    const link = block.match(/<link>(.*?)<\/link>/)?.[1]?.trim()
    const desc = block.match(/<description><!\[CDATA\[(.*?)\]\]>/)?.[1]
      ?.replace(/<[^>]+>/g, "")
      ?.trim()
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim()

    if (!title || !link) continue

    // Only keep startup/DPIIT/grant/scheme/MSME related items
    const keywords = /startup|grant|scheme|dpiit|msme|fund|innovation|incubat/i
    if (!keywords.test(title) && !keywords.test(desc ?? "")) continue

    items.push({
      slug: slugify(`pib-${title}`),
      title,
      org: "Press Information Bureau / Govt of India",
      sector: "General",
      amountLabel: null,
      deadlineLabel: pubDate
        ? `Announced: ${new Date(pubDate).toLocaleDateString("en-IN")}`
        : "Recent announcement",
      description: desc
        ? desc.slice(0, 300)
        : "Government announcement related to startup funding or schemes.",
      eligibility:
        "Refer to the official announcement for eligibility criteria and application process.",
      applyUrl: link,
      source: "pib-rss",
      _live: true,
      _news: true, // flag as news item, not a direct grant
    })
  }

  console.log(`[PIB RSS] Found ${items.length} relevant items`)
  return items
}

// ── Merge logic ───────────────────────────────────────────────────────────────

function mergeGrants(base, live) {
  const map = new Map()

  // Base curated data always wins for slug conflicts
  for (const g of base) {
    map.set(g.slug, { ...g, _source: "curated" })
  }

  // Add live items only if slug doesn't already exist in curated
  for (const g of live) {
    if (!map.has(g.slug)) {
      map.set(g.slug, { ...g, _source: "live" })
    }
  }

  return Array.from(map.values())
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Grant Refresh Script ===")
  console.log(`Date: ${new Date().toISOString()}\n`)

  // Load existing/base data
  let base = []
  if (existsSync(OUTPUT)) {
    try {
      const raw = JSON.parse(readFileSync(OUTPUT, "utf-8"))
      base = raw.grants ?? []
      console.log(`Loaded ${base.length} existing grants from JSON\n`)
    } catch {
      console.log("Could not read existing JSON — starting fresh\n")
    }
  }

  // Fetch live sources in parallel
  const [grantsGovItems, pibItems] = await Promise.all([
    fetchGrantsGov(),
    fetchPIBRSS(),
  ])

  const liveItems = [...grantsGovItems, ...pibItems]
  console.log(`\nLive items fetched: ${liveItems.length}`)

  // Merge
  const merged = mergeGrants(base, liveItems)
  console.log(`Total after merge: ${merged.length} grants`)

  // Write output
  const output = {
    lastRefreshed: new Date().toISOString(),
    totalCount: merged.length,
    grants: merged,
  }

  writeFileSync(OUTPUT, JSON.stringify(output, null, 2))
  console.log(`\n✅ Written to ${OUTPUT}`)

  // Summary
  const bySource = merged.reduce((acc, g) => {
    const s = g._source ?? "unknown"
    acc[s] = (acc[s] ?? 0) + 1
    return acc
  }, {})
  console.log("Sources:", bySource)
}

main().catch((e) => {
  console.error("Script failed:", e)
  process.exit(1)
})

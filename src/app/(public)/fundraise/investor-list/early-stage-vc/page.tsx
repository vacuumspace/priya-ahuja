export const dynamic = "force-dynamic"

import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"
import InvestorListClient, { type ListConfig } from "../_components/InvestorListClient"
import { getEarlyStageVCFirms, getEarlyStageVCTeam } from "@/lib/read-investor-xlsx"

const SLUG = "early-stage-vc-list"
const PAGE_SIZE = 10

const BASE_CONFIG: Omit<ListConfig, "indianCount" | "globalCount"> = {
  listType: "early-stage-vc",
  slug: SLUG,
  title: "early stage vc<br/>contact details",
  subtitle: "Global and Indian VC firms actively investing in startups. Firm details and team contacts, all in one place.",
  price: "₹4,999",
  breadcrumb: "fundraise · investor list · early stage vc",
  firmsLabel: "VC firms",
  freePages: 4,
  teamLabel: "team contacts",
  description: [
    "1,000 early stage VC firms globally, including Indian VCs and international funds actively writing cheques in Indian startups.",
    "Each firm entry includes website, LinkedIn, domain focus, country, and direct email IDs where available.",
    "The team contacts sheet has 26,000 individual partners, associates, and analysts with their direct LinkedIn and emails.",
    "Covers investors writing pre-seed, seed, and Series A cheques in 2024-26 across fintech, SaaS, D2C, deeptech, healthtech, edtech, climate, and more.",
    "One-time payment. No subscriptions, no expiry. Yours forever including future refreshes.",
    "Most contacts have both LinkedIn and email. Some have only one linkedin or email id.",
    "We verify details to the best of our ability and keep improving this list over time. That is why access is given here directly and not as a download, so we can keep updating what you see. Our intention is to genuinely help founders.",
  ],
  whyPaid: "Curating and maintaining this list takes real effort. Keeping it paid ensures it stays high quality and goes to founders who genuinely need it.",
}

export default async function EarlyStageVCPage() {
  const session = await auth()
  const userEmail = session?.user?.email ?? null

  const [productRow, purchaseCheck] = await Promise.all([
    db.select({ price: digitalProducts.price }).from(digitalProducts).where(eq(digitalProducts.slug, SLUG)).limit(1),
    userEmail && !isAdmin(userEmail)
      ? db.select({ id: purchases.id }).from(purchases)
          .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
          .where(and(eq(purchases.userEmail, userEmail), eq(digitalProducts.slug, SLUG), isNotNull(purchases.downloadToken)))
          .limit(1)
      : Promise.resolve(null),
  ])

  const isPaid = isAdmin(userEmail) || !!(Array.isArray(purchaseCheck) && purchaseCheck[0])
  const dbPrice = productRow[0]?.price ?? 499900
  const displayPrice = "₹" + (dbPrice / 100).toLocaleString("en-IN")

  const allFirms = getEarlyStageVCFirms()
  const allTeam  = getEarlyStageVCTeam()

  const indianCount = allFirms.filter(f => f.country?.toLowerCase().includes("india")).length
  const globalCount = allFirms.length - indianCount

  const CONFIG: ListConfig = { ...BASE_CONFIG, indianCount, globalCount }

  const firmsFirstPage = allFirms.slice(0, PAGE_SIZE).map(r => ({
    ...r,
    linkedin: isPaid ? r.linkedin : "",
    emails:   isPaid ? r.emails   : [],
    phone:    isPaid ? r.phone    : "",
  }))

  const teamFirstPage = allTeam.slice(0, PAGE_SIZE).map(r => ({
    ...r,
    linkedin: isPaid ? r.linkedin : "",
    emails:   isPaid ? r.emails   : [],
  }))

  return (
    <InvestorListClient
      config={{ ...CONFIG, price: displayPrice }}
      isPaid={isPaid}
      isAuthenticated={!!userEmail}
      firmsFirstPage={firmsFirstPage}
      teamFirstPage={teamFirstPage}
      firmsTotal={allFirms.length}
      teamTotal={allTeam.length}
      userEmail={userEmail}
      userName={session?.user?.name ?? null}
    />
  )
}

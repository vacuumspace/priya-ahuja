export const dynamic = "force-dynamic"

import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"
import InvestorListClient, { type ListConfig } from "../_components/InvestorListClient"
import { getIncubatorFirms, getIncubatorTeam } from "@/lib/read-investor-xlsx"

const SLUG = "incubators-list"
const PAGE_SIZE = 10

const CONFIG: ListConfig = {
  listType: "incubators",
  slug: SLUG,
  title: "incubator &amp;<br/>accelerator list",
  subtitle: "Indian incubators and accelerators actively supporting startups. Program details and team contacts.",
  price: "₹999",
  breadcrumb: "fundraise · investor list · incubator & accelerator",
  firmsLabel: "programs",
  freePages: 2,
  teamLabel: "team contacts",
  description: [
    "230 incubators and accelerators in India actively running programs for early-stage startups.",
    "Each entry includes program website, LinkedIn, domain focus, location, and direct email IDs where available.",
    "The team contacts sheet has 5,600 mentors, program managers, and directors with their direct LinkedIn and emails.",
    "Covers government incubators, university programs, corporate accelerators, and independent cohort-based programs across sectors.",
    "One-time payment. No subscriptions, no expiry. Yours forever including future refreshes.",
    "Most contacts have both LinkedIn and email. Some have only one linkedin or email id.",
    "We verify details to the best of our ability and keep improving this list over time. That is why access is given here directly and not as a download, so we can keep updating what you see. Our intention is to genuinely help founders.",
  ],
  whyPaid: "Curating and maintaining this list takes real effort. Keeping it paid ensures it stays high quality and goes to founders who genuinely need it.",
}

export default async function IncubatorsPage() {
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
  const dbPrice = productRow[0]?.price ?? 99900
  const displayPrice = "₹" + (dbPrice / 100).toLocaleString("en-IN")

  const allFirms = getIncubatorFirms()
  const allTeam  = getIncubatorTeam()

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
      firmsLinkedinCount={allFirms.filter(f => f.linkedin).length}
      firmsEmailCount={allFirms.filter(f => f.emails?.length > 0).length}
      teamLinkedinCount={allTeam.filter(t => t.linkedin).length}
      teamEmailCount={allTeam.filter(t => t.emails?.length > 0).length}
      userEmail={userEmail}
      userName={session?.user?.name ?? null}
    />
  )
}

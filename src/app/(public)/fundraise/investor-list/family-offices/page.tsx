export const dynamic = "force-dynamic"

import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"
import InvestorListClient, { type ListConfig } from "../_components/InvestorListClient"
import { getFamilyOfficeFirms, getFamilyOfficeTeam } from "@/lib/read-investor-xlsx"

const SLUG = "family-offices-list"
const PAGE_SIZE = 10

const CONFIG: ListConfig = {
  listType: "family-offices",
  slug: SLUG,
  title: "family office<br/>contact details",
  subtitle: "Family offices deploying capital into Indian startups. Office details and decision-maker contacts.",
  price: "₹2,999",
  breadcrumb: "fundraise · investor list · family offices",
  firmsLabel: "family offices",
  freePages: 2,
  teamLabel: "team contacts",
  description: [
    "160 family offices that are actively investing in Indian startups.",
    "Each entry includes country, website, LinkedIn, domain focus, and direct email IDs where available.",
    "The team contacts sheet has 700 individual contacts including family principals, CIOs, and investment managers.",
    "Family offices are often underutilised by founders. They move faster than VCs, write flexible cheques, and many have deep domain networks.",
    "One-time payment. No subscriptions, no expiry. Yours forever including future refreshes.",
    "Most contacts have both LinkedIn and email. Some have only one linkedin or email id.",
    "We verify details to the best of our ability and keep improving this list over time. That is why access is given here directly and not as a download, so we can keep updating what you see. Our intention is to genuinely help founders.",
  ],
  whyPaid: "Curating and maintaining this list takes real effort. Keeping it paid ensures it stays high quality and goes to founders who genuinely need it.",
}

export default async function FamilyOfficesPage() {
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
  const dbPrice = productRow[0]?.price ?? 299900
  const displayPrice = "₹" + (dbPrice / 100).toLocaleString("en-IN")

  const allFirms = getFamilyOfficeFirms()
  const allTeam  = getFamilyOfficeTeam()

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

export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"
import AngelInvestorClient from "@/app/(public)/fundraise/angel-investors/AngelInvestorClient"
import { angelInvestorsData } from "@/lib/angel-investors-data"

const SLUG = "angel-investor-list"
const PAGE_SIZE = 10

export const metadata: Metadata = {
  title: "Angel Investor List India - Contacts & LinkedIn",
  description: "Verified angel investor contact list for Indian startups - LinkedIn profiles and direct emails for angels actively writing pre-seed and seed cheques.",
  keywords: ["angel investor list India", "angel investor contacts", "angel investors India LinkedIn", "pre-seed angel investors India"],
  alternates: { canonical: "https://priyaahuja.in/fundraise/investor-list/angel-investors" },
  openGraph: {
    title: "Angel Investor List India - Contacts & LinkedIn | Priya Ahuja",
    description: "Verified angel investor contact list for Indian startups - LinkedIn profiles and direct emails for angels actively writing pre-seed and seed cheques.",
    url: "https://priyaahuja.in/fundraise/investor-list/angel-investors",
  },
}

export default async function AngelInvestorsPage() {
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

  const firstPage = angelInvestorsData.slice(0, PAGE_SIZE).map(r => ({
    ...r,
    linkedin: isPaid ? r.linkedin : "",
    emails:   isPaid ? r.emails   : [] as string[],
  }))

  return (
    <AngelInvestorClient
      isPaid={isPaid}
      isAuthenticated={!!userEmail}
      firstPage={firstPage}
      total={angelInvestorsData.length}
      linkedinCount={angelInvestorsData.filter(r => r.linkedin).length}
      emailCount={angelInvestorsData.filter(r => r.emails?.length > 0).length}
      userEmail={userEmail}
      userName={session?.user?.name ?? null}
      displayPrice={displayPrice}
    />
  )
}

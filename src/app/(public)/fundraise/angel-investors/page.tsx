import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts, angelInvestors } from "@/lib/db/schema"
import { eq, and, isNotNull, count } from "drizzle-orm"
import Script from "next/script"
import AngelInvestorClient from "./AngelInvestorClient"

const SLUG = "angel-investor-list"
const PAGE_SIZE = 10

export default async function AngelInvestorsPage() {
  const session = await auth()
  const userEmail = session?.user?.email ?? null

  // Check if user has a completed purchase
  let isPaid = false
  if (userEmail) {
    const [row] = await db
      .select({ id: purchases.id })
      .from(purchases)
      .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(and(
        eq(purchases.userEmail, userEmail),
        eq(digitalProducts.slug, SLUG),
        isNotNull(purchases.downloadToken),
      ))
      .limit(1)
    isPaid = !!row
  }

  // Fetch first page — strip sensitive columns for non-paying users
  const firstPage = isPaid
    ? await db.select().from(angelInvestors).limit(PAGE_SIZE).offset(0)
    : await db
        .select({
          id:       angelInvestors.id,
          sno:      angelInvestors.sno,
          name:     angelInvestors.name,
          city:     angelInvestors.city,
          state:    angelInvestors.state,
          country:  angelInvestors.country,
          linkedin: angelInvestors.linkedin,
          emails:   angelInvestors.emails,
          createdAt: angelInvestors.createdAt,
        })
        .from(angelInvestors)
        .limit(PAGE_SIZE)
        .offset(0)

  // For non-paying users, blank out sensitive columns server-side
  const safeFirstPage = isPaid
    ? firstPage
    : firstPage.map(r => ({ ...r, linkedin: "", emails: [] as string[] }))

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(angelInvestors)

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <AngelInvestorClient
        isPaid={isPaid}
        isAuthenticated={!!userEmail}
        firstPage={safeFirstPage}
        total={total}
        userEmail={userEmail}
        userName={session?.user?.name ?? null}
      />
    </>
  )
}

import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"
import AngelInvestorClient from "./AngelInvestorClient"
import { angelInvestorsData } from "@/lib/angel-investors-data"

const SLUG = "angel-investor-list"
const PAGE_SIZE = 10

export default async function AngelInvestorsPage() {
  const session = await auth()
  const userEmail = session?.user?.email ?? null

  // Check if user has a completed purchase (admin always bypasses)
  let isPaid = isAdmin(userEmail)
  if (!isPaid && userEmail) {
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
        userEmail={userEmail}
        userName={session?.user?.name ?? null}
      />
  )
}

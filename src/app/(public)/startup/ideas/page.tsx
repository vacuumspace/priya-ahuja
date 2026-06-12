import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"
import Script from "next/script"
import { startupIdeas, STARTUP_IDEAS_SLUG } from "@/lib/startup-ideas-data"
import StartupIdeasClient from "./StartupIdeasClient"

export default async function StartupIdeasPage() {
  const session = await auth()
  const userEmail = session?.user?.email ?? null

  let isPaid = isAdmin(userEmail)
  if (!isPaid && userEmail) {
    const [row] = await db
      .select({ id: purchases.id })
      .from(purchases)
      .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(and(
        eq(purchases.userEmail, userEmail),
        eq(digitalProducts.slug, STARTUP_IDEAS_SLUG),
        isNotNull(purchases.downloadToken),
      ))
      .limit(1)
    isPaid = !!row
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <StartupIdeasClient
        isPaid={isPaid}
        isAuthenticated={!!userEmail}
        ideas={startupIdeas}
        userEmail={userEmail}
        userName={session?.user?.name ?? null}
      />
    </>
  )
}

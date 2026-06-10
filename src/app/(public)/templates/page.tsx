import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { templates } from "@/lib/templates-data"
import TemplateCardAuth from "@/components/templates/TemplateCardAuth"
import Script from "next/script"
import SignInOptions from "@/components/SignInOptions"

export const metadata = {
  title: "Templates — Priya Ahuja",
  description: "Legal, financial, and business document templates for Indian startups. One-time purchase, instant access.",
}

export default async function TemplatesPage() {
  const session = await auth()
  const userEmail = session?.user?.email ?? null

  // Fetch all purchases for this user (slug → token map)
  const purchaseMap: Record<string, string> = {}
  if (userEmail) {
    const rows = await db
      .select({ slug: digitalProducts.slug, token: purchases.downloadToken })
      .from(purchases)
      .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(eq(purchases.userEmail, userEmail))

    for (const row of rows) {
      if (row.slug && row.token) {
        purchaseMap[row.slug] = row.token
      }
    }
  }

  const fundraiseTemplates = templates.filter((t) => t.category === "fundraise")
  const startupTemplates = templates.filter((t) => t.category === "startup")

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-cream">
        <div className="px-4 md:px-10 pt-10 pb-16 max-w-3xl">
          <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-3">templates</p>
          <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-800 text-ink leading-[0.95] tracking-tight mb-4">
            ready-to-use<br />documents.
          </h1>
          <p className="font-sans text-sm text-ink/55 leading-relaxed mb-2">
            legal, financial, and business templates built for Indian startups. one-time purchase — view instantly, access forever from your history.
          </p>

          {!userEmail && (
            <div className="mt-4 mb-8 bg-peach/30 border border-peach-dark/20 rounded-xl px-4 py-4">
              <p className="font-sans text-xs text-ink/70 mb-3">sign in to track your purchases and access them from any device.</p>
              <SignInOptions callbackUrl="/templates" compact />
            </div>
          )}

          {/* Fundraise templates */}
          <section className="mt-10 mb-12">
            <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">fundraise</p>
            <div className="flex flex-col gap-3">
              {fundraiseTemplates.map((t) => (
                <TemplateCardAuth
                  key={t.slug}
                  product={t}
                  isAuthenticated={!!userEmail}
                  purchaseToken={purchaseMap[t.slug]}
                  userEmail={userEmail ?? undefined}
                />
              ))}
            </div>
          </section>

          {/* Startup templates */}
          <section>
            <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">startup</p>
            <div className="flex flex-col gap-3">
              {startupTemplates.map((t) => (
                <TemplateCardAuth
                  key={t.slug}
                  product={t}
                  isAuthenticated={!!userEmail}
                  purchaseToken={purchaseMap[t.slug]}
                  userEmail={userEmail ?? undefined}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

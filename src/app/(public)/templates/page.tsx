import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { templates } from "@/lib/templates-data"
import TemplateCardAuth from "@/components/templates/TemplateCardAuth"
import Script from "next/script"

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
            <div className="mt-4 mb-8 flex items-center gap-3 bg-peach/30 border border-peach-dark/20 rounded-xl px-4 py-3">
              <p className="font-sans text-xs text-ink/70 flex-1">sign in to track your purchases and access them from any device.</p>
              <form method="POST" action="/api/auth/signin/google">
                <input type="hidden" name="callbackUrl" value="/templates" />
                <button type="submit" className="inline-flex items-center gap-1.5 bg-ink text-cream text-xs font-sans font-semibold px-3 py-1.5 rounded-lg hover:bg-ink/80 transition-colors whitespace-nowrap">
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  sign in
                </button>
              </form>
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

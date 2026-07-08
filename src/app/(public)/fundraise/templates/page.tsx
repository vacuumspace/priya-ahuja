import type { Metadata } from "next"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getTemplatesByCategory } from "@/lib/templates-data"
import TemplatesGrid from "@/components/templates/TemplatesGrid"
import { CustomRequestForm } from "@/components/CustomRequestForm"

const products = getTemplatesByCategory("fundraise")

export const metadata: Metadata = {
  title: "Fundraise Templates & Checklists",
  description: "Investor pitch deck templates, fundraise checklists, and guides built from real deal experience - practical tools for founders raising capital.",
  keywords: ["fundraise templates", "pitch deck template India", "investor checklist", "fundraising guide founders"],
  alternates: { canonical: "https://priyaahuja.in/fundraise/templates" },
  openGraph: {
    title: "Fundraise Templates & Checklists | Priya Ahuja",
    description: "Investor pitch deck templates, fundraise checklists, and guides built from real deal experience.",
    url: "https://priyaahuja.in/fundraise/templates",
  },
}

export default async function FundraiseTemplatesPage() {
  const session = await auth()
  const userEmail = session?.user?.email ?? null

  const purchaseMap: Record<string, string> = {}
  if (isAdmin(userEmail)) {
    for (const p of products) purchaseMap[p.slug] = "admin"
  } else if (userEmail) {
    const rows = await db
      .select({ slug: digitalProducts.slug, token: purchases.downloadToken })
      .from(purchases)
      .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(eq(purchases.userEmail, userEmail))
    for (const row of rows) {
      if (row.slug && row.token) purchaseMap[row.slug] = row.token
    }
  }

  return (
    <div className="min-h-screen bg-cream">
        <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
          <span>fundraise · digital downloads</span>
          <span>{products.filter((p) => !p.comingSoon).length} available</span>
        </div>

        <div className="px-4 md:px-10 pt-12 pb-8">
          <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
            practical tools,
            <br />
            not fluff
          </h1>
          <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
            templates, checklists, and guides you can use immediately, built from real deal experience.
          </p>
        </div>

        <TemplatesGrid
          products={products}
          purchaseMap={purchaseMap}
          isAuthenticated={!!userEmail}
          userEmail={userEmail ?? undefined}
        />

        <div className="px-4 md:px-10 pb-16">
          <div className="mt-4 text-center py-8 border-t border-border">
            <CustomRequestForm source="fundraise-templates" userEmail={userEmail ?? undefined} />
          </div>
        </div>
      </div>
  )
}

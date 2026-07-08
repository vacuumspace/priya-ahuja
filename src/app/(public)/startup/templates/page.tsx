import type { Metadata } from "next"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getTemplatesByCategory } from "@/lib/templates-data"
import TemplatesGrid from "@/components/templates/TemplatesGrid"
import Link from "next/link"
import { CustomRequestForm } from "@/components/CustomRequestForm"

const products = getTemplatesByCategory("startup")

export const metadata: Metadata = {
  title: "Startup Templates & Guides",
  description: "Templates and guides for the operational side of building a startup - hiring, product, and growth resources built from real founder experience.",
  keywords: ["startup templates", "startup guides India", "hiring templates startup", "growth playbook founders"],
  alternates: { canonical: "https://priyaahuja.in/startup/templates" },
  openGraph: {
    title: "Startup Templates & Guides | Priya Ahuja",
    description: "Templates and guides for the operational side of building a startup - hiring, product, and growth.",
    url: "https://priyaahuja.in/startup/templates",
  },
}

export default async function StartupTemplatesPage() {
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
          <span>startup · digital downloads</span>
          <span>{products.filter((p) => !p.comingSoon).length} available</span>
        </div>

        <div className="px-4 md:px-10 pt-12 pb-8">
          <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Startup</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
            practical tools,
            <br />
            not fluff
          </h1>
          <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
            templates and guides for the operational side of building a startup - hiring, product, and growth.
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
            <CustomRequestForm source="startup-templates" userEmail={userEmail ?? undefined} />
          </div>
        </div>
      </div>
  )
}

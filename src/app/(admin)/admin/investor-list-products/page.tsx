export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { digitalProducts } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"
import InvestorListProductsClient from "./InvestorListProductsClient"

const INVESTOR_SLUGS = [
  "angel-investor-list",
  "early-stage-vc-list",
  "family-offices-list",
  "incubators-list",
]

const DEFAULTS: Record<string, { title: string; price: number }> = {
  "angel-investor-list":  { title: "Angel Investor List",          price: 99900  },
  "early-stage-vc-list":  { title: "Early Stage VC List",          price: 499900 },
  "family-offices-list":  { title: "Family Offices List",          price: 299900 },
  "incubators-list":      { title: "Incubator & Accelerator List", price: 99900  },
}

export default async function InvestorListProductsPage() {
  const rows = await db
    .select({ id: digitalProducts.id, slug: digitalProducts.slug, title: digitalProducts.title, price: digitalProducts.price })
    .from(digitalProducts)
    .where(inArray(digitalProducts.slug, INVESTOR_SLUGS))

  const existing = new Map(rows.map(r => [r.slug, r]))

  // Upsert any missing products so they always have a DB ID
  const toInsert = INVESTOR_SLUGS.filter(slug => !existing.has(slug))
  if (toInsert.length > 0) {
    const inserted = await db
      .insert(digitalProducts)
      .values(toInsert.map(slug => ({
        slug,
        title: DEFAULTS[slug].title,
        description: "",
        price: DEFAULTS[slug].price,
        isActive: true,
      })))
      .returning({ id: digitalProducts.id, slug: digitalProducts.slug, title: digitalProducts.title, price: digitalProducts.price })
    inserted.forEach(r => existing.set(r.slug, r))
  }

  const products = INVESTOR_SLUGS.map(slug => {
    const row = existing.get(slug)!
    return { id: row.id, slug, title: row.title, price: row.price }
  })

  return <InvestorListProductsClient products={products} />
}

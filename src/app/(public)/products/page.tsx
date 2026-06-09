import { db } from "@/lib/db"
import { digitalProducts } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import { ProductsClient, type PublicProduct } from "./ProductsClient"

function formatPrice(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN")
}

export default async function ProductsPage() {
  const rows = await db.select().from(digitalProducts).orderBy(asc(digitalProducts.createdAt))

  const products: PublicProduct[] = rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.shortDescription ?? row.description,
    price: formatPrice(row.price),
    tag: row.tag,
    comingSoon: !row.isActive,
  }))

  const availableCount = products.filter((p) => !p.comingSoon).length

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>digital downloads</span>
        <span>{availableCount} available</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          practical tools,
          <br />
          not fluff
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          templates, checklists, and guides you can use immediately, built from real deal experience.
        </p>
      </div>

      <ProductsClient products={products} />
    </div>
  )
}

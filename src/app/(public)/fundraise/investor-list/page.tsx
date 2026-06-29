export const dynamic = "force-dynamic"

import Link from "next/link"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, isNotNull, inArray } from "drizzle-orm"

const LISTS = [
  {
    href: "/fundraise/investor-list/angel-investors",
    slug: "angel-investor-list",
    title: "angel investors",
    price: "₹999",
    count: "900+",
    unit: "investors",
    description: "Active angel investors across India with direct email and LinkedIn. Ideal for pre-seed and seed stage founders.",
    tags: ["fintech", "SaaS", "D2C", "edtech", "healthtech", "deeptech"],
  },
  {
    href: "/fundraise/investor-list/early-stage-vc",
    slug: "early-stage-vc-list",
    title: "early stage vc",
    price: "₹4,999",
    count: "1,000+",
    unit: "VC firms",
    description: "Early stage VC firms actively writing cheques in Indian startups. Includes firm profiles and 26,000+ team contacts.",
    tags: ["pre-seed", "seed", "Series A", "all sectors"],
  },
  {
    href: "/fundraise/investor-list/family-offices",
    slug: "family-offices-list",
    title: "family offices",
    price: "₹2,999",
    count: "160+",
    unit: "family offices",
    description: "Family offices deploying capital into Indian startups. Faster than VCs, flexible cheques, and strong domain networks.",
    tags: ["flexible cheques", "growth stage", "sector agnostic"],
  },
  {
    href: "/fundraise/investor-list/incubators",
    slug: "incubators-list",
    title: "incubator & accelerator",
    price: "₹1,999",
    count: "230+",
    unit: "programs",
    description: "Incubators and accelerators in India across government, university, corporate, and independent cohort programs.",
    tags: ["early stage", "mentorship", "cohort programs"],
  },
]

const DEFAULT_PRICES: Record<string, number> = {
  "angel-investor-list":  99900,
  "early-stage-vc-list":  499900,
  "family-offices-list":  299900,
  "incubators-list":      99900,
}

function fmtPrice(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN")
}

export default async function InvestorListPage() {
  const session = await auth()
  const userEmail = session?.user?.email ?? null
  const admin = isAdmin(userEmail)
  const slugs = LISTS.map(l => l.slug)

  const [dbProducts, purchaseRows] = await Promise.all([
    db.select({ slug: digitalProducts.slug, price: digitalProducts.price })
      .from(digitalProducts)
      .where(inArray(digitalProducts.slug, slugs)),
    userEmail && !admin
      ? db.select({ slug: digitalProducts.slug })
          .from(purchases)
          .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
          .where(and(eq(purchases.userEmail, userEmail), isNotNull(purchases.downloadToken), inArray(digitalProducts.slug, slugs)))
      : Promise.resolve([] as { slug: string }[]),
  ])

  const priceMap = new Map(dbProducts.map(r => [r.slug, r.price]))
  const paidSlugs = admin
    ? new Set(slugs)
    : new Set((purchaseRows as { slug: string }[]).map(r => r.slug))

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      {/* Header bar */}
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>fundraise · investor list</span>
        <span>{LISTS.length} lists</span>
      </div>

      {/* Title */}
      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          investor list
        </h1>
        <p className="font-sans text-sm font-semibold text-ink max-w-lg leading-relaxed">
          Curated investor contact lists for founders actively fundraising. Buy once, access forever.
        </p>
      </div>

      {/* Cards grid */}
      <div className="px-4 md:px-10 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LISTS.map((list) => {
          const isPaid = paidSlugs.has(list.slug)
          const displayPrice = fmtPrice(priceMap.get(list.slug) ?? DEFAULT_PRICES[list.slug])
          return (
            <Link
              key={list.href}
              href={list.href}
              className="group bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-ink/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-heading text-xl font-700 text-ink group-hover:text-ink leading-tight">
                  {list.title}
                </h2>
                {isPaid ? (
                  <span className="flex-shrink-0 text-xs font-sans font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md">
                    lifetime access
                  </span>
                ) : (
                  <span className="flex-shrink-0 text-xs font-sans font-semibold text-ink bg-peach/30 border border-peach-dark/20 px-2.5 py-1 rounded-md">
                    {displayPrice}
                  </span>
                )}
              </div>

              <p className="font-sans text-[13px] text-ink/60 leading-relaxed">
                {list.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {list.tags.map((tag) => (
                  <span key={tag} className="font-sans text-[11px] text-ink/40 bg-ink/5 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-sans text-sm font-semibold text-ink">
                  {list.count} <span className="text-ink/40 font-normal">{list.unit}</span>
                </span>
                <span className="font-sans text-xs text-peach-dark font-semibold group-hover:underline">
                  {isPaid ? "open list" : "view list"}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

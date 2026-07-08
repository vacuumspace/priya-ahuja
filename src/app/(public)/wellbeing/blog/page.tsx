import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Suspense } from "react"
import { posts } from "@/lib/blog-data"
import { CategoryTabs } from "@/app/(public)/blog/CategoryTabs"

export const metadata: Metadata = {
  title: "Founder Wellbeing Blog",
  description: "Honest writing on founder burnout, loneliness, sleep, identity, and mental health - practical, non-generic advice for founders trying to build a company without losing themselves.",
  keywords: ["founder wellbeing blog", "founder burnout", "startup founder mental health", "founder loneliness", "entrepreneur stress India"],
  alternates: { canonical: "https://priyaahuja.in/wellbeing/blog" },
  openGraph: {
    title: "Founder Wellbeing Blog | Priya Ahuja",
    description: "Honest writing on founder burnout, loneliness, sleep, identity, and mental health.",
    url: "https://priyaahuja.in/wellbeing/blog",
  },
}

const wellbeingPosts = posts.filter((p) => p.topic === "wellbeing")
const allCategories = ["all", ...Array.from(new Set(wellbeingPosts.map((p) => p.tag)))]
const PAGE_SIZE = 5

type Props = { searchParams: Promise<{ tag?: string; page?: string }> }

export default async function WellbeingBlogPage({ searchParams }: Props) {
  const { tag, page: pageParam } = await searchParams
  const active = tag && allCategories.includes(tag) ? tag : "all"
  const filteredAll = active === "all" ? wellbeingPosts : wellbeingPosts.filter((p) => p.tag === active)

  const page = Math.max(1, parseInt(pageParam ?? "1", 10))
  const totalPages = Math.max(1, Math.ceil(filteredAll.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const offset = (currentPage - 1) * PAGE_SIZE
  const filtered = filteredAll.slice(offset, offset + PAGE_SIZE)

  const pageHref = (p: number) =>
    `/wellbeing/blog?${new URLSearchParams({ ...(active !== "all" ? { tag: active } : {}), page: String(p) }).toString()}`

  const paginationControls = totalPages > 1 && (
    <div className="flex items-center gap-3 flex-shrink-0">
      <p className="font-sans text-[13px] text-ink/40 whitespace-nowrap">
        page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        {currentPage > 1 && (
          <Link
            href={pageHref(currentPage - 1)}
            className="font-sans text-[13px] px-3 py-1.5 rounded-lg border border-border hover:bg-card transition-colors"
          >
            prev
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={pageHref(currentPage + 1)}
            className="font-sans text-[13px] px-3 py-1.5 rounded-lg border border-border hover:bg-card transition-colors"
          >
            next
          </Link>
        )}
      </div>
    </div>
  )

  const paginationNav = paginationControls && (
    <div className="flex items-center justify-between">{paginationControls}</div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>wellbeing · blog</span>
        <span>{wellbeingPosts.length} posts</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          building a company
          <br />
          without losing yourself
        </h1>
        <p className="font-sans text-base text-ink/60 max-w-md leading-relaxed">
          honest writing on founder burnout, loneliness, sleep, identity, and the parts of this job nobody warns you about.
        </p>
      </div>

      {/* Category tabs */}
      <div className="px-4 md:px-10 pb-6 flex items-center justify-between gap-4 flex-wrap">
        <Suspense>
          <CategoryTabs categories={allCategories} active={active} />
        </Suspense>
        {paginationControls}
      </div>

      <div className="px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-card border border-border rounded-2xl p-4 sm:p-6 hover:border-peach-dark/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[12px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
                      {post.tag}
                    </span>
                    <span className="text-[12px] text-ink/30 font-sans">{post.date}</span>
                    <span className="text-[12px] text-ink/30 font-sans">· {post.readTime} read</span>
                  </div>
                  <h2 className="font-heading text-xl font-700 text-ink mb-2">{post.title}</h2>
                  <p className="font-sans text-base text-ink/60 leading-relaxed max-w-lg">{post.excerpt}</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  <ArrowRight size={16} className="text-peach-dark" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {paginationNav && <div className="mt-6">{paginationNav}</div>}

        <div className="mt-12 bg-peach/30 border border-peach-dark/20 rounded-2xl p-4 sm:p-6">
          <p className="font-heading text-lg font-700 text-ink mb-1">need a scorecard, not just an article?</p>
          <p className="font-sans text-sm text-ink/60 mb-4">the founder wellbeing scorecard gives you an honest, free read on where you stand right now.</p>
          <Link
            href="/wellbeing/tools/wellbeing-score"
            className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2.5 rounded-lg hover:bg-ink/80 transition-colors"
          >
            take the scorecard
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}

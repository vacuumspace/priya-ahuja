import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Suspense } from "react"
import { posts, STARTUP_SERIES_NAME } from "@/lib/blog-data"
import { CategoryTabs } from "./CategoryTabs"

export const metadata: Metadata = {
  title: "Startup & Fundraise Blog",
  description: "Honest takes on startup building and fundraising - idea validation, investor evaluation criteria, pitch mistakes, pre-seed vs Series A signals, and what to do when fundraising stalls.",
  keywords: ["startup blog India", "fundraising blog India", "investor pitch tips", "startup advice India", "pre-seed fundraising advice"],
  alternates: { canonical: "https://priyaahuja.in/blog" },
  openGraph: {
    title: "Startup & Fundraise Blog | Priya Ahuja",
    description: "Honest takes on startup building and fundraising for Indian founders.",
    url: "https://priyaahuja.in/blog",
  },
}

const seriesPosts = posts.filter((p) => p.series?.name === STARTUP_SERIES_NAME)
const nonSeriesPosts = posts.filter((p) => !p.series)
const allCategories = ["all", ...Array.from(new Set(nonSeriesPosts.map((p) => p.tag)))]

type Props = { searchParams: Promise<{ tag?: string }> }

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = await searchParams
  const active = tag && allCategories.includes(tag) ? tag : "all"
  const filtered = active === "all" ? nonSeriesPosts : nonSeriesPosts.filter((p) => p.tag === active)

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>field notes</span>
        <span>{posts.length} posts</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          the things i
          <br />
          keep thinking about
        </h1>
        <p className="font-sans text-base text-ink/60 max-w-md leading-relaxed">
          honest writing on fundraising, vc careers, and startup strategy, from someone in the middle of it.
        </p>
      </div>

      {/* Series section */}
      <div className="px-4 md:px-10 pb-8">
        <div className="border border-peach-dark/30 rounded-2xl overflow-hidden">
          <div className="bg-peach/40 px-4 sm:px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-sans text-[12px] text-ink/40 uppercase tracking-wide mb-0.5">Featured Series</p>
              <p className="font-heading text-lg font-700 text-ink">{STARTUP_SERIES_NAME}</p>
              <p className="font-sans text-xs text-ink/60 mt-0.5">11-part guide from idea to funding - read in order or jump in anywhere.</p>
            </div>
            <span className="font-sans text-[12px] text-ink/40 bg-cream/60 px-2 py-1 rounded">
              {seriesPosts.length} parts
            </span>
          </div>
          <div className="divide-y divide-border">
            {seriesPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 hover:bg-peach/10 transition-colors"
              >
                <span className="font-heading text-xs font-700 text-ink/25 w-4 flex-shrink-0">
                  {post.series!.part}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-ink/80 group-hover:text-ink transition-colors truncate">
                    {post.title}
                  </p>
                </div>
                <span className="font-sans text-[12px] text-ink/30 flex-shrink-0">{post.readTime}</span>
                <ArrowRight size={12} className="text-peach-dark opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-4 md:px-10 pb-6">
        <Suspense>
          <CategoryTabs categories={allCategories} active={active} />
        </Suspense>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <p className="font-sans text-[13px] text-ink/40 uppercase tracking-wide mb-4">Field Notes</p>
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

        <div className="mt-12 bg-peach/30 border border-peach-dark/20 rounded-2xl p-4 sm:p-6">
          <p className="font-heading text-lg font-700 text-ink mb-1">stay in the loop</p>
          <p className="font-sans text-sm text-ink/60 mb-4">new posts drop whenever i have something worth saying.</p>
          <a
            href="https://www.instagram.com/pitchtopriya"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2.5 rounded-lg hover:bg-ink/80 transition-colors"
          >
            Follow me on
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
        </div>
      </div>
    </div>
  )
}

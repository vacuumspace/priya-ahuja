import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Suspense } from "react"
import { posts } from "@/lib/blog-data"
import { CategoryTabs } from "./CategoryTabs"

const topicPosts = posts.filter((p) => p.topic === "fundraise" && !p.series)
const allCategories = ["all", ...Array.from(new Set(topicPosts.map((p) => p.tag)))]

type Props = { searchParams: Promise<{ tag?: string }> }

export default async function FundraiseBlogPage({ searchParams }: Props) {
  const { tag } = await searchParams
  const active = tag && allCategories.includes(tag) ? tag : "all"
  const filtered = active === "all" ? topicPosts : topicPosts.filter((p) => p.tag === active)

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>fundraise · field notes</span>
        <span>{topicPosts.length} posts</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          raising capital,
          <br />
          honestly
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          what investors actually look for, how processes really work, and the things founders wish someone had told them earlier.
        </p>
      </div>

      {/* Category tabs */}
      <div className="px-4 md:px-10 pb-6">
        <Suspense>
          <CategoryTabs categories={allCategories} active={active} />
        </Suspense>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <p className="font-sans text-[11px] text-ink/40 uppercase tracking-wide mb-4">Field Notes</p>
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-card border border-border rounded-2xl p-6 hover:border-peach-dark/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
                      {post.tag}
                    </span>
                    <span className="text-[10px] text-ink/30 font-sans">{post.date}</span>
                    <span className="text-[10px] text-ink/30 font-sans">· {post.readTime} read</span>
                  </div>
                  <h2 className="font-heading text-xl font-700 text-ink mb-2">{post.title}</h2>
                  <p className="font-sans text-sm text-ink/60 leading-relaxed max-w-lg">{post.excerpt}</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  <ArrowRight size={16} className="text-peach-dark" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-peach/30 border border-peach-dark/20 rounded-2xl p-6">
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

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { posts, STARTUP_SERIES_NAME } from "@/lib/blog-data"
import { SeriesDropdown } from "./SeriesDropdown"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    authors: [{ name: "Priya Ahuja" }],
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://priyaahuja.in"}/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://priyaahuja.in"}/blog/${slug}`,
      title: post.title,
      description: post.metaDescription,
      publishedTime: post.date,
      authors: ["Priya Ahuja"],
      tags: post.keywords,
      images: [{ url: "/priyadp.jpeg", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
    },
  }
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|\*[^*]+\*)/)
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={idx} className="text-ink font-semibold">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={idx}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

function renderContent(content: string) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="font-heading text-2xl font-700 text-ink mt-10 mb-4">
          {line.replace("## ", "")}
        </h2>
      )
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(
        <p key={i} className="font-sans text-base font-semibold text-ink mt-6 mb-2">
          {line.slice(2, -2)}
        </p>
      )
    } else if (line.startsWith("- ")) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-2 my-4 pl-2">
          {items.map((item, idx) => (
            <li key={idx} className="font-sans text-base text-ink/70 leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-2 my-4 pl-2">
          {items.map((item, idx) => (
            <li key={idx} className="font-sans text-base text-ink/70 leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      )
      continue
    } else if (line.startsWith("|")) {
      // skip markdown table rows
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      elements.push(
        <p key={i} className="font-sans text-base text-ink/75 leading-relaxed my-3">
          {renderInline(line)}
        </p>
      )
    }
    i++
  }

  return elements
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  if (!post) notFound()

  const postIndex = posts.findIndex((p) => p.slug === slug)
  const prev = posts[postIndex - 1] ?? null
  const next = posts[postIndex + 1] ?? null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    author: {
      "@type": "Person",
      name: "Priya Ahuja",
      url: "https://priyaahuja.in",
    },
    datePublished: post.date,
    keywords: post.keywords.join(", "),
    publisher: {
      "@type": "Person",
      name: "Priya Ahuja",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-cream">
        {/* Top bar */}
        <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
          <Link href="/blog" className="flex items-center gap-1.5 hover:text-ink transition-colors">
            <ArrowLeft size={11} />
            all posts
          </Link>
          <span>{post.readTime} read</span>
        </div>

        <article className="px-4 md:px-10 pt-12 pb-20 max-w-2xl">
          {/* Series banner with dropdown */}
          {post.series && (
            <SeriesDropdown
              seriesName={post.series.name}
              currentPart={post.series.part}
              total={post.series.total}
              seriesPosts={posts
                .filter((p) => p.series?.name === STARTUP_SERIES_NAME)
                .map((p) => ({ slug: p.slug, title: p.title, part: p.series!.part }))}
            />
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[12px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
              {post.tag}
            </span>
            <span className="text-[12px] text-ink/30 font-sans">{post.date}</span>
            <span className="text-[12px] text-ink/30 font-sans">· {post.readTime} read</span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-800 text-ink leading-tight mb-6">
            {post.title}
          </h1>

          <p className="font-sans text-base text-ink/60 leading-relaxed mb-10 border-b border-border pb-8">
            {post.excerpt}
          </p>

          <div className="prose-custom">{renderContent(post.content)}</div>

          {/* Author card - hidden on series posts */}
          {!post.series && <div className="mt-16 bg-peach/30 border border-peach-dark/20 rounded-2xl p-6">
            <p className="font-heading text-base font-700 text-ink mb-1">Priya Ahuja</p>
            <p className="font-sans text-xs text-ink/60 mb-4 leading-relaxed">
              vc at Groww · startup consultant & advisor. Writing about fundraising, VC careers, and startup strategy from the inside.
            </p>
            <a
              href="https://www.instagram.com/pitchtopriya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors"
            >
              Follow on Instagram
            </a>
          </div>}

          {/* Prev / next */}
          {(prev || next) && (
            <div className="mt-10 grid grid-cols-2 gap-4">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group border border-border rounded-xl p-4 hover:border-peach-dark/40 transition-all"
                >
                  <p className="text-[12px] text-ink/30 font-sans mb-1">← previous</p>
                  <p className="font-sans text-xs text-ink/70 group-hover:text-ink transition-colors line-clamp-2">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group border border-border rounded-xl p-4 hover:border-peach-dark/40 transition-all text-right"
                >
                  <p className="text-[12px] text-ink/30 font-sans mb-1">next →</p>
                  <p className="font-sans text-xs text-ink/70 group-hover:text-ink transition-colors line-clamp-2">
                    {next.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
        </article>
      </div>
    </>
  )
}

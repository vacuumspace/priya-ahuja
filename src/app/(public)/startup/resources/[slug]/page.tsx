import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { auth } from "@/lib/auth"
import { getResourceBySlug, getDealBadgeClass } from "@/lib/resources-data"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resource = getResourceBySlug(slug)
  if (!resource) return {}

  const title = `${resource.name} — Startup Resource`
  const description = resource.tagline
  const url = `https://priyaahuja.in/startup/resources/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | Priya Ahuja`, description, url },
  }
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params
  const resource = getResourceBySlug(slug)
  if (!resource) notFound()

  const session = await auth()
  if (!session?.user?.email) {
    redirect(`/signin?callbackUrl=/startup/resources/${slug}`)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>startup · resources & credits</span>
        <span>{resource.category}</span>
      </div>

      <article className="px-4 md:px-10 pt-10 pb-16 max-w-2xl">
        <Link
          href="/startup/resources"
          className="inline-flex items-center gap-1.5 text-xs font-sans text-ink/40 hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft size={13} /> back to resources
        </Link>

        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">{resource.category}</p>
        <h1 className="font-heading text-3xl md:text-4xl font-800 text-ink mb-2">{resource.name}</h1>
        <p className="font-sans text-base text-ink/60 leading-relaxed border-l-2 border-peach-dark/30 pl-4 mb-8">
          {resource.tagline}
        </p>

        {resource.deal && (
          <div className={`inline-flex items-center gap-2 text-sm font-sans font-semibold px-4 py-2 rounded-xl mb-8 ${getDealBadgeClass(resource.dealType)}`}>
            <span>💰</span>
            <span>{resource.deal}</span>
          </div>
        )}

        <div className="space-y-8">
          <div>
            <h2 className="font-heading text-lg font-700 text-ink mb-3">What it does</h2>
            <p className="font-sans text-base text-ink/70 leading-relaxed">{resource.description}</p>
          </div>

          <div>
            <h2 className="font-heading text-lg font-700 text-ink mb-3">What you get</h2>
            <ul className="space-y-2">
              {resource.whatYouGet.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 font-sans text-sm text-ink/70 leading-relaxed">
                  <span className="text-peach-dark mt-0.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-lg font-700 text-ink mb-3">Eligibility</h2>
            <p className="font-sans text-sm text-ink/70 leading-relaxed bg-peach/20 rounded-xl px-4 py-3 border border-peach-dark/10">
              {resource.eligibility}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <a
            href={resource.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans font-semibold text-sm px-6 py-3 rounded-xl bg-ink text-cream hover:bg-ink/80 transition-colors"
          >
            Apply for this deal
            <ExternalLink size={14} />
          </a>
          <p className="mt-3 font-sans text-xs text-ink/40">opens the official program page in a new tab</p>
        </div>
      </article>
    </div>
  )
}

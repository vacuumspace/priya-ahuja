import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { auth } from "@/lib/auth"
import { getGrantBySlug } from "@/lib/grants-data"

type Props = { params: Promise<{ slug: string }> }

const grantTypeLabel: Record<string, string> = {
  grant: "Non-dilutive Grant",
  loan: "Soft Loan / Subsidy",
  equity: "Equity Investment",
  credits: "Cloud / Tech Credits",
  fellowship: "Fellowship",
  accelerator: "Accelerator Program",
}

const stageLabel: Record<string, string> = {
  idea: "Idea Stage",
  prototype: "Prototype / MVP",
  "early-revenue": "Early Revenue",
  growth: "Growth Stage",
  any: "Any Stage",
}

export default async function GrantDetailPage({ params }: Props) {
  const { slug } = await params
  const grant = getGrantBySlug(slug)
  if (!grant) notFound()

  const session = await auth()
  if (!session?.user?.email) {
    redirect(`/signin?callbackUrl=/fundraise/grants/${slug}`)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>fundraise · grants</span>
        <span>{grant.sector}</span>
      </div>

      <article className="px-4 md:px-10 pt-10 pb-16 max-w-2xl">
        <Link
          href="/fundraise/grants"
          className="inline-flex items-center gap-1.5 text-xs font-sans text-ink/40 hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft size={13} /> back to grants
        </Link>

        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">{grant.org}</p>
        <h1 className="font-heading text-3xl md:text-4xl font-800 text-ink mb-4">{grant.title}</h1>

        {/* Meta tags */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span className="text-[12px] font-sans px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100">
            {grant.sector}
          </span>
          {grant.grantType && (
            <span className="text-[12px] font-sans px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
              {grantTypeLabel[grant.grantType] ?? grant.grantType}
            </span>
          )}
          {grant.stage && (
            <span className="text-[12px] font-sans px-2.5 py-1 rounded-lg bg-ink/5 text-ink/50 border border-border">
              {stageLabel[grant.stage] ?? grant.stage}
            </span>
          )}
        </div>

        {/* Amount + Deadline */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {grant.amountLabel && (
            <div className="inline-flex items-center gap-2 text-sm font-sans font-semibold px-4 py-2.5 rounded-xl bg-green-50 text-green-700 border border-green-100">
              <span>💰</span>
              <span>{grant.amountLabel}</span>
            </div>
          )}
          <div className="inline-flex items-center gap-2 text-sm font-sans px-4 py-2.5 rounded-xl bg-peach/20 text-ink/70 border border-peach-dark/10">
            <span>📅</span>
            <span>{grant.deadlineLabel}</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* About */}
          <div>
            <h2 className="font-heading text-lg font-700 text-ink mb-3">About this grant</h2>
            <p className="font-sans text-base text-ink/70 leading-relaxed">{grant.description}</p>
          </div>

          {/* What you get */}
          {grant.whatYouGet?.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-700 text-ink mb-3">What you get</h2>
              <ul className="space-y-2">
                {grant.whatYouGet.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 font-sans text-sm text-ink/70 leading-relaxed">
                    <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eligibility */}
          <div>
            <h2 className="font-heading text-lg font-700 text-ink mb-3">Eligibility</h2>
            <p className="font-sans text-sm text-ink/70 leading-relaxed bg-peach/20 rounded-xl px-4 py-3 border border-peach-dark/10">
              {grant.eligibility}
            </p>
          </div>

          {/* How to apply */}
          {grant.howToApply && (
            <div>
              <h2 className="font-heading text-lg font-700 text-ink mb-3">How to apply</h2>
              <p className="font-sans text-sm text-ink/70 leading-relaxed">{grant.howToApply}</p>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <a
            href={grant.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans font-semibold text-sm px-6 py-3 rounded-xl bg-ink text-cream hover:bg-ink/80 transition-colors"
          >
            Apply for this grant
            <ExternalLink size={14} />
          </a>
          <p className="mt-3 font-sans text-xs text-ink/40">opens the official program page in a new tab</p>
        </div>
      </article>
    </div>
  )
}

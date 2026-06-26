import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { getIdeaBySlug, FREE_IDEAS_COUNT } from "@/lib/startup-ideas-data"

type Props = { params: Promise<{ slug: string }> }

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|\*[^*]+\*)/)
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return <strong key={idx} className="text-ink font-semibold">{part.slice(2, -2)}</strong>
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={idx}>{part.slice(1, -1)}</em>
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
      elements.push(<h2 key={i} className="font-heading text-2xl font-700 text-ink mt-10 mb-4">{line.replace("## ", "")}</h2>)
    } else if (line.startsWith("- ")) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith("- ")) { items.push(lines[i].slice(2)); i++ }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-2 my-4 pl-2">
          {items.map((item, idx) => <li key={idx} className="font-sans text-sm text-ink/70 leading-relaxed">{renderInline(item)}</li>)}
        </ul>
      )
      continue
    } else if (line.trim() === "") {
      // skip
    } else {
      elements.push(<p key={i} className="font-sans text-sm text-ink/75 leading-relaxed my-3">{renderInline(line)}</p>)
    }
    i++
  }
  return elements
}

export default async function IdeaDetailPage({ params }: Props) {
  const { slug } = await params
  const idea = getIdeaBySlug(slug)
  if (!idea) notFound()

  const session = await auth()
  const userEmail = session?.user?.email ?? null

  const isFree = idea.sno <= FREE_IDEAS_COUNT

  if (!isFree && !userEmail) {
    redirect(`/signin?callbackUrl=/startup/ideas/${slug}`)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>startup · ideas 2026</span>
        <span>{idea.category}</span>
      </div>

      <article className="px-4 md:px-10 pt-10 pb-16 max-w-2xl">
        <Link href="/startup/ideas" className="inline-flex items-center gap-1.5 text-xs font-sans text-ink/40 hover:text-ink transition-colors mb-8">
          <ArrowLeft size={13} /> back to ideas
        </Link>

        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">{idea.category} · #{idea.sno}</p>
        <h1 className="font-heading text-3xl md:text-4xl font-800 text-ink mb-4">{idea.title}</h1>
        <p className="font-sans text-base text-ink/60 leading-relaxed border-l-2 border-peach-dark/30 pl-4 mb-10">
          {idea.tagline}
        </p>

        {idea.content ? renderContent(idea.content) : (
          <p className="font-sans text-sm text-ink/40">Full breakdown coming soon.</p>
        )}

        <div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="font-sans text-xs text-ink/40">want to discuss your startup idea?</p>
          <Link href="/connect/startup-idea-brainstorming" className="font-sans text-xs font-semibold text-peach-dark hover:underline whitespace-nowrap">
            book a brainstorming session →
          </Link>
        </div>
      </article>
    </div>
  )
}

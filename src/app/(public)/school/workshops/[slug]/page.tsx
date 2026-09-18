import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { workshops, workshopRegistrations, workshopFeedback } from "@/lib/db/schema"
import { eq, and, notInArray } from "drizzle-orm"
import { CalendarDays, Clock, ChevronLeft, GraduationCap, IndianRupee } from "lucide-react"
import { formatWorkshopTimeRange, formatWorkshopPrice } from "@/lib/workshop-time"
import { RegistrationProvider, RegisterTrigger, PlaybookDownloadTrigger } from "./RegisterCard"

function formatDate(date: string) {
  // See identical comment in school/workshops/page.tsx - without an explicit
  // timeZone, this renders in the server's local time (UTC on Vercel), which
  // rolls a midnight-IST date back to the previous day.
  return new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
  })
}

// Outcome-driven bottom CTA copy, by workshop slug - falls back to a generic
// label for any workshop not listed here.
const BOTTOM_CTA_LABELS: Record<string, string> = {
  "fundable-pitch-deck": "Create Fundable Pitch Deck",
  "fundable-pitch-deck-aug-2026": "Create Fundable Pitch Deck",
  "fundable-pitch-deck-sep-2026": "Create Fundable Pitch Deck",
  "hunting-startup-idea-worth-building": "Find Your Startup Idea",
}

// Supports simple `[label](url)` markdown links inside the otherwise plain
// description text, so admin-entered copy can link to a tool/page. A `url`
// of "#playbook" renders a placeholder download trigger instead of a link,
// since there's no file to serve yet.
function renderDescription(text: string) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (!match) return part
    const [, label, href] = match
    if (href === "#playbook") {
      return <PlaybookDownloadTrigger key={i} label={label} />
    }
    return (
      <Link key={i} href={href} className="text-peach-dark font-semibold hover:underline">
        {label}
      </Link>
    )
  })
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const [workshop] = await db.select().from(workshops).where(eq(workshops.slug, slug)).limit(1)
  if (!workshop) return {}
  return {
    title: `${workshop.title} - Workshop by Priya Ahuja`,
    description: workshop.description.slice(0, 160),
    alternates: { canonical: `https://priyaahuja.in/school/workshops/${slug}` },
  }
}

export default async function WorkshopDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const session = await auth()

  const [workshop] = await db.select().from(workshops).where(eq(workshops.slug, slug)).limit(1)
  if (!workshop || !workshop.isActive) notFound()

  const isPast = new Date(`${workshop.date}T${workshop.endTime}:00+05:30`) < new Date()

  let existingRegistration: { status: string } | null = null
  if (session?.user?.id) {
    const [reg] = await db
      .select({ status: workshopRegistrations.status })
      .from(workshopRegistrations)
      .where(and(
        eq(workshopRegistrations.workshopId, workshop.id),
        eq(workshopRegistrations.userId, session.user.id),
        notInArray(workshopRegistrations.status, ["cancelled"]),
      ))
      .limit(1)
    existingRegistration = reg ?? null
  }

  const feedback = isPast
    ? await db.select().from(workshopFeedback).where(eq(workshopFeedback.workshopId, workshop.id))
    : []

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <Link href="/school/workshops" className="flex items-center gap-1 hover:text-ink transition-colors">
          <ChevronLeft size={14} /> all workshops
        </Link>
        <span className="flex items-center gap-1.5"><GraduationCap size={14} /> school</span>
      </div>

      <div className="px-4 md:px-10 pt-10 pb-16 max-w-3xl mx-auto">
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-peach/30 mb-6">
          {workshop.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={workshop.thumbnailUrl} alt={workshop.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GraduationCap size={48} className="text-peach-dark/50" />
            </div>
          )}
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-800 text-ink mb-4 normal-case">
          {workshop.title}
        </h1>

        <RegistrationProvider
          workshopSlug={workshop.slug}
          workshopTitle={workshop.title}
          price={workshop.price}
          isPast={isPast}
          isSignedIn={!!session?.user}
          isAdmin={isAdmin(session?.user?.email)}
          userName={session?.user?.name ?? ""}
          userEmail={session?.user?.email ?? ""}
          existingStatus={existingRegistration?.status ?? null}
          initialMeetLink={workshop.meetLink}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-sm font-sans text-ink/70">
                <CalendarDays size={14} className="text-peach-dark" />
                {formatDate(workshop.date)}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-sans text-ink/70">
                <Clock size={14} className="text-peach-dark" />
                {formatWorkshopTimeRange(workshop.startTime, workshop.endTime)} IST
              </div>
              <div className="flex items-center gap-1.5 text-sm font-sans text-ink/70">
                <IndianRupee size={14} className="text-peach-dark" />
                {formatWorkshopPrice(workshop.price)}
              </div>
            </div>

            <RegisterTrigger />
          </div>

          <div className="font-sans text-[15px] text-ink/70 leading-relaxed whitespace-pre-line">
            {renderDescription(workshop.description)}
          </div>

          {feedback.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
                what founders said
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {feedback.map((f) => (
                  <div key={f.id} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-4 py-4">
                    <p className="font-sans text-sm text-ink/70 leading-relaxed">&ldquo;{f.message}&rdquo;</p>
                    <p className="font-sans text-[12px] font-semibold text-ink/40 mt-2">{f.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col items-center">
            <RegisterTrigger
              label={BOTTOM_CTA_LABELS[workshop.slug] ?? "Register Now"}
              className="h-auto bg-peach-dark text-ink hover:bg-peach-dark/80 font-sans font-semibold text-sm px-10 py-3.5 rounded-xl"
            />
            <div className="mt-8 pt-8 border-t border-border w-full" />
          </div>
        </RegistrationProvider>
      </div>
    </div>
  )
}

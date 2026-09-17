import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { workshops } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { CalendarDays, Clock, GraduationCap, IndianRupee } from "lucide-react"
import { formatWorkshopTimeRange, formatWorkshopPrice } from "@/lib/workshop-time"

export const metadata: Metadata = {
  title: "School - Workshops by Priya Ahuja",
  description: "Live workshops on fundraising, pitch decks, and startup strategy - hosted by Priya Ahuja.",
  alternates: { canonical: "https://priyaahuja.in/school/workshops" },
}

function formatDate(date: string) {
  // toLocaleDateString picks the calendar day using the *runtime's* local
  // timezone unless told otherwise - on Vercel that's UTC, which rolls a
  // midnight-IST anchor back to the previous day. Explicit timeZone fixes it
  // regardless of what timezone the server happens to run in.
  return new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata",
  })
}

type SearchParams = Promise<{ tab?: string }>

export default async function WorkshopsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const activeTab = params.tab === "past" ? "past" : "upcoming"

  const allWorkshops = await db
    .select()
    .from(workshops)
    .where(eq(workshops.isActive, true))
    .orderBy(asc(workshops.date))

  const now = new Date()
  const upcoming = allWorkshops
    .filter((w) => new Date(`${w.date}T${w.endTime}:00+05:30`) >= now)
    .sort((a, b) => a.date.localeCompare(b.date))
  const past = allWorkshops
    .filter((w) => new Date(`${w.date}T${w.endTime}:00+05:30`) < now)
    .sort((a, b) => b.date.localeCompare(a.date))

  const list = activeTab === "past" ? past : upcoming

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>school</span>
        <span>{allWorkshops.length} workshops</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4 flex items-center gap-3">
          <GraduationCap size={36} className="text-peach-dark" />
          workshops
        </h1>
        <p className="font-sans text-base text-ink/60 max-w-md leading-relaxed">
          live, interactive sessions on fundraising, pitch decks, and startup strategy - hosted directly by Priya.
        </p>
      </div>

      <div className="px-4 md:px-10">
        <div className="flex flex-wrap gap-1 mb-8 border-b border-border">
          <Link
            href="/school/workshops?tab=upcoming"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "upcoming" ? "border-ink text-ink" : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            upcoming
            <span className="text-[12px] font-mono ml-0.5 opacity-60">{upcoming.length}</span>
          </Link>
          <Link
            href="/school/workshops?tab=past"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "past" ? "border-ink text-ink" : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            past
            <span className="text-[12px] font-mono ml-0.5 opacity-60">{past.length}</span>
          </Link>
        </div>
      </div>

      <div className="px-4 md:px-10 pb-16">
        {list.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-10 text-center max-w-lg">
            <GraduationCap size={32} className="text-peach-dark/40 mx-auto mb-3" />
            <p className="font-heading text-base font-700 text-ink mb-1">
              {activeTab === "past" ? "no past workshops yet" : "no upcoming workshops right now"}
            </p>
            <p className="font-sans text-sm text-ink/50 leading-relaxed">
              check back soon - new sessions are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((w) => (
              <Link
                key={w.id}
                href={`/school/workshops/${w.slug}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-peach-dark/50 transition-colors"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-peach/30">
                  {w.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={w.thumbnailUrl}
                      alt={w.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap size={40} className="text-peach-dark/50" />
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full shadow-sm ${
                    activeTab === "past" ? "bg-ink/80 text-cream" : "bg-green-100 text-green-700"
                  }`}>
                    {activeTab === "past" ? "completed" : "open for registration"}
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-heading text-lg font-700 text-ink normal-case mb-2 leading-snug">
                    {w.title}
                  </p>
                  <div className="flex items-center gap-1.5 text-[13px] font-sans text-ink/50 mb-1">
                    <CalendarDays size={12} className="text-peach-dark flex-shrink-0" />
                    {formatDate(w.date)}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] font-sans text-ink/50 mb-1">
                    <Clock size={12} className="text-peach-dark flex-shrink-0" />
                    {formatWorkshopTimeRange(w.startTime, w.endTime)} IST
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] font-sans text-ink/50 mb-3">
                    <IndianRupee size={12} className="text-peach-dark flex-shrink-0" />
                    {formatWorkshopPrice(w.price)}
                  </div>
                  <div className="flex justify-end">
                    <span className="text-xs font-sans font-semibold text-peach-dark group-hover:underline">
                      view details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

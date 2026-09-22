import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays, clampWallDate, dayNumberForDate, CHALLENGE_START_DATE, todayIST } from "@/lib/daily-win-journal"
import { getWallEntries } from "@/lib/journal-wall"

export const metadata = {
  title: "100 days wall - daily wins from founders",
  description: "Founders sharing one daily win each, day by day, for 100 days.",
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata",
  })
}

export default async function WallPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: rawDate } = await searchParams
  const date = clampWallDate(rawDate)
  const dayNum = dayNumberForDate(date)
  const today = todayIST()

  const rows = await getWallEntries(date)

  const prevDate = date > CHALLENGE_START_DATE ? addDays(date, -1) : null
  const nextDate = date < today ? addDays(date, 1) : null

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center gap-3 px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span className="flex-shrink-0">100 days wall</span>
        <Link href="/journal" className="text-ink/50 hover:text-ink transition-colors underline underline-offset-2">
          write your own
        </Link>
      </div>

      <div className="px-4 md:px-10 pt-8 pb-16 max-w-2xl">
        <h1 className="font-heading text-3xl font-800 text-ink mb-2">daily wins from founders</h1>
        <p className="font-sans text-sm text-ink/60 mb-6">
          {rows.length} founder{rows.length === 1 ? "" : "s"} shared on day {dayNum} &middot; {formatDate(date)}
        </p>

        <div className="flex items-center justify-between mb-6">
          {prevDate ? (
            <Link href={`/journal/wall?date=${prevDate}`} className="flex items-center gap-1 text-sm font-sans text-ink/60 hover:text-ink">
              <ChevronLeft size={16} /> previous day
            </Link>
          ) : <span />}
          {nextDate ? (
            <Link href={`/journal/wall?date=${nextDate}`} className="flex items-center gap-1 text-sm font-sans text-ink/60 hover:text-ink">
              next day <ChevronRight size={16} />
            </Link>
          ) : <span />}
        </div>

        {rows.length === 0 ? (
          <p className="font-sans text-sm text-ink/40 text-center py-12">no public wins shared on this day yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {rows.map((row, i) => (
              <div key={i} className="w-fit max-w-[280px] border border-border rounded-lg p-2.5">
                <p className="font-sans text-xs font-semibold text-ink mb-0.5 truncate">{row.name}</p>
                <ul className="flex flex-col gap-0.5">
                  {row.points.map((p, j) => (
                    <li key={j} className="font-sans text-xs text-ink/70">{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

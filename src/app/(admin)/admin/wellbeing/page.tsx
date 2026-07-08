import { db } from "@/lib/db"
import { wellbeingScores, users } from "@/lib/db/schema"
import { desc, count, eq } from "drizzle-orm"
import { WELLBEING_CATEGORIES } from "@/lib/wellbeing-score-data"
import Link from "next/link"

const PAGE_SIZE = 20

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminWellbeingPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? "1", 10))

  await db.update(wellbeingScores).set({ adminSeen: true }).where(eq(wellbeingScores.adminSeen, false))

  const [totalResult, rows] = await Promise.all([
    db.select({ count: count() }).from(wellbeingScores),
    db
      .select({
        id: wellbeingScores.id,
        totalScore: wellbeingScores.totalScore,
        categoryScores: wellbeingScores.categoryScores,
        createdAt: wellbeingScores.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(wellbeingScores)
      .leftJoin(users, eq(wellbeingScores.userId, users.id))
      .orderBy(desc(wellbeingScores.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
  ])

  const total = totalResult[0].count
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const offset = (page - 1) * PAGE_SIZE

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Wellbeing</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{total} scorecard submissions</p>
      </div>

      <div className="flex gap-1 mb-6 bg-peach-dark/10 rounded-xl p-1 w-fit">
        <button className="px-4 py-2 rounded-lg text-sm font-medium capitalize bg-peach text-ink shadow-sm">
          Submissions
        </button>
      </div>

      <div className="border border-border rounded-2xl overflow-hidden">
        {rows.length === 0 ? (
          <p className="font-sans text-sm text-ink/40 px-6 py-10 text-center">No submissions yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3 w-12">S.No</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Name</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Email</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Score</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Categories</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const cs = row.categoryScores as Record<string, { earned: number; max: number }>
                return (
                  <tr key={row.id} className={i !== rows.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-5 py-3.5 font-sans text-sm text-ink/30">{offset + i + 1}</td>
                    <td className="px-5 py-3.5 font-sans text-sm text-ink font-medium">{row.userName ?? " - "}</td>
                    <td className="px-5 py-3.5 font-sans text-sm text-ink/70">{row.userEmail ?? " - "}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-heading text-lg font-bold text-ink">{row.totalScore}</span>
                      <span className="font-sans text-[10px] text-ink/30">/100</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-end gap-1">
                        {WELLBEING_CATEGORIES.map((cat) => {
                          const c = cs?.[cat.index] ?? { earned: 0, max: cat.maxPoints }
                          const pct = (c.earned / c.max) * 100
                          return (
                            <div key={cat.index} className="group relative">
                              <div className="w-4 bg-border rounded-sm overflow-hidden" style={{ height: 24 }}>
                                <div
                                  className="w-full bg-peach-dark rounded-sm"
                                  style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                                />
                              </div>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 whitespace-nowrap">
                                <span className="text-[10px] bg-ink text-cream px-2 py-1 rounded font-sans">
                                  {cat.title}: {c.earned}/{c.max}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-sans text-sm text-ink/50">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : " - "}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="font-sans text-sm text-ink/40">
            showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`?page=${page - 1}`} className="font-sans text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-card transition-colors">
                prev
              </Link>
            )}
            {page < totalPages && (
              <Link href={`?page=${page + 1}`} className="font-sans text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-card transition-colors">
                next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

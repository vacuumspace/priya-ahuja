import { db } from "@/lib/db"
import { pitchDeckAnalyses, pitchDeckUnlocks, users } from "@/lib/db/schema"
import { desc, count, eq, inArray } from "drizzle-orm"
import Link from "next/link"

const PAGE_SIZE = 20

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminPitchDecksPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? "1", 10))

  await db.update(pitchDeckAnalyses).set({ adminSeen: true }).where(eq(pitchDeckAnalyses.adminSeen, false))

  const [totalResult, rows, unusedUnlocks] = await Promise.all([
    db.select({ count: count() }).from(pitchDeckAnalyses),
    db
      .select({
        id: pitchDeckAnalyses.id,
        fileName: pitchDeckAnalyses.fileName,
        totalScore: pitchDeckAnalyses.totalScore,
        isPaid: pitchDeckAnalyses.isPaid,
        createdAt: pitchDeckAnalyses.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(pitchDeckAnalyses)
      .leftJoin(users, eq(pitchDeckAnalyses.userId, users.id))
      .orderBy(desc(pitchDeckAnalyses.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),

    // Captured payments where the buyer hasn't uploaded a deck yet, plus
    // any refunded before use - a voided payment should never just vanish
    db
      .select({
        id: pitchDeckUnlocks.id,
        amountPaise: pitchDeckUnlocks.amountPaise,
        razorpayPaymentId: pitchDeckUnlocks.razorpayPaymentId,
        status: pitchDeckUnlocks.status,
        createdAt: pitchDeckUnlocks.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(pitchDeckUnlocks)
      .leftJoin(users, eq(pitchDeckUnlocks.userId, users.id))
      .where(inArray(pitchDeckUnlocks.status, ["paid", "refunded"]))
      .orderBy(desc(pitchDeckUnlocks.createdAt)),
  ])

  const total = totalResult[0].count
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const offset = (page - 1) * PAGE_SIZE

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Pitch Deck Analyses</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{total} total analyses</p>
      </div>

      {unusedUnlocks.length > 0 && (
        <div className="border border-amber-200 bg-amber-50 rounded-2xl overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-amber-200">
            <h2 className="font-heading text-base font-700 text-amber-900">paid, deck not uploaded yet</h2>
            <p className="font-sans text-xs text-amber-800/70 mt-0.5">these users completed payment but haven&apos;t run their analysis - they can upload any time without paying again</p>
          </div>
          <div className="px-5 py-1">
            {unusedUnlocks.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-amber-200/60 last:border-0">
                <div className="min-w-0">
                  <p className="font-sans text-sm font-medium text-ink truncate">{u.userName ?? "Unknown"}</p>
                  <p className="font-sans text-xs text-ink/50 truncate">{u.userEmail ?? " - "}{u.razorpayPaymentId ? ` · ${u.razorpayPaymentId}` : ""}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {u.status === "refunded" && (
                    <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-ink/10 text-ink/40">refunded</span>
                  )}
                  <span className="font-sans text-sm font-semibold text-ink">₹{(u.amountPaise / 100).toLocaleString("en-IN")}</span>
                  <span className="font-sans text-xs text-ink/50">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border border-border rounded-2xl overflow-hidden">
        {rows.length === 0 ? (
          <p className="font-sans text-sm text-ink/40 px-6 py-10 text-center">No analyses yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3 w-12">S.No</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Name</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Email</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Deck</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Score</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Paid</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className={i !== rows.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-5 py-3.5 font-sans text-sm text-ink/30">{offset + i + 1}</td>
                  <td className="px-5 py-3.5 font-sans text-sm text-ink font-medium">{row.userName ?? " - "}</td>
                  <td className="px-5 py-3.5 font-sans text-sm text-ink/70">{row.userEmail ?? " - "}</td>
                  <td className="px-5 py-3.5 font-sans text-sm text-ink/70 max-w-[200px] truncate">{row.fileName}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-heading text-lg font-bold text-ink">{row.totalScore}</span>
                    <span className="font-sans text-[10px] text-ink/30">/100</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full ${
                      row.isPaid ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/40"
                    }`}>
                      {row.isPaid ? "paid" : "admin test"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm text-ink/50">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : " - "}
                  </td>
                </tr>
              ))}
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

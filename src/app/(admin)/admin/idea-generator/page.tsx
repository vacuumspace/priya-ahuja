import { db } from "@/lib/db"
import { ideaGenReports, toolUnlocks, users } from "@/lib/db/schema"
import { desc, count, eq, and, inArray } from "drizzle-orm"
import Link from "next/link"

const PAGE_SIZE = 20

interface Props {
  searchParams: Promise<{ page?: string }>
}

const statusColors: Record<string, string> = {
  answering: "bg-ink/10 text-ink/40",
  locked: "bg-amber-100 text-amber-700",
  ready: "bg-green-100 text-green-700",
  failed: "bg-red-50 text-red-600",
}

export default async function AdminIdeaGeneratorPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? "1", 10))

  await db.update(ideaGenReports).set({ adminSeen: true }).where(eq(ideaGenReports.adminSeen, false))

  const [totalResult, rows, unusedUnlocks] = await Promise.all([
    db.select({ count: count() }).from(ideaGenReports),
    db
      .select({
        id: ideaGenReports.id,
        status: ideaGenReports.status,
        amountPaid: ideaGenReports.amountPaid,
        createdAt: ideaGenReports.createdAt,
        submittedAt: ideaGenReports.submittedAt,
        generationError: ideaGenReports.generationError,
        userName: users.name,
        userEmail: users.email,
      })
      .from(ideaGenReports)
      .leftJoin(users, eq(ideaGenReports.userId, users.id))
      .orderBy(desc(ideaGenReports.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),

    db
      .select({
        id: toolUnlocks.id,
        amountPaise: toolUnlocks.amountPaise,
        razorpayPaymentId: toolUnlocks.razorpayPaymentId,
        status: toolUnlocks.status,
        createdAt: toolUnlocks.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(toolUnlocks)
      .leftJoin(users, eq(toolUnlocks.userId, users.id))
      .where(and(eq(toolUnlocks.tool, "startup-idea-generator"), inArray(toolUnlocks.status, ["paid", "refunded"]))),
  ])

  const total = totalResult[0].count
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const offset = (page - 1) * PAGE_SIZE

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Personalised Startup Idea Generator</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{total} total reports</p>
      </div>

      {unusedUnlocks.length > 0 && (
        <div className="border border-amber-200 bg-amber-50 rounded-2xl overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-amber-200">
            <h2 className="font-heading text-base font-700 text-amber-900">paid, wizard not started yet</h2>
            <p className="font-sans text-xs text-amber-800/70 mt-0.5">completed payment but haven&apos;t started the intake wizard - they can start any time without paying again</p>
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
          <p className="font-sans text-sm text-ink/40 px-6 py-10 text-center">No reports yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3 w-12">S.No</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Name</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Email</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Status</th>
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
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full ${statusColors[row.status] ?? "bg-ink/10 text-ink/40"}`} title={row.generationError ?? undefined}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm text-ink/70">
                    {row.amountPaid != null ? `₹${(row.amountPaid / 100).toLocaleString("en-IN")}` : " - "}
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

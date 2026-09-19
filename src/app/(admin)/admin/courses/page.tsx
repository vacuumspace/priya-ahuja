import { db } from "@/lib/db"
import { courseEnrollments, courseGifts } from "@/lib/db/schema"
import { and, desc, eq, inArray, ne } from "drizzle-orm"
import { courses } from "@/lib/courses-data"
import { getSeatsTaken } from "@/lib/course-enrollment"

const fmtAmount = (paise: number | null | undefined) =>
  paise == null ? " - " : `₹${(paise / 100).toLocaleString("en-IN")}`

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  preregistered: "bg-amber-100 text-amber-700",
}
const STATUS_LABELS: Record<string, string> = {
  paid: "enrolled",
  preregistered: "pre-registered",
}

export default async function AdminCoursesPage() {
  const rows = await db
    .select()
    .from(courseEnrollments)
    .where(ne(courseEnrollments.status, "cancelled"))
    .orderBy(desc(courseEnrollments.createdAt))

  const gifts = await db
    .select()
    .from(courseGifts)
    .where(inArray(courseGifts.status, ["paid", "redeemed"]))
    .orderBy(desc(courseGifts.createdAt))

  // Opening the page counts as seeing them - clears the sidebar badge.
  await db
    .update(courseGifts)
    .set({ adminSeen: true })
    .where(and(eq(courseGifts.adminSeen, false), inArray(courseGifts.status, ["paid", "redeemed"])))
  await db
    .update(courseEnrollments)
    .set({ adminSeen: true })
    .where(and(eq(courseEnrollments.adminSeen, false), inArray(courseEnrollments.status, ["preregistered", "paid"])))

  const giftedEnrollmentIds = new Set(gifts.map((g) => g.enrollmentId).filter((id): id is string => !!id))
  const live = rows.filter((r) => r.status === "preregistered" || r.status === "paid")
  const pendingCount = rows.length - live.length

  const giftCollected = gifts.reduce((sum, g) => sum + (g.amountPaid ?? 0), 0)
  const collected = live.reduce((sum, r) => sum + (r.preRegAmountPaid ?? 0) + (r.balanceAmountPaid ?? 0), 0) + giftCollected
  // Only real pre-registrations (a payment on record) still owe a balance -
  // admin test rows carry none.
  const outstanding = live
    .filter((r) => r.status === "preregistered" && r.preRegPaymentId)
    .reduce((sum, r) => sum + Math.max(0, r.lockedPricePaise - (r.preRegAmountPaid ?? 0)), 0)
  const enrolled = live.filter((r) => r.status === "paid").length

  const seatStats = await Promise.all(
    courses.map(async (c) => ({ course: c, taken: await getSeatsTaken(c.slug) })),
  )

  const stats = [
    ...seatStats.map(({ course, taken }) => ({
      label: `Founding seats · ${course.title}`,
      value: `${taken} / ${course.seatCap}`,
    })),
    { label: "Pre-registered", value: String(live.filter((r) => r.status === "preregistered").length) },
    { label: "Enrolled (paid in full)", value: String(enrolled) },
    { label: "Gifts bought", value: `${gifts.length} (${gifts.filter((g) => g.status === "redeemed").length} claimed)` },
    { label: "Collected", value: fmtAmount(collected) },
    { label: "Balance outstanding", value: fmtAmount(outstanding) },
  ]

  const titleFor = (slug: string) => courses.find((c) => c.slug === slug)?.title ?? slug

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Courses</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">
          Pre-registrations and enrolments.
          {pendingCount > 0 && ` ${pendingCount} unpaid checkout${pendingCount === 1 ? "" : "s"} in progress.`}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl px-5 py-4">
            <p className="text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="font-heading text-2xl font-800 text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-border bg-card">
              {["Name", "Email", "Course", "Status", "Pre-reg paid", "Balance paid", "Total price", "Gift code", "Joined"].map((h) => (
                <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {live.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-ink/40 font-sans text-sm">No enrolments yet</td>
              </tr>
            ) : (
              live.map((r, i) => {
                const isGifted = giftedEnrollmentIds.has(r.id)
                const isTest = !r.preRegPaymentId && !r.balancePaymentId && !isGifted
                return (
                  <tr key={r.id} className={i !== live.length - 1 ? "border-b border-border" : ""}>
                    <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{r.userName}</td>
                    <td className="py-3 px-4 font-sans text-sm text-ink/70">{r.userEmail}</td>
                    <td className="py-3 px-4 font-sans text-xs text-ink/60">{titleFor(r.courseSlug)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status] ?? "bg-ink/10 text-ink/60"}`}>
                        {STATUS_LABELS[r.status] ?? r.status}
                      </span>
                      {isTest && <span className="ml-2 text-[10px] font-sans text-ink/40">test</span>}
                      {isGifted && <span className="ml-2 text-[10px] font-sans text-ink/40">gifted</span>}
                    </td>
                    <td className="py-3 px-4 font-sans text-sm text-ink">{fmtAmount(r.preRegAmountPaid)}</td>
                    <td className="py-3 px-4 font-sans text-sm text-ink">{fmtAmount(r.balanceAmountPaid)}</td>
                    <td className="py-3 px-4 font-sans text-sm text-ink/70">{fmtAmount(r.lockedPricePaise)}</td>
                    <td className="py-3 px-4 font-mono text-xs text-ink/60">{r.giftCode?.toLowerCase() ?? " - "}</td>
                    <td className="py-3 px-4 font-sans text-xs text-ink/50 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <h2 className="font-heading text-xl font-800 text-ink mt-12 mb-4">Gifts</h2>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-border bg-card">
              {["Bought by", "Email", "For", "Amount", "Status", "Claimed by", "Bought"].map((h) => (
                <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gifts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/40 font-sans text-sm">No gifts yet</td>
              </tr>
            ) : (
              gifts.map((g, i) => (
                <tr key={g.id} className={i !== gifts.length - 1 ? "border-b border-border" : ""}>
                  <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{g.purchaserName}</td>
                  <td className="py-3 px-4 font-sans text-sm text-ink/70">{g.purchaserEmail}</td>
                  <td className="py-3 px-4 font-sans text-sm text-ink/70">{g.recipientName ?? " - "}</td>
                  <td className="py-3 px-4 font-sans text-sm text-ink">
                    {fmtAmount(g.amountPaid)}
                    {!g.razorpayPaymentId && <span className="ml-2 text-[10px] font-sans text-ink/40">test</span>}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${g.status === "redeemed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {g.status === "redeemed" ? "claimed" : "not claimed"}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/60">{g.redeemedByEmail ?? " - "}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/50 whitespace-nowrap">{fmtDate(g.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

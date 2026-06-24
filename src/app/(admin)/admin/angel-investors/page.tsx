"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type Investor = {
  id: string
  sno: number
  name: string
  city: string
  state: string
  country: string
  linkedin: string
  emails: string[]
}

type Transaction = {
  id: string
  userName: string
  userEmail: string
  razorpayPaymentId: string | null
  downloadToken: string | null
  createdAt: string
  amountPaid: number | null
  price: number
}

function fmt(date: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date))
}

function fmtAmount(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN")
}

export default function AngelInvestorsAdminPage() {
  const searchParams = useSearchParams()
  const tab = (searchParams.get("tab") as "investors" | "transactions") || "investors"

  // investors state
  const [investors, setInvestors] = useState<Investor[]>([])
  const [invTotal, setInvTotal] = useState(0)
  const [invPage, setInvPage] = useState(1)
  const [invPageCount, setInvPageCount] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [invLoading, setInvLoading] = useState(false)

  // transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [txTotal, setTxTotal] = useState(0)
  const [txRevenue, setTxRevenue] = useState(0)
  const [txLoading, setTxLoading] = useState(false)
  const [txPage, setTxPage] = useState(1)
  const [txPageCount, setTxPageCount] = useState(1)
  const [revoking, setRevoking] = useState<string | null>(null)

  useEffect(() => {
    if (tab !== "investors") return
    setInvLoading(true)
    const params = new URLSearchParams({ tab: "investors", page: String(invPage) })
    if (search) params.set("search", search)
    fetch(`/api/admin/angel-investors?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setInvestors(d.investors ?? [])
        setInvTotal(d.total ?? 0)
        setInvPageCount(d.pageCount ?? 1)
        setInvLoading(false)
      })
  }, [tab, invPage, search])

  useEffect(() => {
    if (tab !== "transactions") return
    setTxLoading(true)
    fetch(`/api/admin/angel-investors?tab=transactions&page=${txPage}`)
      .then((r) => r.json())
      .then((d) => {
        setTransactions(d.transactions ?? [])
        setTxTotal(d.total ?? 0)
        setTxRevenue(d.revenue ?? 0)
        setTxPageCount(d.pageCount ?? 1)
        setTxLoading(false)
      })
  }, [tab, txPage])

  const revokeAccess = async (id: string, name: string) => {
    if (!confirm(`Revoke angel investor list access for ${name}? They will no longer be able to view the list.`)) return
    setRevoking(id)
    await fetch(`/api/admin/purchases/${id}`, { method: "PATCH" })
    setTransactions((prev) => prev.map((t) => t.id === id ? { ...t, downloadToken: null } : t))
    setRevoking(null)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setInvPage(1)
    setSearch(searchInput)
  }

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Angel Investors</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">
          {tab === "investors" ? `${invTotal} investors` : `${txTotal} purchases · ${fmtAmount(txRevenue)} revenue`}
        </p>
      </div>

      {/* Investors tab */}
      {tab === "investors" && (
        <>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name, city, state…"
              className="font-sans text-sm bg-card border border-border rounded-xl px-3 py-2 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 w-72"
            />
            <button
              type="submit"
              className="font-sans text-sm px-4 py-2 bg-peach-dark/20 hover:bg-peach-dark/30 text-ink rounded-xl transition-colors"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearchInput(""); setSearch(""); setInvPage(1) }}
                className="font-sans text-sm px-3 py-2 text-ink/40 hover:text-ink transition-colors"
              >
                Clear
              </button>
            )}
          </form>

          {invLoading ? (
            <p className="font-sans text-sm text-ink/40">Loading…</p>
          ) : investors.length === 0 ? (
            <p className="font-sans text-sm text-ink/40">No investors found.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-border bg-card">
                    {["#", "Name", "City", "State", "Country", "LinkedIn", "Emails"].map((h) => (
                      <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {investors.map((inv, i) => (
                    <tr key={inv.id} className={i !== investors.length - 1 ? "border-b border-border" : ""}>
                      <td className="py-3 px-4 font-sans text-xs text-ink/30">{inv.sno}</td>
                      <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{inv.name}</td>
                      <td className="py-3 px-4 font-sans text-sm text-ink/70">{inv.city || "—"}</td>
                      <td className="py-3 px-4 font-sans text-sm text-ink/70">{inv.state || "—"}</td>
                      <td className="py-3 px-4 font-sans text-sm text-ink/70">{inv.country || "—"}</td>
                      <td className="py-3 px-4 font-sans text-sm text-ink/60">
                        {inv.linkedin ? (
                          <a href={inv.linkedin} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
                            link
                          </a>
                        ) : "—"}
                      </td>
                      <td className="py-3 px-4 font-sans text-xs text-ink/60">
                        {inv.emails?.length ? inv.emails.join(", ") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {invPageCount > 1 && (
            <div className="flex items-center gap-3 mt-4 justify-end">
              <button
                disabled={invPage <= 1}
                onClick={() => setInvPage((p) => p - 1)}
                className="font-sans text-xs px-3 py-1.5 rounded-lg border border-border text-ink/60 disabled:opacity-30 hover:bg-card transition-colors"
              >
                Prev
              </button>
              <span className="font-sans text-xs text-ink/40">
                {invPage} / {invPageCount}
              </span>
              <button
                disabled={invPage >= invPageCount}
                onClick={() => setInvPage((p) => p + 1)}
                className="font-sans text-xs px-3 py-1.5 rounded-lg border border-border text-ink/60 disabled:opacity-30 hover:bg-card transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Transactions tab */}
      {tab === "transactions" && (
        <>
          {txLoading ? (
            <p className="font-sans text-sm text-ink/40">Loading…</p>
          ) : transactions.length === 0 ? (
            <p className="font-sans text-sm text-ink/40">No purchases yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border bg-card">
                    {["#", "Name", "Email", "Amount", "Payment ID", "Date", "Access"].map((h) => (
                      <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={tx.id} className={i !== transactions.length - 1 ? "border-b border-border" : ""}>
                      <td className="py-3 px-4 font-sans text-xs text-ink/30">{(txPage - 1) * 10 + i + 1}</td>
                      <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{tx.userName}</td>
                      <td className="py-3 px-4 font-sans text-sm text-ink/70">{tx.userEmail}</td>
                      <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{fmtAmount(tx.amountPaid ?? tx.price)}</td>
                      <td className="py-3 px-4 font-sans text-xs text-ink/50">{tx.razorpayPaymentId ?? "—"}</td>
                      <td className="py-3 px-4 font-sans text-xs text-ink/50">{fmt(tx.createdAt)}</td>
                      <td className="py-3 px-4">
                        {tx.downloadToken ? (
                          <button
                            onClick={() => revokeAccess(tx.id, tx.userName)}
                            disabled={revoking === tx.id}
                            className="font-sans text-[11px] text-red-500 hover:underline disabled:opacity-40"
                          >
                            {revoking === tx.id ? "Revoking…" : "Revoke"}
                          </button>
                        ) : (
                          <span className="font-sans text-[11px] text-ink/30">Revoked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {txPageCount > 1 && (
            <div className="flex items-center gap-3 mt-4 justify-end">
              <button
                disabled={txPage <= 1}
                onClick={() => setTxPage((p) => p - 1)}
                className="font-sans text-xs px-3 py-1.5 rounded-lg border border-border text-ink/60 disabled:opacity-30 hover:bg-card transition-colors"
              >
                Prev
              </button>
              <span className="font-sans text-xs text-ink/40">
                {txPage} / {txPageCount}
              </span>
              <button
                disabled={txPage >= txPageCount}
                onClick={() => setTxPage((p) => p + 1)}
                className="font-sans text-xs px-3 py-1.5 rounded-lg border border-border text-ink/60 disabled:opacity-30 hover:bg-card transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

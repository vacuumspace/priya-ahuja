"use client"

import { useEffect, useState } from "react"
import { Star, X } from "lucide-react"
import { DEFAULT_PRIYA_GPT_PERSONALITY, DEFAULT_PRIYA_GPT_RULES } from "@/lib/priya-gpt-defaults"
import { FormattedMessage } from "@/lib/format-chat-message"

type SessionRow = {
  id: string
  userId: string
  userName: string
  userEmail: string
  startedAt: string
  expiresAt: string
  rating: number | null
  messageCount: number
}

type Insights = {
  totalSessions: number
  totalMessages: number
  totalUsers: number
  totalRevenue: number
  totalMinutes: number
  avgMessagesPerSession: number
  topics: { term: string; count: number }[]
  faqs: { question: string; count: number }[]
}

function fmtMinutesShort(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

type SessionWithMessages = {
  id: string
  startedAt: string
  expiresAt: string
  rating: number | null
  messages: { id: string; role: string; content: string; createdAt: string }[]
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-ink/30">—</span>
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={12} className={n <= rating ? "fill-peach-dark text-peach-dark" : "text-ink/20"} />
      ))}
    </div>
  )
}

function fmtAmount(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN")
}

function fmtDate(d: string | null) {
  if (!d) return "—"
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d))
}

// ─── Chats Tab ──────────────────────────────────────────────────────────────

function ChatsTab() {
  const [sessions, setSessions] = useState<SessionRow[] | null>(null)
  const [spentByUser, setSpentByUser] = useState<Record<string, number>>({})
  const [minutesByUser, setMinutesByUser] = useState<Record<string, number>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<SessionWithMessages | null>(null)
  const [loadingTranscript, setLoadingTranscript] = useState(false)

  useEffect(() => {
    fetch("/api/admin/priya-gpt/sessions")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions))
    fetch("/api/admin/priya-gpt")
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, number> = {}
        const minMap: Record<string, number> = {}
        for (const u of d.users ?? []) {
          map[u.userId] = u.spent
          minMap[u.userId] = u.minutesUsed ?? 0
        }
        setSpentByUser(map)
        setMinutesByUser(minMap)
      })
  }, [])

  function selectSession(id: string) {
    setSelectedId(id)
    setTranscript(null)
    setLoadingTranscript(true)
    fetch(`/api/admin/priya-gpt/messages?sessionId=${id}`)
      .then((r) => r.json())
      .then((d) => setTranscript(d.sessions?.[0] ?? null))
      .finally(() => setLoadingTranscript(false))
  }

  if (!sessions) return <div className="text-center py-12 text-ink/40">Loading…</div>

  if (sessions.length === 0) {
    return <div className="text-center py-12 text-ink/40">No PriyaGPT chats yet.</div>
  }

  const compact = Boolean(selectedId)

  return (
    <div className="flex gap-4 h-[70vh]">
      {/* Left: dated list */}
      <div className={`${compact ? "w-[260px]" : "w-full"} flex-shrink-0 rounded-xl border border-peach-dark/20 overflow-y-auto transition-all`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-peach-dark/10 text-left sticky top-0">
              <th className="px-3 py-2 font-medium text-ink/60 w-10">S.No</th>
              <th className="px-3 py-2 font-medium text-ink/60">User</th>
              {!compact && (
                <>
                  <th className="px-3 py-2 font-medium text-ink/60">Msgs</th>
                  <th className="px-3 py-2 font-medium text-ink/60">Total paid</th>
                  <th className="px-3 py-2 font-medium text-ink/60">Total time</th>
                  <th className="px-3 py-2 font-medium text-ink/60">Rating</th>
                  <th className="px-3 py-2 font-medium text-ink/60">Time</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <FragmentRow
                key={s.id}
                s={s}
                index={i + 1}
                totalPaid={spentByUser[s.userId] ?? 0}
                totalMinutes={minutesByUser[s.userId] ?? 0}
                active={selectedId === s.id}
                compact={compact}
                onClick={() => selectSession(s.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: transcript split panel */}
      {selectedId && (
        <div className="flex-1 rounded-xl border border-peach-dark/20 overflow-hidden flex flex-col">
          {loadingTranscript ? (
            <div className="flex-1 flex items-center justify-center text-ink/40 text-sm">Loading transcript…</div>
          ) : !transcript ? (
            <div className="flex-1 flex items-center justify-center text-ink/40 text-sm">Could not load transcript.</div>
          ) : (
            <>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-peach-dark/20 bg-peach-dark/5">
                <p className="text-xs font-sans text-ink/50">Session started {fmtDate(transcript.startedAt)}</p>
                <div className="flex items-center gap-2">
                  <StarRating rating={transcript.rating} />
                  <button
                    onClick={() => {
                      setSelectedId(null)
                      setTranscript(null)
                    }}
                    aria-label="close transcript"
                    className="p-1 rounded-full text-ink/40 hover:text-ink hover:bg-peach-dark/20 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1.5">
                {transcript.messages.length === 0 ? (
                  <p className="text-xs text-ink/40 italic">No messages in this session.</p>
                ) : (
                  transcript.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[70%] rounded-lg px-3 py-1.5 text-xs font-sans leading-relaxed ${
                        m.role === "user" ? "self-end bg-ink text-cream" : "self-start bg-peach-dark/20 text-ink"
                      }`}
                    >
                      <FormattedMessage content={m.content} />
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function fmtMinutes(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function fmtDateTime(d: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d))
}

function FragmentRow({
  s,
  index,
  totalPaid,
  totalMinutes,
  active,
  compact,
  onClick,
}: {
  s: SessionRow
  index: number
  totalPaid: number
  totalMinutes: number
  active: boolean
  compact: boolean
  onClick: () => void
}) {
  if (compact) {
    return (
      <tr
        onClick={onClick}
        className={`cursor-pointer border-t border-peach-dark/10 transition-colors ${
          active ? "bg-peach-dark/20" : "hover:bg-peach-dark/5"
        }`}
      >
        <td className="px-3 py-2 text-ink/50">{index}</td>
        <td className="px-3 py-2 font-medium text-ink truncate">{s.userName}</td>
      </tr>
    )
  }

  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer border-t border-peach-dark/10 transition-colors ${
        active ? "bg-peach-dark/20" : "hover:bg-peach-dark/5"
      }`}
    >
      <td className="px-3 py-2 text-ink/50">{index}</td>
      <td className="px-3 py-2">
        <div className="font-medium text-ink">{s.userName}</div>
        <div className="text-[11px] text-ink/50">{s.userEmail}</div>
      </td>
      <td className="px-3 py-2 text-ink/70">{s.messageCount}</td>
      <td className="px-3 py-2 font-medium text-ink whitespace-nowrap">{fmtAmount(totalPaid)}</td>
      <td className="px-3 py-2 text-ink/70 whitespace-nowrap">{fmtMinutes(totalMinutes)}</td>
      <td className="px-3 py-2 whitespace-nowrap">
        <StarRating rating={s.rating} />
      </td>
      <td className="px-3 py-2 text-ink/50 whitespace-nowrap">{fmtDateTime(s.startedAt)}</td>
    </tr>
  )
}

// ─── Insights Tab ───────────────────────────────────────────────────────────

function InsightsTab() {
  const [insights, setInsights] = useState<Insights | null>(null)

  useEffect(() => {
    fetch("/api/admin/priya-gpt")
      .then((r) => r.json())
      .then((d) => setInsights(d.insights))
  }, [])

  if (!insights) return <div className="text-center py-12 text-ink/40">Loading…</div>

  const cards = [
    { label: "Total revenue", value: fmtAmount(insights.totalRevenue) },
    { label: "Active users", value: String(insights.totalUsers) },
    { label: "Total sessions", value: String(insights.totalSessions) },
    { label: "Total messages", value: String(insights.totalMessages) },
    { label: "Minutes of chat", value: fmtMinutesShort(insights.totalMinutes) },
    { label: "Avg messages / session", value: String(insights.avgMessagesPerSession) },
  ]

  const maxTopicCount = Math.max(...insights.topics.map((t) => t.count), 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2.5">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-lg px-3 py-2 min-w-[110px]">
            <p className="text-[10px] text-ink/40 whitespace-nowrap">{c.label}</p>
            <p className="text-sm font-heading font-bold text-ink mt-0.5">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-sans font-semibold text-ink/50 uppercase tracking-wide mb-3">
            Most talked-about topics
          </p>
          {insights.topics.length === 0 ? (
            <p className="text-xs text-ink/40 italic">Not enough chat data yet.</p>
          ) : (
            <div className="space-y-2">
              {insights.topics.map((t) => (
                <div key={t.term} className="flex items-center gap-2">
                  <span className="text-xs font-sans text-ink w-24 truncate capitalize">{t.term}</span>
                  <div className="flex-1 h-2 bg-peach-dark/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-peach-dark/60 rounded-full"
                      style={{ width: `${(t.count / maxTopicCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-ink/40 w-6 text-right">{t.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-sans font-semibold text-ink/50 uppercase tracking-wide mb-3">
            Common questions founders ask
          </p>
          {insights.faqs.length === 0 ? (
            <p className="text-xs text-ink/40 italic">Not enough chat data yet.</p>
          ) : (
            <ol className="space-y-2.5 list-decimal list-inside">
              {insights.faqs.map((f, i) => (
                <li key={i} className="text-xs font-sans text-ink leading-snug">
                  {f.question}
                  {f.count > 1 && <span className="text-ink/40"> — asked {f.count}×</span>}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Settings Tab ───────────────────────────────────────────────────────────

type PackageDraft = { price: string; minutes: string } // price in rupees (display), minutes as string for editable inputs

const DEFAULT_PACKAGE_DRAFTS: PackageDraft[] = [
  { price: "99", minutes: "30" },
  { price: "149", minutes: "60" },
]

function parsePackagesSetting(raw: string | undefined): PackageDraft[] {
  if (!raw) return DEFAULT_PACKAGE_DRAFTS
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((p: { price: number; minutes: number }) => ({
        price: String(p.price / 100),
        minutes: String(p.minutes),
      }))
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_PACKAGE_DRAFTS
}

function SettingsTab({ initialSettings }: { initialSettings: Record<string, string> }) {
  const initial = {
    personality: initialSettings["priyagpt_personality"] || DEFAULT_PRIYA_GPT_PERSONALITY,
    rules: initialSettings["priyagpt_rules"] || DEFAULT_PRIYA_GPT_RULES,
    packages: parsePackagesSetting(initialSettings["priyagpt_time_packages"]),
  }

  const [personality, setPersonality] = useState(initial.personality)
  const [rules, setRules] = useState(initial.rules)
  const [packages, setPackages] = useState<PackageDraft[]>(initial.packages)
  const [baseline, setBaseline] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const dirty =
    personality !== baseline.personality ||
    rules !== baseline.rules ||
    JSON.stringify(packages) !== JSON.stringify(baseline.packages)

  function updatePackage(index: number, field: "price" | "minutes", value: string) {
    setPackages((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }

  function addPackage() {
    setPackages((prev) => [...prev, { price: "", minutes: "" }])
  }

  function removePackage(index: number) {
    setPackages((prev) => prev.filter((_, i) => i !== index))
  }

  async function save() {
    setSaving(true)
    setSaved(false)
    const packagesForSave = packages
      .filter((p) => p.price.trim() && p.minutes.trim())
      .map((p) => ({ price: Math.round(parseFloat(p.price) * 100), minutes: Math.round(parseFloat(p.minutes)) }))

    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priyagpt_personality: personality,
        priyagpt_rules: rules,
        priyagpt_time_packages: JSON.stringify(packagesForSave),
      }),
    })
    setSaving(false)
    setSaved(true)
    setBaseline({ personality, rules, packages })
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <label className="block text-xs font-sans font-medium text-ink/60 mb-1.5">Personality</label>
        <textarea
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          rows={3}
          placeholder="e.g. sharp, friendly, direct — no vague generalities"
          className="w-full px-3 py-2 rounded-lg border border-peach-dark/30 bg-card text-sm font-sans text-ink outline-none focus:ring-1 focus:ring-ink/20"
        />
      </div>

      <div>
        <label className="block text-xs font-sans font-medium text-ink/60 mb-1.5">Rules (one per line)</label>
        <textarea
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          rows={4}
          placeholder="e.g. no em dashes&#10;keep responses under 150 words&#10;always ask one clarifying question"
          className="w-full px-3 py-2 rounded-lg border border-peach-dark/30 bg-card text-sm font-sans text-ink outline-none focus:ring-1 focus:ring-ink/20"
        />
      </div>

      <div>
        <label className="block text-xs font-sans font-medium text-ink/60 mb-1.5">Time packages</label>
        <div className="space-y-2">
          {packages.map((pkg, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={pkg.price}
                onChange={(e) => updatePackage(i, "price", e.target.value)}
                type="number"
                placeholder="99"
                className="w-24 px-3 py-2 rounded-lg border border-peach-dark/30 bg-card text-sm font-sans text-ink outline-none focus:ring-1 focus:ring-ink/20"
              />
              <span className="text-xs text-ink/40">₹ for</span>
              <input
                value={pkg.minutes}
                onChange={(e) => updatePackage(i, "minutes", e.target.value)}
                type="number"
                placeholder="30"
                className="w-24 px-3 py-2 rounded-lg border border-peach-dark/30 bg-card text-sm font-sans text-ink outline-none focus:ring-1 focus:ring-ink/20"
              />
              <span className="text-xs text-ink/40">min</span>
              <button
                onClick={() => removePackage(i)}
                className="ml-1 text-xs text-ink/40 hover:text-red-600 transition-colors"
              >
                remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addPackage}
          className="mt-2 text-xs font-sans font-semibold text-peach-dark"
        >
          + add package
        </button>
      </div>

      <button
        onClick={save}
        disabled={saving || !dirty}
        className="px-4 py-2 rounded-lg bg-ink text-cream text-sm font-sans font-semibold disabled:opacity-50"
      >
        {saving ? "saving..." : saved ? "saved ✓" : "save settings"}
      </button>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

type Tab = "chats" | "insights" | "settings"
const TABS: Tab[] = ["chats", "insights", "settings"]

export default function PriyaGptAdminClient({
  initialSettings,
  defaultTab,
}: {
  initialSettings: Record<string, string>
  defaultTab?: string
}) {
  const [tab, setTab] = useState<Tab>((TABS.includes(defaultTab as Tab) ? defaultTab : "chats") as Tab)

  return (
    <div className="px-10 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-800 text-ink">PriyaGPT</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">Chat history, usage insights, and behavior settings.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-peach-dark/10 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-peach text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "chats" && <ChatsTab />}
      {tab === "insights" && <InsightsTab />}
      {tab === "settings" && <SettingsTab initialSettings={initialSettings} />}
    </div>
  )
}

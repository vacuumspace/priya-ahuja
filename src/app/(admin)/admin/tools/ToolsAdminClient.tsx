"use client"

import { useState } from "react"
import Link from "next/link"

type Analytics = {
  total: number
  paid: number
  revenue: number
  recentDays: { date: string; submissions: number }[]
}

function Toggle({ on, onChange, disabled }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      disabled={disabled}
      className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors relative disabled:opacity-50 ${on ? "bg-ink" : "bg-border"}`}
      aria-label={on ? "Turn off" : "Turn on"}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  )
}

export default function ToolsAdminClient({
  initialSettings,
  analytics,
}: {
  initialSettings: Record<string, string>
  analytics: Analytics
}) {
  const [settings, setSettings] = useState(initialSettings)
  const [saving, setSaving] = useState(false)
  const [savedKey, setSavedKey] = useState<string | null>(null)
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({})

  const getSetting = (key: string, fallback = "true") =>
    (settings[key] ?? fallback) !== "false"

  const updateSetting = async (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: String(value) }))
    setSaving(true)
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: String(value) }),
    })
    setSaving(false)
    setSavedKey(key)
    setTimeout(() => setSavedKey(null), 2000)
  }

  const savePrice = async (priceKey: string) => {
    const rupees = parseFloat(priceInputs[priceKey] ?? "")
    if (isNaN(rupees) || rupees <= 0) return
    const paise = Math.round(rupees * 100)
    setSettings((prev) => ({ ...prev, [priceKey]: String(paise) }))
    setPriceInputs((prev) => ({ ...prev, [priceKey]: "" }))
    setSaving(true)
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [priceKey]: String(paise) }),
    })
    setSaving(false)
    setSavedKey(priceKey)
    setTimeout(() => setSavedKey(null), 2000)
  }

  const conversionRate = analytics.total > 0
    ? Math.round((analytics.paid / analytics.total) * 100)
    : 0

  const toolsList = [
    {
      key: "tool_startup_score_live",
      priceKey: "price_startup_score",
      label: "Startup Fundability Score",
      description: "50-question quiz scoring startups on investor criteria. Free score, paid full analysis.",
      href: "/admin/startup-scores",
    },
    {
      key: "tool_startup_idea_score_live",
      priceKey: "price_idea_score",
      label: "Startup Idea Score",
      description: "Startup idea evaluation tool. Free score, paid full analysis.",
      href: "/admin/idea-scores",
    },
  ]

  return (
    <div className="px-10 py-10 space-y-10">
      <div>
        <h1 className="font-heading text-3xl font-800 text-ink">Tools</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">Manage tool availability and view usage analytics.</p>
      </div>

      {/* Tool toggles */}
      <section>
        <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-4">Live Status</p>
        <div className="max-w-2xl space-y-3">
          {toolsList.map((tool) => {
            const isOn = getSetting(tool.key)
            return (
              <div
                key={tool.key}
                className="bg-card border border-border rounded-2xl px-6 py-5 flex items-start justify-between gap-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-heading text-base font-700 text-ink normal-case">{tool.label}</p>
                    <span className={`text-[10px] font-sans px-2 py-0.5 rounded font-medium ${
                      isOn ? "bg-green-100 text-green-800" : "bg-border text-ink/40"
                    }`}>
                      {isOn ? "live" : "off"}
                    </span>
                    {(savedKey === tool.key || savedKey === tool.priceKey) && (
                      <span className="text-[10px] font-sans text-ink/40">saved ✓</span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-ink/50 leading-relaxed mb-2">{tool.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-sans text-ink/50">price:</span>
                    <span className="text-[11px] font-sans font-semibold text-ink">
                      ₹{((parseInt(settings[tool.priceKey] ?? "49900", 10)) / 100).toLocaleString("en-IN")}
                    </span>
                    <input
                      type="number"
                      placeholder="new price ₹"
                      value={priceInputs[tool.priceKey] ?? ""}
                      onChange={(e) => setPriceInputs((p) => ({ ...p, [tool.priceKey]: e.target.value }))}
                      className="w-24 text-xs font-sans bg-peach-dark/10 border border-peach-dark/20 rounded-lg px-2 py-1 text-ink focus:outline-none"
                    />
                    <button
                      onClick={() => savePrice(tool.priceKey)}
                      disabled={saving || !priceInputs[tool.priceKey]}
                      className="text-[11px] font-sans px-2 py-1 rounded-lg bg-ink text-cream disabled:opacity-30"
                    >
                      save
                    </button>
                  </div>
                  <Link
                    href={tool.href}
                    className="text-[11px] font-sans text-peach-dark hover:underline mt-2 inline-block"
                  >
                    view submissions →
                  </Link>
                </div>
                <Toggle
                  on={isOn}
                  onChange={(v) => updateSetting(tool.key, v)}
                  disabled={saving}
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* Site live toggle (pre-existing) */}
      <section>
        <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-4">Site Settings</p>
        <div className="max-w-2xl">
          <div className="bg-card border border-border rounded-2xl px-6 py-5 flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-heading text-base font-700 text-ink normal-case">Booking Live</p>
                <span className={`text-[10px] font-sans px-2 py-0.5 rounded font-medium ${
                  getSetting("live") ? "bg-green-100 text-green-800" : "bg-border text-ink/40"
                }`}>
                  {getSetting("live") ? "on" : "off"}
                </span>
                {savedKey === "live" && (
                  <span className="text-[10px] font-sans text-ink/40">saved ✓</span>
                )}
              </div>
              <p className="font-sans text-xs text-ink/50 leading-relaxed">
                Enable booking and session scheduling for users. When off, the connect/booking flow is hidden from the public site.
              </p>
            </div>
            <Toggle
              on={getSetting("live")}
              onChange={(v) => updateSetting("live", v)}
              disabled={saving}
            />
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section>
        <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-4">Startup Score — Analytics</p>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mb-6">
          {[
            { label: "total submissions", value: analytics.total },
            { label: "paid unlocks", value: analytics.paid },
            { label: "conversion rate", value: `${conversionRate}%` },
            { label: "revenue", value: `₹${analytics.revenue.toLocaleString("en-IN")}` },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl px-5 py-4">
              <p className="font-heading text-2xl font-bold text-ink">{stat.value}</p>
              <p className="font-sans text-[11px] text-ink/40 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        {analytics.recentDays.length > 0 ? (
          <div className="max-w-2xl bg-card border border-border rounded-2xl p-6">
            <p className="font-sans text-[11px] text-ink/40 uppercase tracking-widest mb-4">submissions — last 7 days</p>
            <div className="space-y-2">
              {analytics.recentDays.map((day) => {
                const maxSubmissions = Math.max(...analytics.recentDays.map((d) => Number(d.submissions)), 1)
                const pct = (Number(day.submissions) / maxSubmissions) * 100
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="font-sans text-[11px] text-ink/50 w-24 flex-shrink-0">
                      {new Date(day.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                    <div className="flex-1 h-2 bg-border rounded-full">
                      <div
                        className="h-2 bg-peach-dark rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-sans text-[11px] text-ink/50 w-6 text-right flex-shrink-0">
                      {day.submissions}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl bg-card border border-border rounded-2xl px-6 py-8 text-center">
            <p className="font-sans text-sm text-ink/40">no submissions yet — share the tool to get your first data point.</p>
          </div>
        )}
      </section>
    </div>
  )
}

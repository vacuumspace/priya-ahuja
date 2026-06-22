"use client"

import { useState, useCallback, useRef, useEffect } from "react"

type Template = {
  id: string
  label: string
  description: string
  autoIncludes: string[]
  fields: { key: string; label: string; multiline?: boolean; placeholder: string }[]
}

const TEMPLATES: Template[] = [
  {
    id: "confirmation",
    label: "Booking Confirmed",
    description: "Sent to the user when a booking is confirmed or payment is verified.",
    autoIncludes: ["client name", "service name", "date & time", "meet link"],
    fields: [
      { key: "email_confirmation_subject", label: "Subject line", placeholder: "Booking Confirmed: Your session is locked in" },
      { key: "email_confirmation_intro", label: "Intro text", placeholder: "Your session is booked and confirmed!", multiline: false },
      { key: "email_confirmation_footer", label: "Footer / signature", multiline: true, placeholder: "Questions? Reply to this email or reach out on LinkedIn.\n\n— Priya Ahuja" },
    ],
  },
  {
    id: "admin",
    label: "New Booking (Admin)",
    description: "Sent to you when any new booking is received.",
    autoIncludes: ["client name", "client email", "service name", "date & time"],
    fields: [
      { key: "email_admin_subject", label: "Subject line", placeholder: "New Booking: Someone just booked" },
      { key: "email_admin_intro", label: "Intro text", placeholder: "A new booking has been received." },
    ],
  },
  {
    id: "cancellation",
    label: "Booking Cancelled",
    description: "Sent to both user and admin when a booking is cancelled.",
    autoIncludes: ["client name", "service name"],
    fields: [
      { key: "email_cancellation_subject", label: "Subject line", placeholder: "Booking Cancelled" },
      { key: "email_cancellation_body", label: "Body text", placeholder: "Your booking has been cancelled. We hope to see you again soon.", multiline: false },
      { key: "email_cancellation_footer", label: "Footer / signature", multiline: true, placeholder: "— Priya Ahuja" },
    ],
  },
  {
    id: "download",
    label: "Download Link",
    description: "Sent to users after purchasing a template or digital product.",
    autoIncludes: ["client name", "product name", "download link"],
    fields: [
      { key: "email_download_subject", label: "Subject line", placeholder: "Your download is ready" },
      { key: "email_download_intro", label: "Intro text", placeholder: "Thank you for your purchase! Your download is ready." },
      { key: "email_download_footer", label: "Footer / signature", multiline: true, placeholder: "This link expires in 48 hours.\n\n— Priya Ahuja" },
    ],
  },
]

export default function EmailTemplatesClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState("confirmation")
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings)
  const [dirty, setDirty] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")
  const [previewLoading, setPreviewLoading] = useState(false)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const merged = { ...settings, ...dirty }

  const loadPreview = useCallback(async (templateId: string, fields: Record<string, string>) => {
    setPreviewLoading(true)
    const res = await fetch("/api/admin/email-templates/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: templateId, fields }),
    })
    const html = await res.text()
    setPreviewHtml(html)
    setPreviewLoading(false)
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (previewTimer.current) clearTimeout(previewTimer.current)
    previewTimer.current = setTimeout(() => {
      loadPreview(activeTab, merged)
    }, 400)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, JSON.stringify(merged)])

  const handleChange = (key: string, value: string) => {
    setDirty((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!Object.keys(dirty).length) return
    setSaving(true)
    await fetch("/api/admin/email-templates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dirty),
    })
    setSettings((prev) => ({ ...prev, ...dirty }))
    setDirty({})
    setSaving(false)
  }

  const template = TEMPLATES.find((t) => t.id === activeTab)!
  const hasDirty = Object.keys(dirty).length > 0

  return (
    <div className="px-10 py-10 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Email Templates</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">Edit the content of each email. Changes are previewed live.</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setDirty({}) }}
            className={`px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === t.id
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Editor panel */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
          <p className="font-sans text-xs text-ink/50 leading-relaxed">{template.description}</p>

          {/* Auto-included data notice */}
          <div>
            <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wider mb-1.5">Auto-included in this email</p>
            <div className="flex flex-wrap gap-1">
              {template.autoIncludes.map((item) => (
                <span key={item} className="text-[10px] font-sans bg-peach/40 text-ink/60 px-2 py-0.5 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {template.fields.map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-ink/60 uppercase tracking-wider">
                {f.label}
              </label>
              {f.multiline ? (
                <textarea
                  rows={4}
                  value={merged[f.key] ?? ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full text-xs font-sans bg-card border border-border rounded-lg px-3 py-2 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 resize-none leading-relaxed"
                />
              ) : (
                <input
                  type="text"
                  value={merged[f.key] ?? ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full text-xs font-sans bg-card border border-border rounded-lg px-3 py-2 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50"
                />
              )}
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={!hasDirty || saving}
            className="mt-2 w-full py-2.5 text-xs font-sans font-semibold bg-peach-dark text-white rounded-xl disabled:opacity-40 transition-opacity"
          >
            {saving ? "Saving…" : hasDirty ? "Save changes" : "Saved"}
          </button>
        </div>

        {/* Preview panel */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-sans font-semibold text-ink/40 uppercase tracking-wider">Preview</span>
            {previewLoading && <span className="text-[10px] font-sans text-ink/30">Updating…</span>}
          </div>
          <div className="flex-1 rounded-2xl border border-border overflow-hidden bg-white">
            <iframe
              srcDoc={previewHtml}
              className="w-full h-full"
              title="Email preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

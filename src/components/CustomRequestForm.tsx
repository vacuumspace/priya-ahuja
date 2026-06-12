"use client"

import { useState } from "react"
import { Loader2, CheckCircle } from "lucide-react"

interface CustomRequestFormProps {
  source: string
}

export function CustomRequestForm({ source }: CustomRequestFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/custom-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, source }),
    })

    setLoading(false)
    if (res.ok) {
      setSuccess(true)
    } else {
      setError("Something went wrong. Please try again.")
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-sm font-sans text-ink/60 mt-2">
        <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
        got it — i&apos;ll be in touch soon
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-sans font-semibold text-peach-dark hover:underline mt-2 text-left"
      >
        looking for something else? send me the details
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 w-full max-w-md">
      <p className="text-xs font-sans font-semibold text-ink/60 uppercase tracking-wide">send me the details</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-sans font-semibold text-ink/50 uppercase tracking-wide mb-1">
            name <span className="text-peach-dark">*</span>
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="your name"
            className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] font-sans font-semibold text-ink/50 uppercase tracking-wide mb-1">
            email <span className="text-peach-dark">*</span>
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-sans font-semibold text-ink/50 uppercase tracking-wide mb-1">
          what are you looking for? <span className="text-peach-dark">*</span>
        </label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="describe what you need..."
          rows={3}
          className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors resize-none"
        />
      </div>
      {error && <p className="text-xs font-sans text-red-500">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-ink text-cream text-sm font-sans font-semibold px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors disabled:opacity-50"
        >
          {loading ? <><Loader2 size={13} className="animate-spin" />sending…</> : "send"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-sans text-ink/40 hover:text-ink/70 transition-colors"
        >
          cancel
        </button>
      </div>
    </form>
  )
}

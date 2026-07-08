"use client"

import { useState } from "react"
import { Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

interface CustomRequestFormProps {
  source: string
  userEmail?: string
}

export function CustomRequestForm({ source, userEmail }: CustomRequestFormProps) {
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
      body: JSON.stringify({ email: userEmail, message, source }),
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
        got it - i&apos;ll be in touch soon
      </div>
    )
  }

  return (
    <div className="mt-3 w-full max-w-md text-left">
      <p className="text-sm font-sans font-semibold text-peach-dark mb-3">looking for something else? send me the details</p>

      {!userEmail ? (
        <div className="bg-peach/10 border border-peach-dark/20 rounded-xl px-4 py-4 flex flex-col gap-2">
          <p className="text-sm font-sans text-ink/60">sign in to send a request</p>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center bg-ink text-cream text-sm font-sans font-semibold px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors w-fit"
          >
            sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[12px] font-sans font-semibold text-ink/50 uppercase tracking-wide mb-1">
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
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-ink text-cream text-sm font-sans font-semibold px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors disabled:opacity-50 w-fit"
          >
            {loading ? <><Loader2 size={13} className="animate-spin" />sending…</> : "send"}
          </button>
        </form>
      )}
    </div>
  )
}

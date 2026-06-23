"use client"

import { useState } from "react"
import { Star, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function FeedbackForm({
  bookingId,
  serviceTitle,
  existingRating,
  existingText,
}: {
  bookingId: string
  serviceTitle: string
  existingRating: number | null | undefined
  existingText: string | null | undefined
}) {
  const [rating, setRating] = useState<number>(existingRating ?? 0)
  const [hovered, setHovered] = useState<number>(0)
  const [text, setText] = useState(existingText ?? "")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(!!existingRating)
  const [error, setError] = useState("")

  const alreadySubmitted = !!existingRating

  async function submit() {
    if (rating === 0) { setError("Please select a rating."); return }
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit")
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-10 space-y-4">
        <CheckCircle size={48} className="text-peach-dark mx-auto" />
        <h1 className="font-heading text-2xl font-800 text-ink">
          {alreadySubmitted && !loading ? "feedback received" : "thank you!"}
        </h1>
        <p className="font-sans text-sm text-ink/60 leading-relaxed">
          {alreadySubmitted && !loading
            ? "you've already shared your feedback for this session."
            : "your feedback means a lot and helps me keep improving."}
        </p>
        <Link href="/my-activity" className="inline-block mt-4 text-xs font-sans font-semibold text-peach-dark hover:underline">
          ← back to my activity
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-sans text-ink/40 uppercase tracking-widest mb-2">feedback</p>
        <h1 className="font-heading text-3xl font-800 text-ink leading-tight mb-2">
          how was the session?
        </h1>
        <p className="font-sans text-sm text-ink/50">{serviceTitle}</p>
      </div>

      {/* Star rating */}
      <div className="space-y-2">
        <p className="text-xs font-sans text-ink/60">your rating</p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={36}
                className={`transition-colors ${
                  n <= (hovered || rating)
                    ? "fill-peach-dark text-peach-dark"
                    : "fill-transparent text-border"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-[11px] font-sans text-ink/40 h-4">
          {(hovered || rating) === 1 && "needs improvement"}
          {(hovered || rating) === 2 && "it was okay"}
          {(hovered || rating) === 3 && "pretty good"}
          {(hovered || rating) === 4 && "really helpful"}
          {(hovered || rating) === 5 && "absolutely loved it!"}
        </p>
      </div>

      {/* Text */}
      <div className="space-y-1.5">
        <p className="text-xs font-sans text-ink/60">anything you'd like to share? <span className="text-ink/30">(optional)</span></p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="what worked, what could be better, what you're taking away…"
          rows={4}
          className="bg-white border-border text-sm resize-none"
        />
      </div>

      {error && <p className="text-xs font-sans text-red-500">{error}</p>}

      <Button
        onClick={submit}
        disabled={loading || rating === 0}
        className="w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-3 rounded-xl disabled:opacity-40"
      >
        {loading ? "submitting…" : "submit feedback"}
      </Button>
    </div>
  )
}

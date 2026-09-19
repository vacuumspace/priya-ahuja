"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ClaimGift({
  token,
  isSignedIn,
  courseSlug,
  launchLabel,
}: {
  token: string
  isSignedIn: boolean
  courseSlug: string
  launchLabel: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [claimed, setClaimed] = useState(false)

  if (claimed) {
    return (
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-full mb-4">
          <CheckCircle size={14} /> it&apos;s yours
        </span>
        <p className="font-sans text-sm text-ink/70 leading-relaxed mb-5 max-w-sm mx-auto">
          You now have full access to the course, with its free gifts. The course launches on {launchLabel}.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/my-activity?tab=courses"
            className="inline-flex items-center h-11 px-6 rounded-xl bg-peach-dark text-[#1a1a1a] hover:bg-peach-dark/85 font-sans font-semibold text-sm transition-colors"
          >
            see it in my activity
          </Link>
          <Link
            href={`/school/courses/${courseSlug}`}
            className="inline-flex items-center h-11 px-6 rounded-xl border border-border hover:bg-ink/5 font-sans font-semibold text-sm text-ink transition-colors"
          >
            view the course
          </Link>
        </div>
      </div>
    )
  }

  async function claim() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/courses/gift/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Couldn't claim this gift")
      setClaimed(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center">
      {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}
      {isSignedIn ? (
        <Button
          onClick={claim}
          disabled={loading}
          className="h-12 px-8 bg-peach-dark text-[#1a1a1a] hover:bg-peach-dark/85 font-sans font-semibold text-base rounded-xl disabled:opacity-40"
        >
          {loading ? <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />claiming…</span> : "claim your gift"}
        </Button>
      ) : (
        <>
          <Button
            onClick={() => signIn("google", { callbackUrl: window.location.href })}
            className="h-12 px-8 bg-peach-dark text-[#1a1a1a] hover:bg-peach-dark/85 font-sans font-semibold text-base rounded-xl"
          >
            sign in to claim your gift
          </Button>
          <p className="font-sans text-[12px] text-ink/40 mt-3">a free account keeps your course in one place</p>
        </>
      )}
    </div>
  )
}

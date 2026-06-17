"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { BookOpen, Clock, Play, Lock, X } from "lucide-react"
import type { Course } from "@/lib/courses-data"
import SignInOptions from "@/components/SignInOptions"
import { loadRazorpay } from "@/lib/load-razorpay"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

type ModalState = { type: "idle" } | { type: "sign-in" } | { type: "buy" } | { type: "access" }

type Props = {
  course: Course
  isAuthenticated: boolean
  isPurchased?: boolean
  userEmail?: string
}

const tagColors: Record<string, string> = {
  fundraising: "bg-amber-50 text-amber-700",
  strategy: "bg-blue-50 text-blue-700",
  finance: "bg-green-50 text-green-700",
  growth: "bg-peach/50 text-peach-dark",
  leadership: "bg-purple-50 text-purple-700",
}

export default function CourseCard({ course, isAuthenticated, isPurchased, userEmail }: Props) {
  const { data: session } = useSession()
  const [modal, setModal] = useState<ModalState>({ type: "idle" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function close() {
    setModal({ type: "idle" })
    setError("")
  }

  async function handleBuy(e: React.FormEvent) {
    e.preventDefault()
    const buyName = session?.user?.name ?? ""
    const buyEmail = session?.user?.email ?? userEmail ?? ""
    if (!buyEmail.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/products/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: course.slug, name: buyName, email: buyEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create order")

      await loadRazorpay()
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "Priya Ahuja",
        description: course.title,
        order_id: data.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/products/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                purchaseId: data.purchaseId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) {
              setError(`Payment captured but access setup failed (${verifyData?.error ?? verifyRes.status}). Email team@priyaahuja.in with payment ID: ${response.razorpay_payment_id}`)
              return
            }
            void verifyData
            window.location.reload()
          } catch (err) {
            setError(`Something went wrong after payment. Email team@priyaahuja.in with payment ID: ${response.razorpay_payment_id}. (${err instanceof Error ? err.message : "network error"})`)
          }
        },
        prefill: { name: buyName, email: buyEmail },
        theme: { color: "#1a1a1a" },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const price = `₹${(course.price / 100).toLocaleString("en-IN")}`

  return (
    <>
      <div className={`bg-card border rounded-2xl p-6 transition-all ${course.comingSoon ? "border-border opacity-60" : "border-border hover:border-peach-dark/40 hover:shadow-sm"}`}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-peach/50 flex items-center justify-center flex-shrink-0">
            <BookOpen size={18} className="text-peach-dark" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-[10px] px-2 py-0.5 rounded font-sans font-medium ${tagColors[course.tag] ?? "bg-ink/10 text-ink/50"}`}>
                {course.tag}
              </span>
              {course.comingSoon && (
                <span className="text-[10px] bg-ink/10 text-ink/50 px-2 py-0.5 rounded font-sans">coming soon</span>
              )}
              {isPurchased && (
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-sans font-semibold">enrolled</span>
              )}
            </div>

            <h3 className="font-heading text-base font-700 text-ink mb-1">{course.title}</h3>
            <p className="font-sans text-xs text-ink/55 leading-relaxed mb-3">{course.description}</p>

            <div className="flex items-center gap-4 text-[11px] text-ink/40 font-sans">
              <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
              <span className="flex items-center gap-1"><Play size={11} /> {course.lessons} lessons</span>
            </div>
          </div>

          {!course.comingSoon && (
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <p className="font-sans font-700 text-ink text-sm">{price}</p>

              {isPurchased ? (
                <button
                  onClick={() => setModal({ type: "access" })}
                  className="inline-flex items-center gap-1.5 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors"
                >
                  <Play size={11} />
                  access
                </button>
              ) : (
                <button
                  onClick={() => isAuthenticated ? setModal({ type: "buy" }) : setModal({ type: "sign-in" })}
                  className="inline-flex items-center gap-1.5 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors"
                >
                  <Lock size={11} />
                  enroll
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {modal.type !== "idle" && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <div className="bg-cream rounded-2xl w-full max-w-md shadow-xl">
            {modal.type === "sign-in" && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-xl font-700 text-ink">sign in to enroll</h3>
                    <p className="font-sans text-sm text-ink/50 mt-1">{course.title}</p>
                  </div>
                  <button onClick={close} className="text-ink/40 hover:text-ink transition-colors"><X size={18} /></button>
                </div>
                <p className="font-sans text-sm text-ink/60 mb-6 leading-relaxed">
                  sign in to purchase and access this course from any device, anytime.
                </p>
                <SignInOptions
                  callbackUrl={typeof window !== "undefined" ? window.location.pathname : "/courses"}
                  compact
                />
              </div>
            )}

            {modal.type === "access" && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-heading text-xl font-700 text-ink">accessing your course</h3>
                  <button onClick={close} className="text-ink/40 hover:text-ink transition-colors"><X size={18} /></button>
                </div>
                <p className="font-sans text-sm text-ink/60 leading-relaxed">
                  Please check your email for the course link, ID and password to access it.
                </p>
                <p className="font-sans text-xs text-ink/40 mt-3">
                  Can&apos;t find it? Check your spam folder or email us at <a href="mailto:team@priyaahuja.in" className="underline text-ink/60">team@priyaahuja.in</a>
                </p>
                <button
                  onClick={close}
                  className="mt-6 w-full bg-ink text-cream font-sans font-semibold text-sm py-3 rounded-lg hover:bg-ink/80 transition-colors"
                >
                  got it
                </button>
              </div>
            )}

            {modal.type === "buy" && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-1">{course.tag}</p>
                    <h3 className="font-heading text-xl font-700 text-ink">{course.title}</h3>
                    <p className="font-sans font-700 text-ink mt-1">{price}</p>
                  </div>
                  <button onClick={close} className="text-ink/40 hover:text-ink transition-colors"><X size={18} /></button>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-ink/40 font-sans mb-4">
                  <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Play size={11} /> {course.lessons} lessons</span>
                </div>
                <p className="font-sans text-sm text-ink/60 mb-6 leading-relaxed">
                  Lifetime access. Watch at your own pace, on any device.
                </p>
                <form onSubmit={handleBuy} className="space-y-3">
                  {error && <p className="font-sans text-xs text-red-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-ink text-cream font-sans font-semibold text-sm py-3 rounded-lg hover:bg-ink/80 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Setting up payment…" : `Pay ${price}`}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

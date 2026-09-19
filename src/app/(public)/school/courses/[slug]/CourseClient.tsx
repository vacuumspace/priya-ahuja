"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { ArrowRight, CheckCircle, GraduationCap, Loader2, X, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loadRazorpay } from "@/lib/load-razorpay"
import { formatTimeLeft } from "@/components/StartsInCountdown"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

type Stage = "preregister" | "balance"
type EnrollmentStatus = "preregistered" | "paid" | null

const inr = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`

// Rendered only after mount so the server's "now" can't disagree with the
// client's and cause a hydration mismatch.
export function OfferCountdown({ endsAt, className }: { endsAt: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 30_000)
    return () => { clearTimeout(first); clearInterval(id) }
  }, [])

  if (now === null) return null
  const msLeft = new Date(endsAt).getTime() - now
  if (msLeft <= 0) return null
  return (
    <p className={className ?? "text-[13px] font-sans font-semibold text-peach-dark"}>
      offer ends in {formatTimeLeft(msLeft)}
    </p>
  )
}

type CourseState = {
  courseSlug: string
  courseTitle: string
  isSignedIn: boolean
  isAdmin: boolean
  userName: string
  userEmail: string
  status: EnrollmentStatus
  giftCode: string | null
  offerOpen: boolean
  launched: boolean
  seatsLeft: number
  preRegisterPaise: number
  // Founder-price saving vs the list price, for the pre-register button label.
  savingPaise: number
  // What "balance" charges for this person: the rest of a pre-registration,
  // or the full list price if they never pre-registered.
  balancePaise: number
  launchLabel: string
}

type CourseContextValue = CourseState & {
  loading: boolean
  openModal: (stage: Stage) => void
}

const CourseContext = createContext<CourseContextValue | null>(null)

export function CourseProvider({ children, ...initial }: CourseState & { children: ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<EnrollmentStatus>(initial.status)
  const [giftCode, setGiftCode] = useState<string | null>(initial.giftCode)
  const [modalStage, setModalStage] = useState<Stage | null>(() => {
    if (typeof window === "undefined") return null
    const v = new URLSearchParams(window.location.search).get("enrol")
    return v === "preregister" || v === "balance" ? v : null
  })
  const [name, setName] = useState(initial.userName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Strip the marker so a refresh doesn't keep reopening the modal (it's set
  // by the sign-in redirect in the modal below).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has("enrol")) return
    params.delete("enrol")
    const rest = params.toString()
    window.history.replaceState({}, "", window.location.pathname + (rest ? `?${rest}` : ""))
  }, [])

  const closeModal = () => { setModalStage(null); setError("") }

  async function pay(stage: Stage) {
    setLoading(true)
    setError("")
    let enrollmentId: string | undefined
    try {
      const orderRes = await fetch("/api/courses/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: initial.courseSlug, stage, name }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to start payment")
      enrollmentId = orderData.enrollmentId

      if (orderData.skipPayment) {
        setStatus(orderData.status)
        setGiftCode(orderData.giftCode ?? null)
        setModalStage(null)
        router.refresh()
        return
      }

      await loadRazorpay()
      const verified = await new Promise<{ status: EnrollmentStatus; giftCode: string | null }>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: "INR",
          name: "Priya Ahuja",
          description: stage === "preregister" ? `${initial.courseTitle} - pre-registration` : initial.courseTitle,
          order_id: orderData.orderId,
          prefill: { name, email: initial.userEmail },
          theme: { color: "#1a1a1a" },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            try {
              const verifyRes = await fetch("/api/courses/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  enrollmentId: orderData.enrollmentId,
                  stage,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              })
              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed")
              resolve({ status: verifyData.status, giftCode: verifyData.giftCode ?? null })
            } catch (err) {
              reject(err)
            }
          },
          modal: {
            ondismiss: () => {
              fetch(`/api/courses/${enrollmentId}/abort`, { method: "POST" }).catch(() => {})
              reject(new Error("Payment cancelled"))
            },
          },
        })
        rzp.open()
      })

      setStatus(verified.status)
      setGiftCode(verified.giftCode)
      setModalStage(null)
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      if (msg !== "Payment cancelled") setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const value: CourseContextValue = {
    ...initial,
    status,
    giftCode,
    loading,
    openModal: (stage) => setModalStage(stage),
  }

  const modalPaise = modalStage === "preregister" ? initial.preRegisterPaise : initial.balancePaise

  return (
    <CourseContext.Provider value={value}>
      {children}

      {modalStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={closeModal}>
          <div
            className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute top-4 right-4 text-ink/30 hover:text-ink transition-colors" aria-label="Close">
              <X size={16} />
            </button>

            {!initial.isSignedIn ? (
              <div className="text-center pt-2">
                <GraduationCap size={32} className="text-peach-dark mx-auto mb-3" />
                <p className="font-heading text-base font-700 text-ink mb-1">sign in to continue</p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
                  your course access and free gifts are tied to your account.
                </p>
                <Button
                  onClick={() => signIn("google", { callbackUrl: `${window.location.origin}${window.location.pathname}?enrol=${modalStage}` })}
                  className="h-auto w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-3 rounded-xl"
                >
                  continue with google
                </Button>
              </div>
            ) : (
              <>
                <p className="font-heading text-lg font-700 text-ink mb-4">
                  {modalStage === "preregister" ? "lock your founder price" : "enrol in this course"}
                </p>

                <div className="mb-4">
                  <Label htmlFor="course-name" className="text-xs font-sans text-ink/60 mb-1 block">
                    your name <span className="text-red-400">*</span>
                  </Label>
                  <Input id="course-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="ankit sharma" className="bg-cream border-border text-sm" />
                </div>

                <p className="font-sans text-[13px] text-ink/60 leading-relaxed mb-4">
                  {modalStage === "preregister"
                    ? `locks the founder price. your ${inr(initial.preRegisterPaise)} is adjusted against the final price, and the balance is due on ${initial.launchLabel}. payments are non-refundable.`
                    : "unlocks the course. payments are non-refundable."}
                </p>

                {initial.isAdmin && (
                  <p className="text-[12px] font-sans font-semibold text-amber-700 bg-amber-100 px-3 py-2 rounded-lg mb-4 text-center">
                    admin test mode · no payment needed
                  </p>
                )}

                {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

                <Button
                  onClick={() => pay(modalStage)}
                  disabled={loading || !name.trim()}
                  className="h-auto w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-3 rounded-xl disabled:opacity-40"
                >
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />processing…</span>
                  ) : initial.isAdmin ? (
                    "continue (no payment)"
                  ) : (
                    `pay ${inr(modalPaise)}`
                  )}
                </Button>
                {!initial.isAdmin && <p className="text-[12px] text-ink/30 text-center font-sans mt-3">secure payment via razorpay</p>}
              </>
            )}
          </div>
        </div>
      )}
    </CourseContext.Provider>
  )
}

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const lower = code.toLowerCase()
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(lower).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }).catch(() => {})
      }}
      className="font-mono font-semibold text-peach-dark hover:underline"
      title="copy code"
    >
      {lower}{copied && <span className="text-[12px] text-ink/40 font-sans"> copied</span>}
    </button>
  )
}

// What the visitor can do right now, given the offer window, launch date,
// seats and their own enrolment. Shown near the top and again at the bottom.
export function CourseCta({ className, align = "start", fullWidth = false }: { className?: string; align?: "start" | "center"; fullWidth?: boolean }) {
  const ctx = useContext(CourseContext)
  if (!ctx) return null
  const { status, giftCode, offerOpen, launched, seatsLeft, balancePaise, preRegisterPaise, savingPaise, launchLabel, openModal, loading } = ctx
  const alignCls = align === "center" ? "items-center text-center" : "items-start"
  const btn = `${className ?? "h-auto bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm px-8 py-3 rounded-xl"}${fullWidth ? " w-full" : ""}`

  if (status === "paid") {
    return (
      <div className={`flex flex-col gap-2 ${alignCls}`}>
        <span className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
          <CheckCircle size={12} /> you&apos;re enrolled
        </span>
        {giftCode && (
          <p className="font-sans text-sm text-ink/70 leading-relaxed">
            your free 1:1 code: <CopyCode code={giftCode} />{" "}
            <Link href="/connect/startup-idea-brainstorming" className="text-peach-dark font-semibold hover:underline">book it →</Link>
          </p>
        )}
        <Link href="/fundraise/tools/fundability-score" className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-peach-dark hover:underline">
          <Gift size={13} /> use your free startup score <ArrowRight size={13} />
        </Link>
        <Link href="/my-activity?tab=courses" className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-ink/50 hover:text-ink transition-colors">
          view in my activity <ArrowRight size={13} />
        </Link>
      </div>
    )
  }

  if (status === "preregistered") {
    return (
      <div className={`flex flex-col gap-2 ${alignCls}`}>
        <span className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
          <CheckCircle size={12} /> founder price locked
        </span>
        {launched ? (
          <Button onClick={() => openModal("balance")} disabled={loading} className={btn}>
            pay {inr(balancePaise)} to unlock
          </Button>
        ) : (
          <p className="font-sans text-sm text-ink/70 leading-relaxed">
            balance {inr(balancePaise)} is due when the course launches on {launchLabel}.
          </p>
        )}
      </div>
    )
  }

  if (launched) {
    return (
      <div className={`flex flex-col gap-2 ${alignCls}`}>
        <Button onClick={() => openModal("balance")} disabled={loading} className={btn}>
          enrol for {inr(balancePaise)}
        </Button>
      </div>
    )
  }

  if (offerOpen && seatsLeft > 0) {
    return (
      <div className={`flex flex-col gap-2 ${alignCls}`}>
        <Button onClick={() => openModal("preregister")} disabled={loading} className={btn}>
          save {inr(savingPaise)} and pre-register at {inr(preRegisterPaise)} only
        </Button>
      </div>
    )
  }

  return (
    <p className="font-sans text-sm font-semibold text-ink/60">
      {offerOpen
        ? `all founding seats are taken. the course launches on ${launchLabel}.`
        : `pre-registration has closed. the course launches on ${launchLabel}.`}
    </p>
  )
}

// On phones the offer card scrolls out of view, so the price and the action
// stay pinned to the bottom of the screen for anyone who can still enrol.
export function MobileStickyCta({ priceLabel }: { priceLabel: string }) {
  const ctx = useContext(CourseContext)
  if (!ctx || ctx.status) return null
  const canPreRegister = ctx.offerOpen && !ctx.launched && ctx.seatsLeft > 0
  if (!canPreRegister && !ctx.launched) return null

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-heading text-lg font-800 text-ink leading-none">{priceLabel}</p>
        <p className="font-sans text-[11px] text-ink/50 mt-1 truncate">
          {canPreRegister ? `save ${inr(ctx.savingPaise)}, pay ${inr(ctx.preRegisterPaise)} only` : "lifetime access"}
        </p>
      </div>
      <Button
        onClick={() => ctx.openModal(canPreRegister ? "preregister" : "balance")}
        disabled={ctx.loading}
        className="h-11 bg-peach-dark text-[#1a1a1a] hover:bg-peach-dark/85 font-sans font-semibold text-sm px-6 rounded-xl flex-shrink-0"
      >
        {canPreRegister ? "pre-register" : "enrol now"}
      </Button>
    </div>
  )
}

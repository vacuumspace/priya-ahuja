"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { CheckCircle, Loader2, ArrowRight, X, Video, GraduationCap, IndianRupee } from "lucide-react"
import { loadRazorpay } from "@/lib/load-razorpay"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatWorkshopPrice } from "@/lib/workshop-time"
import { WORKSHOP_SECTORS, type WorkshopSector } from "@/lib/workshop-form-options"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ModalStep = "info" | null

type RegistrationState = {
  isPast: boolean
  existingStatus: string | null
  success: boolean
  isSignedIn: boolean
  loading: boolean
  meetLink: string | null
  referralCode: string | null
  startsAt: string
  openRegister: () => void
}

// Lets the register CTA appear more than once on the page (e.g. near the
// date/time details and again at the end) while sharing one source of truth
// for the flow's state, instead of each button running its own disconnected
// copy of it.
const RegistrationContext = createContext<RegistrationState | null>(null)

function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-ink/30 hover:text-ink transition-colors" aria-label="Close">
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function RegistrationProvider({
  workshopSlug,
  workshopTitle,
  price,
  isPast,
  isSignedIn,
  isAdmin = false,
  userName: initialName,
  userEmail,
  existingStatus,
  initialMeetLink,
  initialReferralCode,
  startsAt,
  children,
}: {
  workshopSlug: string
  workshopTitle: string
  price: number
  isPast: boolean
  isSignedIn: boolean
  isAdmin?: boolean
  userName: string
  userEmail: string
  existingStatus: string | null
  initialMeetLink: string | null
  initialReferralCode: string | null
  startsAt: string
  children: ReactNode
}) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(userEmail)
  const [emailTouched, setEmailTouched] = useState(false)
  const [sector, setSector] = useState<WorkshopSector | "">("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(existingStatus === "confirmed")
  const [meetLink, setMeetLink] = useState(initialMeetLink)
  const [referralCode, setReferralCode] = useState(initialReferralCode)

  const emailInvalid = emailTouched && email.trim() !== "" && !EMAIL_PATTERN.test(email)

  // If someone chooses "sign in instead" from inside the modal, this resumes
  // straight back into it after the Google redirect, instead of making them
  // click register again.
  const [modalStep, setModalStep] = useState<ModalStep>(() => {
    if (typeof window === "undefined") return null
    return new URLSearchParams(window.location.search).get("register") === "1" ? "info" : null
  })

  // Strip the marker so a refresh doesn't keep reopening the modal.
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (!params.has("register")) return
    params.delete("register")
    const rest = params.toString()
    window.history.replaceState({}, "", window.location.pathname + (rest ? `?${rest}` : ""))
  }, [])

  const openRegister = () => setModalStep("info")
  const closeModal = () => { setModalStep(null); setError("") }

  async function handleRegister() {
    if (!isSignedIn && !EMAIL_PATTERN.test(email)) {
      setError("Enter a valid email")
      return
    }

    setLoading(true)
    setError("")
    let registrationId: string | undefined
    try {
      const orderRes = await fetch("/api/workshops/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopSlug, name, email, sector }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order")
      registrationId = orderData.registrationId

      if (orderData.skipPayment) {
        if (orderData.meetLink) setMeetLink(orderData.meetLink)
        if (orderData.referralCode) setReferralCode(orderData.referralCode)
        setSuccess(true)
        setModalStep(null)
        return
      }

      await loadRazorpay()
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: "INR",
          name: "Priya Ahuja",
          description: workshopTitle,
          order_id: orderData.orderId,
          prefill: { name, email },
          theme: { color: "#1a1a1a" },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            try {
              const verifyRes = await fetch("/api/workshops/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  registrationId: orderData.registrationId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              })
              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed")
              if (verifyData.meetLink) setMeetLink(verifyData.meetLink)
              if (verifyData.referralCode) setReferralCode(verifyData.referralCode)
              resolve()
            } catch (err) {
              reject(err)
            }
          },
          modal: {
            ondismiss: () => {
              fetch(`/api/workshops/${registrationId}/abort`, { method: "POST" }).catch(() => {})
              reject(new Error("Payment cancelled"))
            },
          },
        })
        rzp.open()
      })

      setSuccess(true)
      setModalStep(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      if (msg !== "Payment cancelled") setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RegistrationContext.Provider value={{ isPast, existingStatus, success, isSignedIn, loading, meetLink, referralCode, startsAt, openRegister }}>
      {children}

      {modalStep === "info" && (
        <Modal onClose={closeModal}>
          <p className="font-heading text-lg font-700 text-ink mb-4">register for this workshop</p>

          <div className="mb-4">
            <Label htmlFor="name" className="text-xs font-sans text-ink/60 mb-1 block">
              your name <span className="text-red-400">*</span>
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="ankit sharma" required className="bg-cream border-border text-sm" />
          </div>

          <div className="mb-4">
            <Label htmlFor="email" className="text-xs font-sans text-ink/60 mb-1 block">
              your email <span className="text-red-400">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              placeholder="you@example.com"
              required
              disabled={isSignedIn}
              className={`bg-cream text-sm disabled:opacity-70 ${emailInvalid ? "border-red-400 focus-visible:ring-red-400/30" : "border-border"}`}
            />
            {emailInvalid && (
              <p className="text-[12px] font-sans text-red-500 mt-1">enter a valid email address</p>
            )}
            {!isSignedIn && (
              <p className="text-[12px] font-sans text-ink/40 mt-1.5">
                the calendar invite and confirmation go here.{" "}
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?register=1` : "/school/workshops" })}
                  className="text-peach-dark font-semibold hover:underline"
                >
                  sign in instead
                </button>{" "}
                to save this to your account.
              </p>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="sector" className="text-xs font-sans text-ink/60 mb-1 block">
              interested sector <span className="text-red-400">*</span>
            </Label>
            <Select value={sector} onValueChange={(v) => setSector(v as WorkshopSector)}>
              <SelectTrigger id="sector" className="bg-cream border-border text-sm w-full">
                <SelectValue placeholder="select sector" />
              </SelectTrigger>
              <SelectContent>
                {WORKSHOP_SECTORS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdmin && (
            <p className="text-[12px] font-sans font-semibold text-amber-700 bg-amber-100 px-3 py-2 rounded-lg mb-4 text-center">
              admin test mode · no payment needed
            </p>
          )}

          {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

          <Button
            onClick={handleRegister}
            disabled={loading || !name.trim() || !email.trim() || !sector}
            className="h-auto w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-3 rounded-xl disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />registering…</span>
            ) : isAdmin ? (
              "register (no payment)"
            ) : (
              `pay ${formatWorkshopPrice(price)} & register`
            )}
          </Button>
          {!isAdmin && <p className="text-[12px] text-ink/30 text-center font-sans mt-3">secure payment via razorpay</p>}
        </Modal>
      )}
    </RegistrationContext.Provider>
  )
}

// Inline in the "₹999 off a 1:1" gift line of the description (via the
// `[..](#referral)` token) - renders nothing until the visitor has registered
// and has a code to show.
export function ReferralCodeInline() {
  const ctx = useContext(RegistrationContext)
  const [copied, setCopied] = useState(false)
  if (!ctx?.success || !ctx.referralCode) return null
  const code = ctx.referralCode

  return (
    <>
      {" "}· code:{" "}
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }).catch(() => {})
        }}
        className="text-peach-dark font-semibold hover:underline"
        title="copy code"
      >
        {code}
      </button>
      {copied && <span className="text-[12px] text-ink/40"> copied</span>}
    </>
  )
}

// Price row in the details list - swapped for a "registered" tag once the
// visitor has registered, since the price no longer matters to them.
export function PriceOrRegistered({ price }: { price: number }) {
  const ctx = useContext(RegistrationContext)
  if (ctx?.success) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
        <CheckCircle size={12} /> registered
      </span>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-sm font-sans text-ink/70">
      <IndianRupee size={14} className="text-peach-dark" />
      {formatWorkshopPrice(price)}
    </div>
  )
}

function formatTimeLeft(ms: number) {
  const totalMins = Math.floor(ms / 60_000)
  const d = Math.floor(totalMins / 1440)
  const h = Math.floor((totalMins % 1440) / 60)
  const m = totalMins % 60
  return [d > 0 && `${d}d`, (d > 0 || h > 0) && `${h}h`, `${m}m`].filter(Boolean).join(" ")
}

// Rendered only after mount so the server's "now" can't disagree with the
// client's and cause a hydration mismatch.
function StartsInCountdown({ startsAt }: { startsAt: string }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  if (now === null) return null
  const msLeft = new Date(startsAt).getTime() - now
  return (
    <p className="text-[13px] font-sans font-semibold text-peach-dark">
      {msLeft > 0 ? `starting in ${formatTimeLeft(msLeft)}` : "happening now"}
    </p>
  )
}

export function RegisterTrigger({
  label = "register",
  className,
  align = "end",
}: {
  label?: string
  className?: string
  align?: "end" | "center"
}) {
  const ctx = useContext(RegistrationContext)
  if (!ctx) return null
  return (
    <div className={`flex flex-col gap-2 ${align === "center" ? "items-center" : "items-start sm:items-end"}`}>
      {!ctx.isPast && <StartsInCountdown startsAt={ctx.startsAt} />}
      <RegisterAction ctx={ctx} label={label} className={className} />
    </div>
  )
}

function RegisterAction({ ctx, label, className }: { ctx: RegistrationState; label: string; className?: string }) {
  const { isPast, existingStatus, success, isSignedIn, loading, meetLink, openRegister } = ctx

  // Checked before isPast - someone who registered and attended should still
  // see their "registered" status (and their my-activity link) after the
  // workshop ends, not the generic "ended" message for people who never signed up.
  if (success) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {meetLink && !isPast ? (
          <Link
            href={meetLink}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-cream bg-peach-dark px-4 py-2.5 rounded-xl hover:bg-peach-dark/80 transition-colors"
          >
            <Video size={14} /> join on google meet
          </Link>
        ) : isSignedIn ? (
          <Link
            href="/my-activity?tab=workshops"
            className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-ink/50 hover:text-ink transition-colors"
          >
            view in my activity <ArrowRight size={13} />
          </Link>
        ) : null}
      </div>
    )
  }

  if (isPast) {
    return (
      <Link href="/school/workshops" className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-ink/50 hover:text-ink transition-colors">
        registration closed · browse others →
      </Link>
    )
  }

  if (existingStatus === "pending") {
    return (
      <span className="inline-flex items-center text-sm font-sans font-semibold text-amber-700 bg-amber-100 px-4 py-2.5 rounded-xl">
        registration in progress
      </span>
    )
  }

  return (
    <Button
      onClick={openRegister}
      disabled={loading}
      className={className ?? "h-auto bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm px-8 py-2.5 rounded-xl flex-shrink-0"}
    >
      {label}
    </Button>
  )
}

// No file to serve yet - clicking just tells attendees when to expect it,
// in our own themed modal rather than a bare browser alert().
export function PlaybookDownloadTrigger({ label }: { label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-peach-dark font-semibold hover:underline"
      >
        {label}
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="text-center pt-2">
            <GraduationCap size={32} className="text-peach-dark mx-auto mb-3" />
            <p className="font-heading text-base font-700 text-ink mb-1">coming soon</p>
            <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
              the playbook will be shared with everyone here after the workshop.
            </p>
            <Button
              onClick={() => setOpen(false)}
              className="h-auto w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-2.5 rounded-xl"
            >
              got it
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}

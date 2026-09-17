"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { CheckCircle, Loader2, LogIn, ArrowRight, X, Video, GraduationCap } from "lucide-react"
import { loadRazorpay } from "@/lib/load-razorpay"
import SignInOptions from "@/components/SignInOptions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatWorkshopPrice } from "@/lib/workshop-time"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

type ModalStep = "signin" | "info" | null

type RegistrationState = {
  isPast: boolean
  existingStatus: string | null
  success: boolean
  loading: boolean
  meetLink: string | null
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
  children: ReactNode
}) {
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(existingStatus === "confirmed")
  const [meetLink, setMeetLink] = useState(initialMeetLink)

  // After the Google sign-in redirect lands back here, resume straight into
  // the info + payment step rather than making the user click register again.
  const [modalStep, setModalStep] = useState<ModalStep>(() => {
    if (!isSignedIn || typeof window === "undefined") return null
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

  const openRegister = () => setModalStep(isSignedIn ? "info" : "signin")
  const closeModal = () => { setModalStep(null); setError("") }

  async function handleRegister() {
    setLoading(true)
    setError("")
    let registrationId: string | undefined
    try {
      const orderRes = await fetch("/api/workshops/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopSlug, name }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order")
      registrationId = orderData.registrationId

      if (orderData.skipPayment) {
        if (orderData.meetLink) setMeetLink(orderData.meetLink)
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
          prefill: { name, email: userEmail },
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
    <RegistrationContext.Provider value={{ isPast, existingStatus, success, loading, meetLink, openRegister }}>
      {children}

      {modalStep === "signin" && (
        <Modal onClose={closeModal}>
          <div className="text-center pt-2">
            <LogIn size={32} className="text-peach-dark mx-auto mb-3" />
            <p className="font-heading text-base font-700 text-ink mb-1">sign in to register</p>
            <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
              a free account is required to register for this workshop.
            </p>
            <SignInOptions
              callbackUrl={typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?register=1` : "/school/workshops"}
              googleLabel="continue with google"
            />
          </div>
        </Modal>
      )}

      {modalStep === "info" && (
        <Modal onClose={closeModal}>
          <p className="font-heading text-lg font-700 text-ink mb-4">register for this workshop</p>

          <div className="mb-4">
            <Label htmlFor="name" className="text-xs font-sans text-ink/60 mb-1 block">your name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="ankit sharma" required className="bg-cream border-border text-sm" />
          </div>

          <div className="bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2 mb-4">
            <p className="text-[13px] font-sans text-ink/60">
              registering as <span className="font-semibold text-ink">{userEmail}</span>
            </p>
          </div>

          {isAdmin && (
            <p className="text-[12px] font-sans font-semibold text-amber-700 bg-amber-100 px-3 py-2 rounded-lg mb-4 text-center">
              admin test mode · no payment needed
            </p>
          )}

          {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

          <Button
            onClick={handleRegister}
            disabled={loading || !name.trim()}
            className="w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-3 rounded-xl disabled:opacity-40"
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

export function RegisterTrigger({ label = "register", className }: { label?: string; className?: string }) {
  const ctx = useContext(RegistrationContext)
  if (!ctx) return null
  const { isPast, existingStatus, success, loading, meetLink, openRegister } = ctx

  // Checked before isPast - someone who registered and attended should still
  // see their "registered" status (and their my-activity link) after the
  // workshop ends, not the generic "ended" message for people who never signed up.
  if (success) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
          <CheckCircle size={12} /> registered
        </span>
        {meetLink && !isPast ? (
          <Link
            href={meetLink}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-cream bg-peach-dark px-4 py-2.5 rounded-xl hover:bg-peach-dark/80 transition-colors"
          >
            <Video size={14} /> join on google meet
          </Link>
        ) : (
          <Link
            href="/my-activity?tab=workshops"
            className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-ink/50 hover:text-ink transition-colors"
          >
            view in my activity <ArrowRight size={13} />
          </Link>
        )}
      </div>
    )
  }

  if (isPast) {
    return (
      <Link href="/school/workshops" className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-ink/50 hover:text-ink transition-colors">
        workshop ended · browse others →
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
      className={className ?? "bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm px-8 py-2.5 rounded-xl flex-shrink-0"}
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
              className="w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-2.5 rounded-xl"
            >
              got it
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { signIn } from "next-auth/react"
import { ArrowLeft, Gift, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { loadRazorpay } from "@/lib/load-razorpay"
import { GiftLinkActions } from "@/components/GiftLinkActions"
import { GiftCardPreview } from "@/components/GiftCardPreview"
import {
  CARD_MESSAGE_HINT,
  CARD_MESSAGE_MAX,
  DEFAULT_CARD_LINE,
  CARD_NAME_MAX,
  tidy,
  tidyMessage,
  validateCardMessage,
  validateCardName,
} from "@/lib/gift-card"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

const inr = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`

type Step = "how" | "personalise" | "done"

type GiftContextValue = { openGift: () => void }
const GiftContext = createContext<GiftContextValue | null>(null)

type GiftProviderProps = {
  courseSlug: string
  courseTitle: string
  isSignedIn: boolean
  isAdmin: boolean
  userName: string
  userEmail: string
  pricePaise: number
  listPaise: number
  // True while the founder price still applies to a gift (offer open and
  // founding seats left). Such a gift uses one founding seat.
  atFounderPrice: boolean
  offerEndsLabel: string
  launchLabel: string
  children: ReactNode
}

// Holds the gift popup for the whole page, so it can be opened from a button at
// the top and from the quiet line at the end.
export function GiftProvider({
  courseSlug,
  courseTitle,
  isSignedIn,
  isAdmin,
  userName,
  userEmail,
  pricePaise,
  listPaise,
  atFounderPrice,
  offerEndsLabel,
  launchLabel,
  children,
}: GiftProviderProps) {
  // Sign-in returns here with ?gift=1 so the popup reopens where they left off.
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false
    return new URLSearchParams(window.location.search).get("gift") === "1"
  })
  const [step, setStep] = useState<Step>(() => {
    if (typeof window === "undefined") return "how"
    return new URLSearchParams(window.location.search).get("gift") === "1" && isSignedIn ? "personalise" : "how"
  })
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState(DEFAULT_CARD_LINE)
  const [fromName, setFromName] = useState(userName)
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<{ link: string; cardUrl: string; recipient: string } | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has("gift")) return
    params.delete("gift")
    const rest = params.toString()
    window.history.replaceState({}, "", window.location.pathname + (rest ? `?${rest}` : ""))
  }, [])

  const recipientClean = tidy(recipientName)
  const messageClean = tidyMessage(message)
  const fromClean = tidy(fromName)
  const recipientProblem = validateCardName(recipientClean, "the name of the person you're gifting")
  const fromProblem = validateCardName(fromClean, "your name")
  const messageProblem = validateCardMessage(messageClean)
  const formOk = !recipientProblem && !fromProblem && !messageProblem

  function openGift() {
    setError("")
    setStep(result ? "done" : isSignedIn ? "how" : "how")
    setOpen(true)
  }
  const close = () => { setOpen(false); setError("") }

  // Start a fresh gift (people can buy as many as they like).
  function giftAnother() {
    setResult(null)
    setRecipientName("")
    setMessage(DEFAULT_CARD_LINE)
    setTouched(false)
    setError("")
    setStep("personalise")
  }

  async function pay() {
    setTouched(true)
    if (!formOk) return
    setLoading(true)
    setError("")
    let giftId: string | undefined
    try {
      const orderRes = await fetch("/api/courses/gift/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, fromName: fromClean, recipientName: recipientClean, message: messageClean }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to start payment")
      giftId = orderData.giftId

      if (orderData.skipPayment) {
        setResult({ link: orderData.link, cardUrl: orderData.cardUrl.replace(/^https?:\/\/[^/]+/, ""), recipient: recipientClean })
        setStep("done")
        return
      }

      await loadRazorpay()
      const paid = await new Promise<{ link: string; cardUrl: string }>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: "INR",
          name: "Priya Ahuja",
          description: `${courseTitle} - gift`,
          order_id: orderData.orderId,
          prefill: { name: userName, email: userEmail },
          theme: { color: "#1a1a1a" },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            try {
              const verifyRes = await fetch("/api/courses/gift/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  giftId: orderData.giftId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              })
              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed")
              resolve({ link: verifyData.link, cardUrl: verifyData.cardUrl })
            } catch (err) {
              reject(err)
            }
          },
          modal: {
            ondismiss: () => {
              fetch(`/api/courses/gift/${giftId}/abort`, { method: "POST" }).catch(() => {})
              reject(new Error("Payment cancelled"))
            },
          },
        })
        rzp.open()
      })
      setResult({ link: paid.link, cardUrl: paid.cardUrl, recipient: recipientClean })
      setStep("done")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      if (msg !== "Payment cancelled") setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const priceLine = atFounderPrice
    ? `${inr(pricePaise)}, the founder price until ${offerEndsLabel} while founding seats last. ${inr(listPaise)} after that.`
    : `${inr(pricePaise)}, the regular price.`

  const steps = [
    { title: "You pay for their course", text: priceLine },
    { title: "You get a gift card and link", text: "A card with their name and your message, plus a link. Right away here, and in your email." },
    {
      title: "They claim it",
      text: `When they open the link and sign in, they get full access to the course, with its free gifts. No pre-registration needed. The course launches on ${launchLabel}.`,
    },
  ]

  return (
    <GiftContext.Provider value={{ openGift }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6 overflow-y-auto" onClick={close}>
          <div
            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={close} className="absolute top-4 right-4 text-ink/30 hover:text-ink transition-colors" aria-label="Close">
              <X size={16} />
            </button>

            {step === "how" && (
              <div>
                <span className="w-10 h-10 rounded-xl bg-peach-dark/15 flex items-center justify-center mb-4">
                  <Gift size={18} className="text-peach-dark" />
                </span>
                <p className="font-heading text-xl font-800 text-ink normal-case mb-1">Gift this course</p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
                  Give someone who&apos;s dreaming of starting up a clear path from idea to first customers.
                </p>

                <p className="text-[12px] font-sans font-semibold text-peach-dark uppercase tracking-[0.18em] mb-3">how it works</p>
                <ol className="flex flex-col gap-3 mb-5">
                  {steps.map((st, i) => (
                    <li key={st.title} className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-peach-dark/15 text-peach-dark text-[11px] font-sans font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <div>
                        <p className="font-sans text-sm font-semibold text-ink">{st.title}</p>
                        <p className="font-sans text-[13px] text-ink/60 leading-relaxed">{st.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="font-sans text-[12px] text-ink/40 mb-5">
                  Gift as many as you like. Each link works once, for one person.
                </p>

                {isSignedIn ? (
                  <Button
                    onClick={() => setStep("personalise")}
                    className="h-auto w-full bg-peach-dark text-[#1a1a1a] hover:bg-peach-dark/85 font-sans font-semibold text-sm py-3 rounded-xl"
                  >
                    personalise the gift card
                  </Button>
                ) : (
                  <Button
                    onClick={() => signIn("google", { callbackUrl: `${window.location.origin}${window.location.pathname}?gift=1` })}
                    className="h-auto w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-3 rounded-xl"
                  >
                    sign in to continue
                  </Button>
                )}
              </div>
            )}

            {step === "personalise" && (
              <div>
                <button
                  type="button"
                  onClick={() => setStep("how")}
                  className="inline-flex items-center gap-1 text-[12px] font-sans text-ink/50 hover:text-ink mb-3 transition-colors"
                >
                  <ArrowLeft size={12} /> how it works
                </button>
                <p className="font-heading text-xl font-800 text-ink normal-case mb-4">Personalise the gift card</p>

                <div className="mb-4">
                  <GiftCardPreview
                    recipientName={recipientClean}
                    fromName={fromClean}
                    message={messageClean}
                    courseTitle={courseTitle}
                  />
                </div>

                <div className="flex flex-col gap-3.5 mb-4">
                  <div>
                    <Label htmlFor="gift-to" className="text-xs font-sans text-ink/60 mb-1 block">
                      who is it for? <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="gift-to"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      maxLength={CARD_NAME_MAX}
                      placeholder="their name"
                      className="bg-cream border-border text-sm"
                    />
                    {touched && recipientProblem && <p className="text-[12px] font-sans text-red-500 mt-1">{recipientProblem}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gift-message" className="text-xs font-sans text-ink/60 mb-1 block">
                      a line for the middle of the card <span className="text-ink/30">(optional)</span>
                    </Label>
                    <Textarea
                      id="gift-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={CARD_MESSAGE_MAX}
                      rows={3}
                      placeholder={DEFAULT_CARD_LINE}
                      className="bg-cream border-border text-sm resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-[12px] font-sans text-ink/40">{CARD_MESSAGE_HINT}</p>
                      <p className="text-[12px] font-sans text-ink/30">{messageClean.length}/{CARD_MESSAGE_MAX}</p>
                    </div>
                    {touched && messageProblem && <p className="text-[12px] font-sans text-red-500 mt-1">{messageProblem}</p>}
                  </div>
                  <div>
                    <Label htmlFor="gift-from" className="text-xs font-sans text-ink/60 mb-1 block">
                      from <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="gift-from"
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      maxLength={CARD_NAME_MAX}
                      className="bg-cream border-border text-sm"
                    />
                    {touched && fromProblem && <p className="text-[12px] font-sans text-red-500 mt-1">{fromProblem}</p>}
                  </div>
                </div>

                <p className="font-sans text-[12px] text-ink/40 mb-4">
                  You can change this card later from my activity, until it&apos;s claimed.
                </p>

                {isAdmin && (
                  <p className="text-[12px] font-sans font-semibold text-amber-700 bg-amber-100 px-3 py-2 rounded-lg mb-4 text-center">
                    admin test mode · no payment needed
                  </p>
                )}
                {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}

                <Button
                  onClick={pay}
                  disabled={loading}
                  className="h-auto w-full bg-peach-dark text-[#1a1a1a] hover:bg-peach-dark/85 font-sans font-semibold text-sm py-3 rounded-xl disabled:opacity-40"
                >
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />processing…</span>
                  ) : isAdmin ? (
                    "create gift card (no payment)"
                  ) : (
                    "send the gift card & link"
                  )}
                </Button>
                {!isAdmin && <p className="text-[12px] text-ink/30 text-center font-sans mt-3">secure payment via razorpay</p>}
              </div>
            )}

            {step === "done" && result && (
              <div>
                <p className="font-heading text-xl font-800 text-ink normal-case mb-1">Your gift is ready</p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed mb-4">
                  Send the card and the link to {result.recipient}. The link works once, for one person.
                  {!isAdmin && " We've also emailed both to you."} You can edit the card anytime until it&apos;s claimed, from my activity.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.cardUrl} alt={`Gift card for ${result.recipient}`} className="w-full rounded-xl border border-border mb-4" />
                <GiftLinkActions link={result.link} cardUrl={result.cardUrl} courseTitle={courseTitle} recipientName={result.recipient} />
                <p className="font-mono text-[12px] text-ink/60 bg-cream border border-border rounded-lg px-3 py-2.5 break-all mt-4">{result.link}</p>
                <button
                  type="button"
                  onClick={giftAnother}
                  className="mt-5 font-sans text-sm font-semibold text-peach-dark hover:underline underline-offset-4"
                >
                  gift someone else →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </GiftContext.Provider>
  )
}

// A button that opens the gift popup - `hero` for the top of the page, `link`
// for the quiet line at the end.
export function GiftTrigger({ variant = "link", className }: { variant?: "hero" | "link"; className?: string }) {
  const ctx = useContext(GiftContext)
  if (!ctx) return null
  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={ctx.openGift}
        className={
          className ??
          "inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-border text-ink/70 hover:text-ink hover:bg-ink/5 font-sans font-semibold text-[13px] transition-colors"
        }
      >
        <Gift size={13} className="text-peach-dark" /> Gift this course
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={ctx.openGift}
      className={className ?? "mt-2 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-peach-dark hover:underline underline-offset-4"}
    >
      <Gift size={14} /> Gift them this course
    </button>
  )
}

// The quiet section at the end of the page.
export function GiftSection() {
  return (
    <section className="mt-24 pb-10 border-b border-border text-center" aria-label="Gift this course">
      <p className="font-sans text-sm text-ink/60">Know someone who&apos;s dreaming of starting up?</p>
      <GiftTrigger variant="link" />
    </section>
  )
}

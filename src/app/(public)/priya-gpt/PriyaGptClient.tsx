"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { Clock, Star, Smile, Pause, Play, HelpCircle, X, Plus } from "lucide-react"
import { FormattedMessage } from "@/lib/format-chat-message"
import { loadRazorpay } from "@/lib/load-razorpay"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

const EMOJI_PALETTE = [
  "😀", "😂", "🙂", "😅", "😍", "🤔", "😎", "🥲",
  "👍", "👎", "🙏", "🔥", "💡", "🚀", "💰", "✅",
  "❌", "❤️", "🎉", "😬", "😩", "🤝", "📈", "⚡",
]

type GptSession = { id: string; expiresAt: string; pausedAt: string | null }
type ChatMsg = { id: string; role: "user" | "assistant"; content: string }
type TimePackage = { price: number; minutes: number } // price in paise

const DEFAULT_PACKAGES: TimePackage[] = [
  { price: 9900, minutes: 30 },
  { price: 14900, minutes: 60 },
]

const DEFAULT_INTRO_MESSAGES: ChatMsg[] = [
  {
    id: "intro-1",
    role: "assistant",
    content: "Hi, I'm PriyaGPT, trained on Priya's approach to startups, fundraising, and strategy.",
  },
  {
    id: "intro-2",
    role: "assistant",
    content: "Bring me anything: positioning, GTM, pricing, fundraise strategy, or a decision you're stuck on. I'll give you direct, honest takes, not just cheerleading.",
  },
  {
    id: "intro-3",
    role: "assistant",
    content: "Chat time is metered in minutes, you can pause anytime and pick up later. So, what's on your mind?",
  },
]

const INTRO_MESSAGE: ChatMsg = DEFAULT_INTRO_MESSAGES[0]

const ABOUT_POINTS = [
  "trained on Priya's approach to fundraising, GTM, pricing, and startup strategy",
  "ask about anything you're stuck on: positioning, pitch, business model, hiring, whatever",
  "gives direct, honest feedback, not just cheerleading",
  "chat time is metered in minutes; pause anytime, resume later, buy more when you run out",
  "a place to think out loud, not a replacement for a 1:1 session with Priya",
]

function fmtRupees(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN")
}

export default function PriyaGptClient({ isSignedIn, isAdmin }: { isSignedIn: boolean; isAdmin: boolean }) {
  const [session, setSession] = useState<GptSession | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState("")
  const [starting, setStarting] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsPurchase, setNeedsPurchase] = useState(false)
  const [buyingPackage, setBuyingPackage] = useState<number | null>(null) // index of package being purchased
  const [minutesBalance, setMinutesBalance] = useState<number | null>(null)
  const [packages, setPackages] = useState<TimePackage[]>(DEFAULT_PACKAGES)
  const [remainingMs, setRemainingMs] = useState<number | null>(null)
  const [ended, setEnded] = useState(false)
  const [lastSessionId, setLastSessionId] = useState<string | null>(null)
  const [ratingGiven, setRatingGiven] = useState<number | null>(null)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [showRateWidget, setShowRateWidget] = useState(false)
  const [foundersCount, setFoundersCount] = useState(227)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [pausing, setPausing] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showAddTime, setShowAddTime] = useState(false)
  const [revealCounts, setRevealCounts] = useState<Record<string, number>>({})
  const [revealingIds, setRevealingIds] = useState<Record<string, boolean>>({})
  const [focusMessageId, setFocusMessageId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({})

  function revealLineByLine(id: string, content: string) {
    const total = content.length
    setRevealCounts((prev) => ({ ...prev, [id]: 1 }))
    setRevealingIds((prev) => ({ ...prev, [id]: true }))
    setFocusMessageId(id)
    let shown = 1
    // ~1 char every 26ms reads as a smooth typewriter, not a jumpy chunk reveal
    const interval = setInterval(() => {
      shown = Math.min(total, shown + 1)
      setRevealCounts((prev) => ({ ...prev, [id]: shown }))
      if (shown >= total) {
        clearInterval(interval)
        setRevealingIds((prev) => ({ ...prev, [id]: false }))
        setFocusMessageId((prev) => (prev === id ? null : prev))
      }
    }, 26)
  }

  useEffect(() => {
    fetch("/api/priya-gpt/founders-count")
      .then((r) => r.json())
      .then((d) => {
        if (d.count) setFoundersCount(d.count)
      })
  }, [])

  useEffect(() => {
    fetch("/api/priya-gpt/packages")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.packages) && d.packages.length > 0) setPackages(d.packages)
      })
  }, [])

  useEffect(() => {
    if (!isSignedIn) return
    fetch("/api/priya-gpt/session")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.packages) && d.packages.length > 0) setPackages(d.packages)
        if (typeof d.minutesBalance === "number") setMinutesBalance(d.minutesBalance)
        if (d.session) {
          setSession(d.session)
          fetch(`/api/priya-gpt/chat?sessionId=${d.session.id}`)
            .then((r) => r.json())
            .then((cd) => setMessages(cd.messages ?? []))
        }
      })
  }, [isSignedIn])

  useEffect(() => {
    if (!session || session.pausedAt) return

    const tick = () => {
      const ms = new Date(session.expiresAt).getTime() - Date.now()
      setRemainingMs(ms)
      if (ms <= 0) {
        setLastSessionId(session.id)
        setSession(null)
        setEnded(true)
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [session])

  const sessionRef = useRef<GptSession | null>(null)
  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    function pauseIfActive() {
      const active = sessionRef.current
      if (active && !active.pausedAt) {
        navigator.sendBeacon("/api/priya-gpt/session/pause")
      }
    }
    function onVisibilityChange() {
      if (document.hidden) pauseIfActive()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("pagehide", pauseIfActive)
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("pagehide", pauseIfActive)
      pauseIfActive()
    }
  }, [])

  useEffect(() => {
    if (focusMessageId && messageRefs.current[focusMessageId]) {
      messageRefs.current[focusMessageId]?.scrollIntoView({ block: "start", behavior: "smooth" })
    } else {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [messages, focusMessageId])

  function refreshBalance() {
    fetch("/api/priya-gpt/time/balance")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.minutes === "number") setMinutesBalance(d.minutes)
      })
  }

  async function startSession() {
    if (!isSignedIn) {
      signIn("google", { callbackUrl: "/priya-gpt" })
      return
    }
    setStarting(true)
    setError(null)
    setNeedsPurchase(false)
    try {
      const res = await fetch("/api/priya-gpt/session", { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Could not start session")
        if (data.needsPurchase) setNeedsPurchase(true)
        return
      }
      setSession(data.session)
      setMessages([])
      setEnded(false)
      setLastSessionId(null)
      setRatingGiven(null)
      refreshBalance()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start session, please retry")
    } finally {
      setStarting(false)
    }
  }

  // credits already happened server-side; this either extends the running session's timer or, if no session yet, starts a fresh one
  async function applyPurchasedMinutes(pkg: TimePackage) {
    if (session) {
      const extendRes = await fetch("/api/priya-gpt/session/extend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes: pkg.minutes }),
      })
      const extendData = await extendRes.json()
      if (extendRes.ok && extendData.session) {
        setSession(extendData.session)
        refreshBalance()
      } else {
        setError(extendData.error ?? "Could not add time to session")
      }
    } else {
      startSession()
    }
  }

  async function buyPackage(pkg: TimePackage, index: number) {
    if (!isSignedIn) {
      signIn("google", { callbackUrl: "/priya-gpt" })
      return
    }
    setBuyingPackage(index)
    setError(null)
    try {
      if (isAdmin) {
        const grantRes = await fetch("/api/priya-gpt/time/admin-grant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ minutes: pkg.minutes }),
        })
        let grantData: { minutesRemaining?: number; error?: string } = {}
        try {
          grantData = await grantRes.json()
        } catch {
          throw new Error("Could not add time, please retry")
        }
        if (!grantRes.ok) throw new Error(grantData.error || "Could not add time")
        setMinutesBalance(grantData.minutesRemaining ?? null)
        setNeedsPurchase(false)
        setBuyingPackage(null)
        await applyPurchasedMinutes(pkg)
        return
      }

      const orderRes = await fetch("/api/priya-gpt/time/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes: pkg.minutes }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || "Could not start checkout")

      await loadRazorpay()
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: "INR",
        name: "PriyaGPT",
        description: `${pkg.minutes} minutes of chat time`,
        order_id: orderData.orderId,
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          const verifyRes = await fetch("/api/priya-gpt/time/purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyRes.ok) {
            setMinutesBalance(verifyData.minutesRemaining)
            setNeedsPurchase(false)
            setBuyingPackage(null)
            await applyPurchasedMinutes(pkg)
          } else {
            setError(verifyData.error ?? "Could not verify payment")
            setBuyingPackage(null)
          }
        },
        theme: { color: "#2D2D2D" },
        modal: { ondismiss: () => setBuyingPackage(null) },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setBuyingPackage(null)
    }
  }

  async function togglePause() {
    if (!session || pausing) return
    setPausing(true)
    try {
      const endpoint = session.pausedAt ? "/api/priya-gpt/session/resume" : "/api/priya-gpt/session/pause"
      const res = await fetch(endpoint, { method: "POST" })
      const data = await res.json()
      if (res.ok && data.session) {
        setSession(data.session)
      }
    } finally {
      setPausing(false)
    }
  }

  async function submitRating(targetSessionId: string, stars: number) {
    if (submittingRating) return
    setSubmittingRating(true)
    setRatingGiven(stars)
    try {
      await fetch("/api/priya-gpt/session/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: targetSessionId, rating: stars }),
      })
      fetch("/api/priya-gpt/founders-count")
        .then((r) => r.json())
        .then((d) => {
          if (d.count) setFoundersCount(d.count)
        })
    } finally {
      setSubmittingRating(false)
    }
  }

  async function sendMessage() {
    if (!input.trim() || sending) return
    if (!isSignedIn) {
      signIn("google", { callbackUrl: "/priya-gpt" })
      return
    }
    const text = input.trim()
    const tempId = `temp-${Date.now()}`
    setInput("")
    setSending(true)
    setError(null)
    setFocusMessageId(null)
    setMessages((prev) => [...prev, { id: tempId, role: "user", content: text }])
    try {
      let activeSessionId = session?.id ?? null

      if (!activeSessionId) {
        if (!(minutesBalance && minutesBalance > 0)) {
          // can't auto-charge without a payment popup — bail out and open the buy flow for the cheapest package
          setMessages((prev) => prev.filter((m) => m.id !== tempId))
          setInput(text)
          if (packages[0]) buyPackage(packages[0], 0)
          return
        }
        const startRes = await fetch("/api/priya-gpt/session", { method: "POST" })
        const startData = await startRes.json()
        if (!startRes.ok) {
          setMessages((prev) => prev.filter((m) => m.id !== tempId))
          setInput(text)
          setError(startData.error ?? "Could not start session")
          if (startData.needsPurchase) setNeedsPurchase(true)
          return
        }
        activeSessionId = startData.session.id
        setSession(startData.session)
        setEnded(false)
        setLastSessionId(null)
        setRatingGiven(null)
        refreshBalance()
      } else if (session?.pausedAt) {
        const resumeRes = await fetch("/api/priya-gpt/session/resume", { method: "POST" })
        const resumeData = await resumeRes.json()
        if (resumeRes.ok && resumeData.session) {
          activeSessionId = resumeData.session.id
          setSession(resumeData.session)
        }
      }

      const res = await fetch("/api/priya-gpt/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSessionId, message: text }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.expired) {
          setLastSessionId(activeSessionId)
          setSession(null)
          setEnded(true)
        }
        setError(data.error ?? "Something went wrong")
        return
      }
      setMessages((prev) => [...prev, data.message])
      revealLineByLine(data.message.id, data.message.content)
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setInput(text)
      setError(err instanceof Error ? err.message : "Something went wrong, please retry")
    } finally {
      setSending(false)
    }
  }

  const locked = !session
  const displayMessages =
    messages.length > 0 ? [INTRO_MESSAGE, ...messages] : DEFAULT_INTRO_MESSAGES
  const isPaused = Boolean(session?.pausedAt)
  const pausedRemainingMs =
    isPaused && session ? new Date(session.expiresAt).getTime() - new Date(session.pausedAt!).getTime() : null
  const effectiveRemainingMs = isPaused ? pausedRemainingMs : remainingMs
  const remHours = effectiveRemainingMs !== null ? Math.max(0, Math.floor(effectiveRemainingMs / 3600000)) : 0
  const remMinutes = effectiveRemainingMs !== null ? Math.max(0, Math.floor((effectiveRemainingMs % 3600000) / 60000)) : 0
  const remSeconds = effectiveRemainingMs !== null ? Math.max(0, Math.floor((effectiveRemainingMs % 60000) / 1000)) : 0
  const ratableSessionId = session?.id ?? lastSessionId
  const hasBalance = Boolean(minutesBalance && minutesBalance > 0)

  return (
    <div className="w-full">
    {showAbout && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        onClick={() => setShowAbout(false)}
      >
        <div
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-heading text-base font-700 text-ink">about PriyaGPT</p>
            <button
              onClick={() => setShowAbout(false)}
              aria-label="close"
              className="p-1 rounded-full text-ink/40 hover:text-ink hover:bg-peach-dark/20 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <ul className="space-y-2">
            {ABOUT_POINTS.map((point) => (
              <li key={point} className="flex gap-2 font-sans text-sm text-ink/60 leading-snug">
                <span className="text-peach-dark flex-shrink-0">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
    <div className="w-full flex flex-col h-[78vh] rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border bg-peach-dark/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <Image src="/priyadp.jpeg" alt="Priya Ahuja" width={26} height={26} className="rounded-full object-cover" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border-2 border-cream" />
          </div>
          <div className="min-w-0">
            <p className="font-sans text-xs font-semibold text-ink truncate">Priya Ahuja</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAbout(true)}
            aria-label="about PriyaGPT"
            className="flex-shrink-0 p-1 rounded-full text-ink/40 hover:text-ink hover:bg-peach-dark/20 transition-colors"
          >
            <HelpCircle size={15} />
          </button>
          {session && (
            <button
              onClick={togglePause}
              disabled={pausing}
              aria-label={isPaused ? "resume session" : "pause session"}
              className="p-1.5 rounded-full text-ink/60 hover:text-ink hover:bg-peach-dark/20 transition-colors disabled:opacity-50"
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          )}
          <div className="relative">
            {session ? (
              <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-ink/70 bg-peach-dark/20 rounded-full px-3 py-1 whitespace-nowrap">
                <Clock size={13} className="flex-shrink-0" />
                {String(remHours).padStart(2, "0")}:{String(remMinutes).padStart(2, "0")}:{String(remSeconds).padStart(2, "0")}
              </span>
            ) : (
              <button
                onClick={startSession}
                disabled={starting || !hasBalance}
                className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-ink/70 bg-peach-dark/20 rounded-full px-3 py-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-default"
              >
                <Clock size={13} className="flex-shrink-0" />
                {starting ? "starting..." : `${minutesBalance ?? 0} min`}
              </button>
            )}
            <button
              onClick={() => setShowAddTime((v) => !v)}
              aria-label="add time"
              className="absolute -right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-ink/60 bg-cream border border-border hover:text-ink hover:bg-peach-dark/20 transition-colors shadow-sm"
            >
              <Plus size={11} />
            </button>
            {showAddTime && (
              <div className="absolute right-0 top-full mt-1.5 flex flex-col gap-1 p-2 rounded-lg border border-border bg-card shadow-lg z-20 min-w-[160px]">
                <span className="text-[11px] font-sans text-ink/40 px-1">add time</span>
                {packages.map((pkg, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShowAddTime(false)
                      buyPackage(pkg, i)
                    }}
                    disabled={buyingPackage !== null}
                    className="px-2.5 py-1.5 rounded-md bg-peach text-ink text-xs font-sans font-semibold whitespace-nowrap text-left hover:brightness-95 transition disabled:opacity-50"
                  >
                    {buyingPackage === i ? "adding..." : `${pkg.minutes} min (${fmtRupees(pkg.price)})`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {(error || (locked && ended)) && (
        <div className="px-4 py-2 text-xs font-sans border-b border-border bg-red-50/60 text-red-700">
          {ended && !error ? "Your session ended, start a new one to keep going." : error}
        </div>
      )}

      {locked && needsPurchase && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs font-sans border-b border-border bg-peach-dark/5">
          <span className="text-ink/50">add time to keep chatting:</span>
          {packages.map((pkg, i) => (
            <button
              key={i}
              onClick={() => buyPackage(pkg, i)}
              disabled={buyingPackage !== null}
              className="px-3 py-1.5 rounded-full bg-peach text-ink font-semibold whitespace-nowrap disabled:opacity-50"
            >
              {buyingPackage === i ? "processing..." : `${pkg.minutes} min (${fmtRupees(pkg.price)})`}
            </button>
          ))}
        </div>
      )}

      {locked && ended && !error && lastSessionId && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs font-sans border-b border-border bg-peach-dark/5">
          <span className="text-ink/50">{ratingGiven ? "thanks for the feedback!" : "how was this chat?"}</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => submitRating(lastSessionId, n)}
                disabled={submittingRating || Boolean(ratingGiven)}
                aria-label={`rate ${n} star`}
                className="disabled:cursor-default"
              >
                <Star
                  size={14}
                  className={ratingGiven && n <= ratingGiven ? "fill-peach-dark text-peach-dark" : "text-ink/30"}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 flex flex-col gap-3">
        {displayMessages.map((m) => {
          const revealCount = revealCounts[m.id]
          const content = revealCount !== undefined ? m.content.slice(0, revealCount) : m.content
          return (
            <div
              key={m.id}
              ref={(el) => {
                messageRefs.current[m.id] = el
              }}
              className={`max-w-[85%] md:max-w-[60%] rounded-xl px-3.5 py-2.5 text-sm font-sans leading-relaxed break-words ${
                m.role === "user" ? "self-end bg-neutral-500 text-cream" : "self-start bg-peach-dark/15 text-ink"
              }`}
            >
              <FormattedMessage content={content} />
            </div>
          )
        })}
        {(sending || Object.values(revealingIds).some(Boolean)) && (
          <div className="self-start text-xs text-ink/40 font-sans">typing...</div>
        )}
      </div>

      <div className="relative flex flex-col border-t border-border">
        {isPaused && (
          <div className="px-4 pt-2 text-xs font-sans text-ink/40">
            paused, your time isn&apos;t running out, send a message to resume
          </div>
        )}
        {!isSignedIn && (
          <div className="px-4 pt-2 text-xs font-sans text-ink/40">
            sign in to chat ·{" "}
            {packages.map((pkg, i) => (
              <span key={i}>
                {fmtRupees(pkg.price)}/{pkg.minutes} min{i < packages.length - 1 ? " · " : ""}
              </span>
            ))}
            {" · "}
            <button
              onClick={() => signIn("google", { callbackUrl: "/priya-gpt" })}
              className="font-semibold text-peach-dark underline cursor-pointer"
            >
              sign in
            </button>
          </div>
        )}
        {isSignedIn && locked && !needsPurchase && (
          <div className="flex items-center gap-2 px-4 pt-2 flex-wrap">
            <span className="text-xs font-sans text-ink/40">
              {hasBalance ? "send a message to start a new session, or add more time:" : "add time to start chatting:"}
            </span>
            {packages.map((pkg, i) => (
              <button
                key={i}
                onClick={() => buyPackage(pkg, i)}
                disabled={buyingPackage !== null}
                className="px-3.5 py-1.5 rounded-lg bg-peach text-ink text-xs font-sans font-semibold whitespace-nowrap shadow-sm hover:brightness-95 transition disabled:opacity-50"
              >
                {buyingPackage === i ? "processing..." : `${pkg.minutes} min (${fmtRupees(pkg.price)})`}
              </button>
            ))}
          </div>
        )}
        <div className="relative flex items-end gap-2 px-3 py-3">
          {showEmojiPicker && (
            <div className="absolute bottom-full left-3 mb-1.5 grid grid-cols-8 gap-1 p-2 rounded-lg border border-border bg-card shadow-lg z-10">
              {EMOJI_PALETTE.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setInput((prev) => prev + emoji)
                    setShowEmojiPicker(false)
                  }}
                  className="text-lg hover:bg-peach-dark/20 rounded p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="flex-shrink-0 p-2 rounded-lg text-ink/50 hover:text-ink hover:bg-peach-dark/10 transition-colors"
            aria-label="add emoji"
          >
            <Smile size={18} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="type here"
            rows={1}
            className="flex-1 max-h-32 overflow-y-auto px-3 py-2 rounded-lg bg-peach-dark/10 text-sm font-sans text-ink outline-none focus:ring-1 focus:ring-ink/20 resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim() || buyingPackage !== null}
            className="px-4 py-2 rounded-lg bg-peach text-ink text-sm font-sans font-semibold disabled:opacity-40"
          >
            send
          </button>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between mt-2 px-1">
      <span className="font-sans text-xs text-ink/50">★ 4.9 · {foundersCount} founders</span>
      {ratableSessionId && !showRateWidget && (
        <button
          onClick={() => setShowRateWidget(true)}
          className="font-sans text-xs font-semibold text-peach-dark"
        >
          rate us
        </button>
      )}
      {ratableSessionId && showRateWidget && (
        <div className="flex items-center gap-1.5">
          <span className="font-sans text-xs text-ink/50">
            {ratingGiven ? "thanks!" : "rate:"}
          </span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => submitRating(ratableSessionId, n)}
                disabled={submittingRating || Boolean(ratingGiven)}
                aria-label={`rate ${n} star`}
                className="disabled:cursor-default"
              >
                <Star
                  size={14}
                  className={ratingGiven && n <= ratingGiven ? "fill-peach-dark text-peach-dark" : "text-ink/30"}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

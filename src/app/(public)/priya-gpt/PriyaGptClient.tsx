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
type ChatMsg = { id: string; role: "user" | "assistant"; content: string; createdAt?: string }
type TimePackage = { price: number; minutes: number } // price in paise

const DEFAULT_PACKAGES: TimePackage[] = [
  { price: 9900, minutes: 30 },
  { price: 14900, minutes: 60 },
]

const DEFAULT_INTRO_MESSAGES: ChatMsg[] = [
  {
    id: "intro-1",
    role: "assistant",
    content: "Hey. I'm PriyaGPT, powered by artificial intelligence and available whenever you want to chat about anything related to your startup, fundraise or founder's life.",
  },
  {
    id: "intro-2",
    role: "assistant",
    content: "I've seen a founder's journey inside out and it's hell of a ride. That's why I'm here to be a founder's buddy.",
  },
  {
    id: "intro-3",
    role: "assistant",
    content: "Tell me about you and what's going on. Let's chat :)",
  },
]

const ABOUT_POINTS = [
  "trained on Priya's approach to fundraising, GTM, team building, founder's advisor and startup strategy",
  "ask about anything you're stuck on: funding, strategy, pitch, team building, whatever",
  "gives direct, honest feedback, not just cheerleading",
  "chat time is metered in minutes; pause anytime, resume later, buy more when you run out",
  "a place to think out loud, not a replacement for a 1:1 session with Priya",
  "please keep it real and respectful; abusive, spammy or harmful messages may block and ban you from chat and website permanently",
]

function fmtRupees(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN")
}

const PENDING_INPUT_KEY = "priyagpt_pending_input"
const BLOCKED_CONTACT_EMAIL = "hi@priyaahuja.in"

// sign-in is a full-page redirect to Google and back, which unmounts this component and
// loses whatever the user had typed — stash it first so it can be restored after they're
// back and signed in, instead of silently vanishing.
function signInPreservingInput(input: string) {
  if (input.trim()) sessionStorage.setItem(PENDING_INPUT_KEY, input)
  signIn("google", { callbackUrl: "/priya-gpt" })
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
  const [hasMoreHistory, setHasMoreHistory] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [initializing, setInitializing] = useState(isSignedIn)
  const [blocked, setBlocked] = useState(false)
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
    if (!isSignedIn) return
    const pending = sessionStorage.getItem(PENDING_INPUT_KEY)
    if (pending) {
      setInput(pending)
      sessionStorage.removeItem(PENDING_INPUT_KEY)
    }
  }, [isSignedIn])

  useEffect(() => {
    fetch("/api/priya-gpt/packages")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.packages) && d.packages.length > 0) setPackages(d.packages)
      })
  }, [])

  function syncSessionFromServer() {
    if (!isSignedIn) return
    fetch("/api/priya-gpt/session")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.packages) && d.packages.length > 0) setPackages(d.packages)
        if (typeof d.minutesBalance === "number") setMinutesBalance(d.minutesBalance)
        setBlocked(Boolean(d.blocked))
        setSession(d.session ?? null)
        if (d.session) {
          fetch(`/api/priya-gpt/chat?sessionId=${d.session.id}`)
            .then((r) => r.json())
            .then((cd) => {
              setMessages(cd.messages ?? [])
              setHasMoreHistory(Boolean(cd.hasMore))
            })
            .finally(() => setInitializing(false))
        } else {
          setInitializing(false)
        }
      })
      .catch(() => setInitializing(false))
  }

  useEffect(() => {
    syncSessionFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn])

  useEffect(() => {
    // the browser can restore this page from bfcache (back/forward nav) without remounting
    // the component at all — our in-memory session state would then be stale (e.g. still
    // "running" even though the server auto-paused it while the tab was away), so re-sync
    // from the server truth whenever the tab becomes visible/restored again.
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) syncSessionFromServer()
    }
    function onVisibilityChange() {
      if (!document.hidden) syncSessionFromServer()
    }
    window.addEventListener("pageshow", onPageShow)
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      window.removeEventListener("pageshow", onPageShow)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn])

  function loadOlderMessages() {
    const oldestCreatedAt = messages[0]?.createdAt
    if (!session || loadingHistory || !hasMoreHistory || !oldestCreatedAt) return
    setLoadingHistory(true)
    const container = scrollRef.current
    const prevScrollHeight = container?.scrollHeight ?? 0
    fetch(`/api/priya-gpt/chat?sessionId=${session.id}&before=${encodeURIComponent(oldestCreatedAt)}`)
      .then((r) => r.json())
      .then((d) => {
        setMessages((prev) => [...(d.messages ?? []), ...prev])
        setHasMoreHistory(Boolean(d.hasMore))
        requestAnimationFrame(() => {
          if (container) container.scrollTop = container.scrollHeight - prevScrollHeight
        })
      })
      .finally(() => setLoadingHistory(false))
  }

  useEffect(() => {
    if (!session || session.pausedAt) return

    // running out of time just stops the countdown here — it doesn't touch `session` or
    // the message history, there's one continuous chat thread and buying more time
    // resumes the same countdown right where it left off
    const tick = () => {
      setRemainingMs(new Date(session.expiresAt).getTime() - Date.now())
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

  // ensures the caller's one chat thread has an active timer — creates it on a user's very
  // first message ever, or reactivates it (spending the whole banked balance) after a
  // timeout. Either way it's the same thread and the same message history throughout.
  async function startSession() {
    if (!isSignedIn) {
      signInPreservingInput(input)
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
      setRatingGiven(null)
      refreshBalance()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start session, please retry")
    } finally {
      setStarting(false)
    }
  }

  // credits already happened server-side; this adds the bought minutes onto the caller's
  // one chat thread, creating or reactivating it as needed — same conversation either way
  async function applyPurchasedMinutes(pkg: TimePackage) {
    const extendRes = await fetch("/api/priya-gpt/session/extend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minutes: pkg.minutes }),
    })
    const extendData = await extendRes.json()
    if (extendRes.ok && extendData.session) {
      setSession(extendData.session)
      setError(null)
      refreshBalance()
    } else {
      setError(extendData.error ?? "Could not add time to session")
    }
  }

  async function buyPackage(pkg: TimePackage, index: number) {
    if (!isSignedIn) {
      signInPreservingInput(input)
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
      signInPreservingInput(input)
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
      const isPausedNow = Boolean(session?.pausedAt)
      const isExpiredNow = Boolean(session) && !isPausedNow && new Date(session!.expiresAt).getTime() <= Date.now()

      if (isPausedNow) {
        const resumeRes = await fetch("/api/priya-gpt/session/resume", { method: "POST" })
        const resumeData = await resumeRes.json()
        if (resumeRes.ok && resumeData.session) {
          activeSessionId = resumeData.session.id
          setSession(resumeData.session)
        }
      } else if (!activeSessionId || isExpiredNow) {
        if (!(minutesBalance && minutesBalance > 0)) {
          // can't auto-charge without a payment popup — bail out and open the buy flow for the cheapest package
          setMessages((prev) => prev.filter((m) => m.id !== tempId))
          setInput(text)
          if (packages[0]) buyPackage(packages[0], 0)
          return
        }
        // same one chat thread throughout — this creates it on a first-ever message, or
        // reactivates it (spending the balance) after it timed out
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
        setRatingGiven(null)
        refreshBalance()
      }

      const res = await fetch("/api/priya-gpt/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSessionId, message: text }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 403 && data.error === "blocked") {
          setBlocked(true)
          setMessages((prev) => prev.filter((m) => m.id !== tempId))
          return
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

  const displayMessages =
    messages.length === 0
      ? DEFAULT_INTRO_MESSAGES
      : hasMoreHistory
        ? messages
        : [...DEFAULT_INTRO_MESSAGES, ...messages]
  const isPaused = Boolean(session?.pausedAt)
  const pausedRemainingMs =
    isPaused && session ? new Date(session.expiresAt).getTime() - new Date(session.pausedAt!).getTime() : null
  const effectiveRemainingMs = isPaused ? pausedRemainingMs : remainingMs
  const remHours = effectiveRemainingMs !== null ? Math.max(0, Math.floor(effectiveRemainingMs / 3600000)) : 0
  const remMinutes = effectiveRemainingMs !== null ? Math.max(0, Math.floor((effectiveRemainingMs % 3600000) / 60000)) : 0
  const remSeconds = effectiveRemainingMs !== null ? Math.max(0, Math.floor((effectiveRemainingMs % 60000) / 1000)) : 0
  // one continuous chat thread — "locked" just means the timer needs more time to keep going,
  // not that a session ended; ranOut distinguishes "timed out" from "never started"
  const ranOut = Boolean(session) && !isPaused && effectiveRemainingMs !== null && effectiveRemainingMs <= 0
  const locked = !session || ranOut
  const ratableSessionId = session?.id ?? null
  const hasBalance = Boolean(minutesBalance && minutesBalance > 0)

  return (
    <div className="w-full h-full flex flex-col min-h-0">
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
    <div className="flex-shrink-0 flex items-center justify-between mb-1.5 px-1">
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
    <div className="w-full flex flex-col flex-1 min-h-0 rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border bg-peach-dark/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <Image src="/priyadp.jpeg" alt="Priya Ahuja" width={26} height={26} className="rounded-full object-cover" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border-2 border-cream" />
          </div>
          <div className="min-w-0">
            <p className="font-sans text-sm font-semibold text-ink truncate">Priya Ahuja</p>
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
          {session && !ranOut && (
            <button
              onClick={togglePause}
              disabled={pausing}
              aria-label={isPaused ? "resume session" : "pause session"}
              className="p-1.5 rounded-full text-ink/60 hover:text-ink hover:bg-peach-dark/20 transition-colors disabled:opacity-50"
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          )}
          <div className="relative flex items-center">
            <div className="inline-flex items-center gap-2 bg-peach-dark/20 rounded-full pl-3 pr-0.5 py-0.5 whitespace-nowrap">
              {session && !ranOut ? (
                <span className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-ink/70">
                  <Clock size={13} className="flex-shrink-0" />
                  {String(remHours).padStart(2, "0")}:{String(remMinutes).padStart(2, "0")}:{String(remSeconds).padStart(2, "0")}
                </span>
              ) : (
                <button
                  onClick={startSession}
                  disabled={starting || initializing || !hasBalance}
                  className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-ink/70 disabled:opacity-50 disabled:cursor-default"
                >
                  <Clock size={13} className="flex-shrink-0" />
                  {starting ? "starting..." : initializing ? "…" : `${minutesBalance ?? 0} min`}
                </button>
              )}
              <button
                onClick={() => setShowAddTime((v) => !v)}
                aria-label={showAddTime ? "close add time options" : "add time"}
                className="flex-shrink-0 p-1 rounded-full text-ink/60 bg-card/60 shadow-sm hover:text-ink hover:bg-card transition-colors"
              >
                {showAddTime ? <X size={13} /> : <Plus size={13} />}
              </button>
            </div>
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

      {(error || (locked && ranOut)) && (
        <div className="px-4 py-2 text-xs font-sans border-b border-border bg-red-50/60 text-red-700">
          {ranOut && !error ? "You're out of time, add more to keep going right where you left off." : error}
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

      <div className="relative flex-1 min-h-0">
      <div
        ref={scrollRef}
        onScroll={(e) => {
          if (!blocked && e.currentTarget.scrollTop < 60) loadOlderMessages()
        }}
        className={`h-full overflow-y-auto overflow-x-hidden px-5 py-4 flex flex-col gap-3 scrollbar-subtle ${
          blocked ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {hasMoreHistory && (
          <div className="self-center text-xs text-ink/40 font-sans py-1">
            {loadingHistory ? "loading earlier messages…" : "scroll up for earlier messages"}
          </div>
        )}
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
                m.role === "user" ? "self-end bg-neutral-300 dark:bg-neutral-700 text-ink" : "self-start bg-peach-dark/15 text-ink"
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
      {blocked && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p className="text-center text-xs font-sans text-ink/50 bg-cream/80 rounded-lg px-4 py-2">
            This conversation has been paused. If you think this is a mistake, contact{" "}
            <a href={`mailto:${BLOCKED_CONTACT_EMAIL}`} className="underline text-ink/70">
              {BLOCKED_CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      )}
      </div>

      <div className="relative flex flex-col border-t border-border">
        {isPaused && (
          <div className="px-4 pt-2 text-xs font-sans text-ink/40">
            paused, your time isn&apos;t running out, send a message to resume chatting.
          </div>
        )}
        {!isSignedIn && (
          <div className="px-4 pt-2 text-xs font-sans text-ink/40">
            sign in to chat · 5 min free ·{" "}
            {packages.map((pkg, i) => (
              <span key={i}>
                {fmtRupees(pkg.price)}/{pkg.minutes} min{i < packages.length - 1 ? " · " : ""}
              </span>
            ))}
            {" · "}
            <button
              onClick={() => signInPreservingInput(input)}
              className="font-semibold text-peach-dark underline cursor-pointer"
            >
              sign in
            </button>
          </div>
        )}
        {isSignedIn && !initializing && locked && !needsPurchase && (
          hasBalance ? (
            <div className="px-4 pt-2 text-xs font-sans text-ink/40">
              send a message to start chatting, {minutesBalance} mnts free.
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 pt-2 flex-wrap">
              <span className="text-xs font-sans text-ink/40">add time to start chatting:</span>
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
          )
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
            disabled={blocked}
            className="flex-1 max-h-32 overflow-y-auto px-3 py-2 rounded-lg bg-peach-dark/10 text-sm font-sans text-ink outline-none focus:ring-1 focus:ring-ink/20 resize-none disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim() || buyingPackage !== null || blocked}
            className="px-4 py-2 rounded-lg bg-peach text-ink text-sm font-sans font-semibold disabled:opacity-40"
          >
            send
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

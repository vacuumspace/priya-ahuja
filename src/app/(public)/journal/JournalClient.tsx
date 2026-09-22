"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Globe, HelpCircle, Info, Lock, Loader2, Pencil, Trash2, X } from "lucide-react"
import {
  addDays,
  allChallengeDates,
  dayNumberForDate,
  isFillable,
  todayIST,
  CHALLENGE_START_DATE,
  CHALLENGE_END_DATE,
  MAX_POINTS_PER_ENTRY,
  MAX_POINT_LENGTH,
} from "@/lib/daily-win-journal"
import { type WallRow } from "@/lib/journal-wall"
import SignInOptions from "@/components/SignInOptions"

type Entry = { date: string; points: string[]; moderationFlagged: boolean }

function formatShortDate(date: string): string {
  return new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", timeZone: "Asia/Kolkata",
  })
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata",
  })
}

function restoreDraft(isSignedIn: boolean, date: string, setText: (text: string) => void) {
  try {
    const raw = sessionStorage.getItem("journal-draft")
    if (!raw) return
    sessionStorage.removeItem("journal-draft")
    const draft = JSON.parse(raw) as { date: string; text: string }
    if (isSignedIn && draft.date === date) setText(draft.text)
  } catch {
    // ignore malformed/inaccessible storage
  }
}

export function JournalClient({
  entries, journalDisplayName, accountName, journalVisibility, wallEntries, wallDate, isSignedIn,
}: {
  entries: Entry[]
  journalDisplayName: string
  accountName: string
  journalVisibility: "public" | "private"
  wallEntries: WallRow[]
  wallDate: string
  isSignedIn: boolean
}) {
  const dates = useMemo(() => allChallengeDates(), [])
  const today = todayIST()

  const [byDate, setByDate] = useState<Record<string, Entry>>(() =>
    Object.fromEntries(entries.map((e) => [e.date, e]))
  )
  const [selected, setSelected] = useState<string>(today < CHALLENGE_START_DATE ? CHALLENGE_START_DATE : today)
  const [viewingDate, setViewingDate] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState(journalDisplayName)
  const [visibility, setVisibility] = useState(journalVisibility)
  const [wallRefreshToken, setWallRefreshToken] = useState(0)
  const [showWhy, setShowWhy] = useState(false)

  const todayDayNumber = dayNumberForDate(today) ?? 0
  const postedDates = useMemo(() => dates.filter((d) => byDate[d]), [dates, byDate])

  function handleEntrySaved(entry: Entry) {
    setByDate((prev) => ({ ...prev, [entry.date]: entry }))
    setWallRefreshToken((n) => n + 1)
  }

  function handleEntryDeleted(date: string) {
    setByDate((prev) => {
      const next = { ...prev }
      delete next[date]
      return next
    })
    setWallRefreshToken((n) => n + 1)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex items-center gap-3 px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans">
        <span className="flex-shrink-0">100 days journal</span>
      </div>

      <div className="px-4 md:px-10 pt-8 pb-16 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="font-heading text-3xl font-800 text-peach-dark">challenge 100 days = 100 wins</h1>
          <button onClick={() => setShowWhy(true)} className="text-ink/30 hover:text-ink flex-shrink-0" aria-label="why this exists">
            <HelpCircle size={18} />
          </button>
        </div>
        <p className="font-sans text-sm text-ink/60 mb-2">
          post everyday&apos;s win. day {todayDayNumber}
        </p>
        <div className="mt-6">
          {isSignedIn && (
            <div className="flex justify-end mb-3">
              <VisibilityControl
                visibility={visibility}
                displayName={displayName}
                accountName={accountName}
                onChanged={(v, name) => {
                  setVisibility(v)
                  if (name) setDisplayName(name)
                  setWallRefreshToken((n) => n + 1)
                }}
              />
            </div>
          )}

          <span className="font-sans text-[10px] text-ink/30 block mb-1">{formatShortDate(CHALLENGE_START_DATE)}</span>
          <div className="grid gap-1.5 grid-cols-10 sm:grid-cols-15 lg:grid-cols-20 xl:grid-cols-25">
            {dates.map((date) => {
              const entry = byDate[date]
              const dayNum = dayNumberForDate(date)
              const fillable = isFillable(date)
              const isToday = date === today
              const isSelected = !entry && date === selected

              return (
                <button
                  key={date}
                  disabled={!fillable && !entry}
                  onClick={() => (entry ? setViewingDate(date) : setSelected(date))}
                  title={`day ${dayNum} · ${formatDate(date)}`}
                  className={`aspect-square w-full rounded-sm text-[9px] font-sans font-semibold flex items-center justify-center transition-colors ${
                    isSelected
                      ? "ring-2 ring-ink ring-offset-1 ring-offset-cream"
                      : ""
                  } ${
                    entry
                      ? "bg-peach-dark text-ink"
                      : fillable
                        ? "bg-peach-dark/20 text-ink/40 hover:bg-peach-dark/40 cursor-pointer"
                        : "bg-ink/5 text-ink/20 cursor-not-allowed"
                  } ${isToday && !entry ? "outline outline-1 outline-ink/30" : ""}`}
                >
                  {dayNum}
                </button>
              )
            })}
            <span className="h-full flex items-center font-sans text-[10px] text-ink/30 pl-1">
              {formatShortDate(CHALLENGE_END_DATE)}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-3 text-[11px] font-sans text-ink/50">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-peach-dark inline-block" /> posted</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-peach-dark/20 inline-block" /> pending</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-ink/5 inline-block" /> locked</span>
          </div>

          <div className="max-w-md mt-8">
            <RecordCard date={selected} entry={byDate[selected]} onSaved={handleEntrySaved} isSignedIn={isSignedIn} />
          </div>
        </div>

        <WallBrowser initialDate={wallDate} initialEntries={wallEntries} refreshToken={wallRefreshToken} />
      </div>

      {viewingDate && byDate[viewingDate] && (
        <PostedEntryPopup
          date={viewingDate}
          entry={byDate[viewingDate]}
          prevDate={adjacentPostedDate(viewingDate, postedDates, -1)}
          nextDate={adjacentPostedDate(viewingDate, postedDates, 1)}
          onNavigate={setViewingDate}
          onClose={() => setViewingDate(null)}
          onSaved={handleEntrySaved}
          onDeleted={(date) => {
            handleEntryDeleted(date)
            setViewingDate(null)
          }}
        />
      )}

      {showWhy && <WhyModal onClose={() => setShowWhy(false)} />}
    </div>
  )
}

function WhyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-96 max-w-full border border-border rounded-xl bg-cream shadow-xl p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-lg font-800 text-ink">why this exists</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink"><X size={16} /></button>
        </div>
        <div className="flex flex-col gap-3 font-sans text-sm text-ink/70 leading-relaxed">
          <p>founders rarely notice their own daily wins. building a startup is an extremely slow process - progress rarely feels like progress in the moment.</p>
          <p>this is a place to mark the small stuff as it happens, one line a day. not for anyone else - for your own future reference, and for daily reflection.</p>
          <p>100 days of proof that you moved forward, even on the days it didn&apos;t feel like it.</p>
        </div>
      </div>
    </div>
  )
}

function adjacentPostedDate(date: string, postedDates: string[], direction: 1 | -1): string | null {
  const idx = postedDates.indexOf(date)
  if (idx === -1) return null
  const nextIdx = idx + direction
  return nextIdx >= 0 && nextIdx < postedDates.length ? postedDates[nextIdx] : null
}

function WallBrowser({
  initialDate, initialEntries, refreshToken,
}: {
  initialDate: string
  initialEntries: WallRow[]
  refreshToken: number
}) {
  const today = todayIST()
  const [date, setDate] = useState(initialDate)
  const [rows, setRows] = useState(initialEntries)
  const [loading, setLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const isFirstRender = useRef(true)

  async function fetchEntries(d: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/journal/wall?date=${d}`)
      const data = await res.json()
      setRows(data.entries ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function goTo(nextDate: string) {
    setDate(nextDate)
    await fetchEntries(nextDate)
  }

  // A win was just posted or visibility changed elsewhere on the page - refetch
  // whatever day is currently shown so it doesn't sit stale until the next
  // manual prev/next click. Skip the mount run - initialEntries already covers it.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    fetchEntries(date)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken])

  const dayNum = dayNumberForDate(date)
  const prevDate = date > CHALLENGE_START_DATE ? addDays(date, -1) : null
  const nextDate = date < today ? addDays(date, 1) : null

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-3">
        <div className="relative flex items-center gap-1.5">
          <h2 className="font-heading text-lg font-700 text-peach-dark">wall of wins</h2>
          <button onClick={() => setShowInfo((v) => !v)} className="text-ink/40 hover:text-ink">
            <Info size={14} />
          </button>
          {showInfo && (
            <div className="absolute left-0 top-full mt-2 w-56 border border-border rounded-lg bg-cream shadow-lg p-2.5 font-sans text-xs text-ink/70 z-10">
              only public posts are visible here to all.
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 font-sans text-xs text-ink/60">
          <button onClick={() => prevDate && goTo(prevDate)} disabled={!prevDate || loading} className="disabled:opacity-30 hover:text-ink">
            <ChevronLeft size={16} />
          </button>
          <span>day {dayNum} &middot; {formatDate(date)}</span>
          <button onClick={() => nextDate && goTo(nextDate)} disabled={!nextDate || loading} className="disabled:opacity-30 hover:text-ink">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="font-sans text-sm text-ink/40">no public wins shared on this day yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {rows.map((row, i) => (
            <div key={i} className="w-fit max-w-[280px] border border-border rounded-lg p-2.5">
              <p className="font-sans text-xs font-semibold text-ink mb-0.5 truncate">{row.name}</p>
              <ul className="flex flex-col gap-0.5">
                {row.points.map((p, j) => (
                  <li key={j} className="font-sans text-xs text-ink/70">{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function VisibilityControl({
  visibility, displayName, accountName, onChanged,
}: {
  visibility: "public" | "private"
  displayName: string
  accountName: string
  onChanged: (v: "public" | "private", name?: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [nameInput, setNameInput] = useState(displayName || accountName)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function post(next: "public" | "private", name?: string) {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/journal/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: next, journalDisplayName: name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "failed to update")
      onChanged(data.visibility, data.journalDisplayName)
      setOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "something went wrong")
    } finally {
      setSaving(false)
    }
  }

  function handleSwitchClick() {
    if (visibility === "public") {
      post("private")
    } else {
      setNameInput(displayName || accountName)
      setError("")
      setOpen(true)
    }
  }

  function handleConfirm() {
    if (!nameInput.trim()) {
      setError("pick a display name")
      return
    }
    post("public", nameInput.trim())
  }

  return (
    <div className="relative font-sans text-xs">
      <div className="flex items-center gap-2 text-ink/60">
        <button onClick={handleSwitchClick} disabled={saving} className="flex items-center gap-2 hover:text-ink transition-colors disabled:opacity-50">
          {visibility === "public" ? <Globe size={13} /> : <Lock size={13} />}
          <span>{visibility === "public" ? "public journal" : "private journal"}</span>
          <span className={`relative inline-flex h-4 w-7 flex-shrink-0 items-center rounded-full transition-colors ${visibility === "public" ? "bg-ink" : "bg-ink/20"}`}>
            <span className={`inline-block h-3 w-3 transform rounded-full bg-cream transition-transform ${visibility === "public" ? "translate-x-3.5" : "translate-x-0.5"}`} />
          </span>
        </button>

        {visibility === "public" && (
          <button
            onClick={() => { setNameInput(displayName); setError(""); setOpen(true) }}
            className="flex items-center gap-1 text-ink/40 hover:text-ink transition-colors"
          >
            <Pencil size={11} /> {displayName}
          </button>
        )}
      </div>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 border border-border rounded-xl bg-cream shadow-lg p-3 flex flex-col gap-2 z-10">
          <p className="text-ink font-semibold">
            {visibility === "public" ? "change display name" : "make your journal public?"}
          </p>
          {visibility !== "public" && (
            <p className="text-ink/50">every day you fill in will show up on the public wall.</p>
          )}
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="display name for the wall"
            maxLength={40}
            className="border border-border rounded-md px-2 py-1.5 text-ink bg-cream placeholder:text-ink/30 focus:outline-none focus:ring-1 focus:ring-peach-dark/40"
          />
          {error && <span className="text-red-500">{error}</span>}
          <div className="flex items-center justify-end gap-3 mt-1">
            <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink">cancel</button>
            <button
              onClick={handleConfirm}
              disabled={saving}
              className="font-semibold px-3 py-1 rounded-md bg-ink text-cream hover:bg-ink/80 disabled:opacity-50"
            >
              {saving ? "saving..." : "confirm"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function RecordCard({
  date, entry, onSaved, isSignedIn,
}: {
  date: string
  entry: Entry | undefined
  onSaved: (entry: Entry) => void
  isSignedIn: boolean
}) {
  const [text, setText] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [showSignIn, setShowSignIn] = useState(false)

  const dayNum = dayNumberForDate(date)

  // The card follows whichever grid box is selected - reset the draft when
  // that changes instead of leaking one day's unsaved text into another's.
  const [loadedDate, setLoadedDate] = useState(date)
  if (loadedDate !== date) {
    setLoadedDate(date)
    setText("")
    setError("")
  }

  // Restores a draft stashed just before a sign-in redirect (see handleSave
  // below) - only on first mount, so a freshly loaded page after signing in
  // picks it back up if it's still for this same day.
  useEffect(() => {
    restoreDraft(isSignedIn, date, setText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    if (!isSignedIn) {
      try {
        sessionStorage.setItem("journal-draft", JSON.stringify({ date, text }))
      } catch {
        // ignore - sign-in still proceeds, just without the draft restored
      }
      setShowSignIn(true)
      return
    }

    setError("")
    const cleaned = text.split("\n").map((p) => p.trim()).filter(Boolean).slice(0, MAX_POINTS_PER_ENTRY)
    if (cleaned.length === 0) {
      setError("write at least one win")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/journal/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, points: cleaned }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "failed to save")
      onSaved({ date, points: data.entry.points, moderationFlagged: data.entry.moderationFlagged })
    } catch (e) {
      setError(e instanceof Error ? e.message : "something went wrong")
    } finally {
      setSaving(false)
    }
  }

  // Posted days are viewed/edited via the popup, not here - keeps this box
  // reserved for composing a day that hasn't been posted yet.
  if (entry) {
    return (
      <div className="h-full">
        <span className="font-sans text-xs font-semibold text-ink/60">day {dayNum} &middot; {formatDate(date)}</span>
        <p className="font-sans text-sm text-ink/40 mt-2">already posted - click the box above to view or edit it.</p>
      </div>
    )
  }

  if (!isFillable(date)) {
    return (
      <div className="h-full">
        <span className="font-sans text-xs font-semibold text-ink/60">day {dayNum} &middot; {formatDate(date)}</span>
        <p className="font-sans text-sm text-ink/40 mt-2">this day isn&apos;t open yet.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <span className="font-sans text-xs font-semibold text-ink/60">day {dayNum} &middot; {formatDate(date)}</span>
      <textarea
        value={text}
        onChange={(e) => {
          const lines = e.target.value.split("\n").slice(0, MAX_POINTS_PER_ENTRY).map((l) => l.slice(0, MAX_POINT_LENGTH))
          setText(lines.join("\n"))
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSave()
          }
        }}
        rows={3}
        placeholder="what's a win today?"
        className="w-full mt-2 flex-1 min-h-[6rem] border border-border rounded-lg px-3 py-2 font-sans text-sm text-ink bg-cream placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-peach-dark/40 resize-none"
      />

      <div className="flex items-center justify-between mt-1.5">
        <span className="font-sans text-[10px] text-ink/30">enter to save, shift+enter for another line</span>
        <span className="font-sans text-[10px] text-ink/30">{(text.split("\n").pop() ?? "").length}/{MAX_POINT_LENGTH}</span>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 font-sans font-semibold text-sm px-4 py-1.5 rounded-lg bg-ink text-cream hover:bg-ink/80 disabled:opacity-50"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          {saving ? "posting..." : "post"}
        </button>
      </div>

      {error && <p className="font-sans text-xs text-red-500 mt-2">{error}</p>}

      {showSignIn && <SignInPrompt onClose={() => setShowSignIn(false)} />}
    </div>
  )
}

function SignInPrompt({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-80 max-w-full border border-border rounded-xl bg-cream shadow-xl p-5 text-center" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading text-lg font-800 text-ink mb-1.5">sign in to post</h3>
        <p className="font-sans text-sm text-ink/60 mb-5">your win is saved here once you sign in - free, takes a few seconds.</p>
        <SignInOptions callbackUrl="/journal" />
      </div>
    </div>
  )
}

function PostedEntryPopup({
  date, entry, prevDate, nextDate, onNavigate, onClose, onSaved, onDeleted,
}: {
  date: string
  entry: Entry
  prevDate: string | null
  nextDate: string | null
  onNavigate: (date: string) => void
  onClose: () => void
  onSaved: (entry: Entry) => void
  onDeleted: (date: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(entry.points.join("\n"))
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const dayNum = dayNumberForDate(date)

  // Reset local edit state whenever the day being viewed changes (prev/next).
  const [loadedDate, setLoadedDate] = useState(date)
  if (loadedDate !== date) {
    setLoadedDate(date)
    setText(entry.points.join("\n"))
    setEditing(false)
    setError("")
  }

  async function handleSave() {
    setError("")
    const cleaned = text.split("\n").map((p) => p.trim()).filter(Boolean).slice(0, MAX_POINTS_PER_ENTRY)
    if (cleaned.length === 0) {
      setError("write at least one win")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/journal/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, points: cleaned }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "failed to save")
      onSaved({ date, points: data.entry.points, moderationFlagged: data.entry.moderationFlagged })
      setEditing(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "something went wrong")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await fetch(`/api/journal/entry?date=${date}`, { method: "DELETE" })
      onDeleted(date)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-80 max-w-full border border-border rounded-xl bg-cream shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <button onClick={() => prevDate && onNavigate(prevDate)} disabled={!prevDate} className="text-ink/30 hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed">
              <ChevronLeft size={14} />
            </button>
            <span className="font-sans text-xs font-semibold text-ink/60">day {dayNum} &middot; {formatDate(date)}</span>
            <button onClick={() => nextDate && onNavigate(nextDate)} disabled={!nextDate} className="text-ink/30 hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed">
              <ChevronRight size={14} />
            </button>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink"><X size={15} /></button>
        </div>

        {editing ? (
          <>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => {
                const lines = e.target.value.split("\n").slice(0, MAX_POINTS_PER_ENTRY).map((l) => l.slice(0, MAX_POINT_LENGTH))
                setText(lines.join("\n"))
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSave()
                }
              }}
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2 font-sans text-sm text-ink bg-cream placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-peach-dark/40 resize-none"
            />
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 font-sans font-semibold text-sm px-4 py-1.5 rounded-lg bg-ink text-cream hover:bg-ink/80 disabled:opacity-50"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                {saving ? "saving..." : "save"}
              </button>
              <button
                onClick={() => { setEditing(false); setText(entry.points.join("\n")); setError("") }}
                className="font-sans text-xs text-ink/40 hover:text-ink"
              >
                cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <ul className="flex flex-col gap-1">
              {entry.points.map((p, i) => (
                <li key={i} className="font-sans text-sm text-ink/80">{p}</li>
              ))}
            </ul>
            <div className="flex items-center gap-4 mt-3">
              <button onClick={() => setEditing(true)} className="flex items-center gap-1 font-sans text-xs text-ink/50 hover:text-ink">
                <Pencil size={12} /> edit
              </button>
              <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1 font-sans text-xs text-ink/50 hover:text-red-500">
                <Trash2 size={12} /> delete
              </button>
            </div>
          </>
        )}

        {entry.moderationFlagged && (
          <p className="font-sans text-[11px] text-ink/50 mt-3">this entry won&apos;t show on the public wall.</p>
        )}
        {error && <p className="font-sans text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}

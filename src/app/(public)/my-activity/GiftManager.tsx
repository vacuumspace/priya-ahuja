"use client"

import { useState } from "react"
import { CheckCircle, Loader2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

export type GiftItem = {
  id: string
  courseTitle: string
  status: "paid" | "redeemed"
  recipientName: string
  message: string
  fromName: string
  link: string
  // Card image path without a version, e.g. /api/courses/gift/card/abc
  cardBase: string
  version: string
  createdAt: string
  redeemedByEmail: string | null
  redeemedAt: string | null
}

// One gift the signed-in person has bought: its card, the link to send, and -
// until the receiver claims it - a form to change what the card says.
export function GiftManager({ gift }: { gift: GiftItem }) {
  const [current, setCurrent] = useState({ recipientName: gift.recipientName, message: gift.message || DEFAULT_CARD_LINE, fromName: gift.fromName })
  const [version, setVersion] = useState(gift.version)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(current)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [touched, setTouched] = useState(false)

  const claimed = gift.status === "redeemed"
  const cardUrl = `${gift.cardBase}?v=${version}`

  const recipientProblem = validateCardName(tidy(draft.recipientName), "the name of the person you're gifting")
  const fromProblem = validateCardName(tidy(draft.fromName), "your name")
  const messageProblem = validateCardMessage(tidyMessage(draft.message))
  const formOk = !recipientProblem && !fromProblem && !messageProblem

  async function save() {
    setTouched(true)
    if (!formOk) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch(`/api/courses/gift/${gift.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromName: draft.fromName, recipientName: draft.recipientName, message: draft.message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Couldn't save the card")
      setCurrent({ recipientName: data.recipientName ?? "", message: data.message ?? "", fromName: data.purchaserName ?? "" })
      setVersion(data.version)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full ${claimed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {claimed ? "claimed" : "not claimed yet"}
          </span>
          <span className="text-[12px] font-sans text-ink/30">{gift.createdAt}</span>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1 text-[12px] font-sans font-semibold text-green-700">
            <CheckCircle size={12} /> card updated
          </span>
        )}
      </div>

      <p className="font-heading text-base font-700 text-ink normal-case mb-3">
        {gift.courseTitle} · for {current.recipientName || "someone"}
      </p>

      {editing ? (
        <div>
          <div className="mb-4">
            <GiftCardPreview
              recipientName={tidy(draft.recipientName)}
              fromName={tidy(draft.fromName)}
              message={tidyMessage(draft.message)}
              courseTitle={gift.courseTitle}
            />
          </div>
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <Label htmlFor={`to-${gift.id}`} className="text-xs font-sans text-ink/60 mb-1 block">who is it for?</Label>
              <Input
                id={`to-${gift.id}`}
                value={draft.recipientName}
                onChange={(e) => setDraft({ ...draft, recipientName: e.target.value })}
                maxLength={CARD_NAME_MAX}
                className="bg-cream border-border text-sm"
              />
              {touched && recipientProblem && <p className="text-[12px] font-sans text-red-500 mt-1">{recipientProblem}</p>}
            </div>
            <div>
              <Label htmlFor={`msg-${gift.id}`} className="text-xs font-sans text-ink/60 mb-1 block">
                a line for the middle of the card <span className="text-ink/30">(optional)</span>
              </Label>
              <Textarea
                id={`msg-${gift.id}`}
                value={draft.message}
                onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                maxLength={CARD_MESSAGE_MAX}
                rows={3}
                placeholder={DEFAULT_CARD_LINE}
                className="bg-cream border-border text-sm resize-none"
              />
              <p className="text-[12px] font-sans text-ink/40 mt-1">{CARD_MESSAGE_HINT}</p>
              {touched && messageProblem && <p className="text-[12px] font-sans text-red-500 mt-1">{messageProblem}</p>}
            </div>
            <div>
              <Label htmlFor={`from-${gift.id}`} className="text-xs font-sans text-ink/60 mb-1 block">from</Label>
              <Input
                id={`from-${gift.id}`}
                value={draft.fromName}
                onChange={(e) => setDraft({ ...draft, fromName: e.target.value })}
                maxLength={CARD_NAME_MAX}
                className="bg-cream border-border text-sm"
              />
              {touched && fromProblem && <p className="text-[12px] font-sans text-red-500 mt-1">{fromProblem}</p>}
            </div>
          </div>
          {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
          <div className="flex items-center gap-3">
            <Button
              onClick={save}
              disabled={saving}
              className="h-9 px-5 bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-[13px] rounded-lg disabled:opacity-40"
            >
              {saving ? <span className="flex items-center gap-2"><Loader2 size={13} className="animate-spin" />saving…</span> : "save card"}
            </Button>
            <button
              type="button"
              onClick={() => { setEditing(false); setDraft(current); setError(""); setTouched(false) }}
              className="font-sans text-[13px] text-ink/50 hover:text-ink transition-colors"
            >
              cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cardUrl} alt={`Gift card for ${current.recipientName}`} className="w-full rounded-xl border border-border mb-4" />

          {claimed ? (
            <p className="font-sans text-[13px] text-ink/50">
              Claimed{gift.redeemedByEmail ? ` by ${gift.redeemedByEmail}` : ""}{gift.redeemedAt ? ` on ${gift.redeemedAt}` : ""}. The card is locked now.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <GiftLinkActions link={gift.link} cardUrl={cardUrl} courseTitle={gift.courseTitle} recipientName={current.recipientName} />
              <button
                type="button"
                onClick={() => { setDraft(current); setEditing(true) }}
                className="inline-flex items-center gap-1.5 self-start font-sans text-[13px] font-semibold text-peach-dark hover:underline underline-offset-4"
              >
                <Pencil size={12} /> edit the card
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

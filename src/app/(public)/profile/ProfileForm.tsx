"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"

type Profile = {
  phone?: string | null
  bio?: string | null
  location?: string | null
  website?: string | null
  businessName?: string | null
  businessType?: string | null
  industry?: string | null
  stage?: string | null
  businessDescription?: string | null
  businessWebsite?: string | null
  instagramHandle?: string | null
  linkedinUrl?: string | null
  twitterHandle?: string | null
} | null

interface Props {
  initialName: string
  initialEmail: string
  initialProfile: Profile
}

function Field({
  label, name, value, onChange, type = "text", placeholder, hint,
}: {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  hint?: string
}) {
  return (
    <div>
      <label className="block font-sans text-xs font-semibold text-ink/60 mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full border border-border rounded-xl px-3.5 py-2.5 font-sans text-sm text-ink bg-cream placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-peach-dark/40 resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-border rounded-xl px-3.5 py-2.5 font-sans text-sm text-ink bg-cream placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-peach-dark/40"
        />
      )}
      {hint && <p className="font-sans text-[13px] text-ink/40 mt-1">{hint}</p>}
    </div>
  )
}

function SelectField({
  label, name, value, onChange, options,
}: {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block font-sans text-xs font-semibold text-ink/60 mb-1.5">{label}</label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-xl px-3.5 py-2.5 font-sans text-sm text-ink bg-cream focus:outline-none focus:ring-2 focus:ring-peach-dark/40 appearance-none"
      >
        <option value=""> - select - </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

const businessTypeOptions = [
  { value: "founder", label: "Founder / Co-founder" },
  { value: "freelancer", label: "Freelancer / Consultant" },
  { value: "agency", label: "Agency / Studio" },
  { value: "other", label: "Other" },
]

const stageOptions = [
  { value: "idea", label: "Idea stage" },
  { value: "pre-revenue", label: "Pre-revenue" },
  { value: "revenue", label: "Generating revenue" },
  { value: "scaling", label: "Scaling" },
]

export function ProfileForm({ initialName, initialEmail, initialProfile }: Props) {
  const p = initialProfile

  const [phone, setPhone] = useState(p?.phone ?? "")
  const [bio, setBio] = useState(p?.bio ?? "")
  const [location, setLocation] = useState(p?.location ?? "")
  const [website, setWebsite] = useState(p?.website ?? "")

  const [businessName, setBusinessName] = useState(p?.businessName ?? "")
  const [businessType, setBusinessType] = useState(p?.businessType ?? "")
  const [industry, setIndustry] = useState(p?.industry ?? "")
  const [stage, setStage] = useState(p?.stage ?? "")
  const [businessDescription, setBusinessDescription] = useState(p?.businessDescription ?? "")
  const [businessWebsite, setBusinessWebsite] = useState(p?.businessWebsite ?? "")
  const [instagramHandle, setInstagramHandle] = useState(p?.instagramHandle ?? "")
  const [linkedinUrl, setLinkedinUrl] = useState(p?.linkedinUrl ?? "")
  const [twitterHandle, setTwitterHandle] = useState(p?.twitterHandle ?? "")

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const isDirty =
    phone !== (p?.phone ?? "") ||
    bio !== (p?.bio ?? "") ||
    location !== (p?.location ?? "") ||
    website !== (p?.website ?? "") ||
    businessName !== (p?.businessName ?? "") ||
    businessType !== (p?.businessType ?? "") ||
    industry !== (p?.industry ?? "") ||
    stage !== (p?.stage ?? "") ||
    businessDescription !== (p?.businessDescription ?? "") ||
    businessWebsite !== (p?.businessWebsite ?? "") ||
    instagramHandle !== (p?.instagramHandle ?? "") ||
    linkedinUrl !== (p?.linkedinUrl ?? "") ||
    twitterHandle !== (p?.twitterHandle ?? "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError("")

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone, bio, location, website,
          businessName, businessType, industry, stage,
          businessDescription, businessWebsite,
          instagramHandle, linkedinUrl, twitterHandle,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Basic Info */}
      <section>
        <h2 className="font-heading text-lg font-700 text-ink mb-5">basic info</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs font-semibold text-ink/60 mb-1.5">name</label>
              <input
                disabled
                value={initialName}
                className="w-full border border-border rounded-xl px-3.5 py-2.5 font-sans text-sm text-ink/50 bg-ink/5 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-semibold text-ink/60 mb-1.5">email</label>
              <input
                disabled
                value={initialEmail}
                className="w-full border border-border rounded-xl px-3.5 py-2.5 font-sans text-sm text-ink/50 bg-ink/5 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="phone" name="phone" value={phone} onChange={setPhone} type="tel" placeholder="+91 98765 43210" />
            <Field label="location" name="location" value={location} onChange={setLocation} placeholder="Mumbai, India" />
          </div>

          <Field label="website" name="website" value={website} onChange={setWebsite} type="url" placeholder="https://yourwebsite.com" />

          <Field
            label="bio"
            name="bio"
            value={bio}
            onChange={setBio}
            type="textarea"
            placeholder="a short intro about yourself..."
          />
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Business Details */}
      <section>
        <h2 className="font-heading text-lg font-700 text-ink mb-1">business details</h2>
        <p className="font-sans text-sm text-ink/50 mb-5">helps us understand your context better</p>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="business / brand name" name="businessName" value={businessName} onChange={setBusinessName} placeholder="Acme Inc." />
            <Field label="industry" name="industry" value={industry} onChange={setIndustry} placeholder="e.g. SaaS, D2C, Fintech" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="i am a" name="businessType" value={businessType} onChange={setBusinessType} options={businessTypeOptions} />
            <SelectField label="current stage" name="stage" value={stage} onChange={setStage} options={stageOptions} />
          </div>

          <Field
            label="what does your business do?"
            name="businessDescription"
            value={businessDescription}
            onChange={setBusinessDescription}
            type="textarea"
            placeholder="briefly describe your product or service..."
          />

          <Field label="business website" name="businessWebsite" value={businessWebsite} onChange={setBusinessWebsite} type="url" placeholder="https://mybusiness.com" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="instagram" name="instagramHandle" value={instagramHandle} onChange={setInstagramHandle} placeholder="@handle" hint="without the @" />
            <Field label="linkedin" name="linkedinUrl" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="linkedin.com/in/you" />
            <Field label="twitter / x" name="twitterHandle" value={twitterHandle} onChange={setTwitterHandle} placeholder="@handle" hint="without the @" />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || !isDirty}
          className="inline-flex items-center gap-2 font-sans font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:bg-ink/20 disabled:text-ink/40 disabled:cursor-not-allowed bg-ink text-cream hover:bg-ink/80"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
          {saving ? "saving..." : saved ? "saved!" : "save profile"}
        </button>
        {error && <p className="font-sans text-sm text-red-500">{error}</p>}
      </div>
    </form>
  )
}

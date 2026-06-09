"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")
    // TODO: wire up to real API route
    await new Promise((r) => setTimeout(r, 800))
    setStatus("sent")
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>reach out</span>
        <span>get in touch</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          let&apos;s talk
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          whether you&apos;re a founder, aspiring vc, or just curious, drop me a message and i&apos;ll get back within a few days.
        </p>
      </div>

      <div className="px-4 md:px-10 pb-16 grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-10 max-w-4xl">

        {/* Contact info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-4">contact info</p>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:priyaahujaoffice@gmail.com"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-peach flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/60"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <p className="text-[10px] text-ink/40 font-sans mb-0.5">email</p>
                  <p className="text-sm font-sans text-ink group-hover:text-peach-dark transition-colors">
                    priyaahujaoffice@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://www.instagram.com/pitchtopriya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-peach flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-ink/60"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] text-ink/40 font-sans mb-0.5">instagram</p>
                  <p className="text-sm font-sans text-ink group-hover:text-peach-dark transition-colors">
                    @pitchtopriya
                  </p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/ca-priya-harwani/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-peach flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-ink/60"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] text-ink/40 font-sans mb-0.5">linkedin</p>
                  <p className="text-sm font-sans text-ink group-hover:text-peach-dark transition-colors">
                    ca-priya-harwani
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-peach/40 border border-peach-dark/20 rounded-2xl p-5">
            <p className="font-heading text-base font-700 text-ink mb-1">response time</p>
            <p className="font-sans text-xs text-ink/60 leading-relaxed">
              i read every message. expect a reply within 2–4 business days. for urgent requests, dm on instagram.
            </p>
          </div>
        </div>

        {/* Enquiry form */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-5">send an enquiry</p>

          {status === "sent" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-peach flex items-center justify-center mb-4">
                <Send size={16} className="text-ink/70" />
              </div>
              <p className="font-heading text-xl font-700 text-ink mb-2">message sent</p>
              <p className="font-sans text-sm text-ink/60">i&apos;ll get back to you soon.</p>
              <button
                onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setStatus("idle") }}
                className="mt-6 text-xs font-sans text-ink/50 underline underline-offset-2 hover:text-ink transition-colors"
              >
                send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wider">name</label>
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="your name"
                    className="bg-cream border border-border rounded-lg px-3 py-2.5 text-sm font-sans text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/30 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wider">email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="bg-cream border border-border rounded-lg px-3 py-2.5 text-sm font-sans text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/30 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wider">subject</label>
                <select
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="bg-cream border border-border rounded-lg px-3 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-ink/30 transition-colors appearance-none"
                >
                  <option value="" disabled>select a topic</option>
                  <option value="fundraising-advice">fundraising advice</option>
                  <option value="vc-career">breaking into vc</option>
                  <option value="pitch-review">pitch review</option>
                  <option value="collaboration">collaboration</option>
                  <option value="other">other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wider">message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="what's on your mind?"
                  className="bg-cream border border-border rounded-lg px-3 py-2.5 text-sm font-sans text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/30 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="self-start flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-5 py-2.5 rounded-lg hover:bg-ink/80 disabled:opacity-60 transition-colors"
              >
                {status === "sending" ? "sending…" : "send message"}
                <Send size={12} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

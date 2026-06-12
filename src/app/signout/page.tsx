"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignOutPage() {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 px-10 py-12 border border-border rounded-2xl bg-card shadow-xl w-80 text-center">
        {/* logo / monogram */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-heading text-4xl text-ink leading-none">pa</span>
          <span className="font-sans text-xs text-ink-muted tracking-widest uppercase">priyaahuja.in</span>
        </div>

        <div className="w-full h-px bg-border" />

        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl text-ink">see you soon</h1>
          <p className="font-sans text-sm text-ink-muted">are you sure you want to sign out?</p>
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full inline-flex items-center justify-center font-sans font-semibold text-sm py-2.5 rounded-xl bg-ink text-cream hover:bg-ink/80 transition-colors"
          >
            yes, sign out
          </button>
          <button
            onClick={() => router.back()}
            className="w-full inline-flex items-center justify-center font-sans font-semibold text-sm py-2.5 rounded-xl border border-border text-ink hover:bg-muted transition-colors"
          >
            go back
          </button>
        </div>
      </div>
    </div>
  )
}

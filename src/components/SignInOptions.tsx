"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

type Props = {
  callbackUrl?: string
  // compact: smaller inputs, used in modals/cards; default: full-size
  compact?: boolean
  // label for the Google button
  googleLabel?: string
  // extra class on the wrapper
  className?: string
}

export default function SignInOptions({
  callbackUrl = "/",
  compact = false,
  googleLabel = "continue with google",
  className = "",
}: Props) {
  const btnBaseCls = compact
    ? "inline-flex items-center justify-center gap-1.5 font-sans font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
    : "w-full inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm py-2.5 rounded-xl transition-colors"

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className={`${btnBaseCls} bg-ink text-cream hover:bg-ink/80`}
      >
        <GoogleIcon />
        {googleLabel}
      </button>

      <p className={`text-ink/35 font-sans ${compact ? "text-[10px]" : "text-[11px] text-center"}`}>
        by signing in, you accept our{" "}
        <Link href="/terms" className="underline hover:text-ink/60">terms</Link> and{" "}
        <Link href="/privacy-policy" className="underline hover:text-ink/60">privacy policy</Link>
      </p>
    </div>
  )
}

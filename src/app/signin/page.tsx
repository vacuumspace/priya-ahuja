"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/credentials-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        setError("Invalid credentials")
        return
      }
      router.push("/")
      router.refresh()
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-6 p-10 border border-ink/10 rounded-sm bg-paper">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-ink">Sign in</h1>
          <p className="mt-1 text-sm font-sans text-ink/50">to priyaahuja.com</p>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center gap-2 px-5 py-2.5 border border-ink/20 rounded-sm text-sm font-sans text-ink hover:bg-ink/5 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-ink/10" />
          <span className="text-xs font-sans text-ink/30">or</span>
          <div className="flex-1 h-px bg-ink/10" />
        </div>

        <form onSubmit={handleCredentials} className="flex flex-col gap-3 w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-3 py-2 border border-ink/20 rounded-sm text-sm font-sans text-ink bg-paper placeholder:text-ink/30 focus:outline-none focus:border-ink/40"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-3 py-2 border border-ink/20 rounded-sm text-sm font-sans text-ink bg-paper placeholder:text-ink/30 focus:outline-none focus:border-ink/40"
          />
          {error && <p className="text-xs font-sans text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 border border-ink/20 rounded-sm text-sm font-sans text-ink hover:bg-ink/5 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  )
}

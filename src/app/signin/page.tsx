import SignInOptions from "@/components/SignInOptions"

export default function SignInPage() {
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
          <h1 className="font-heading text-xl text-ink">welcome back</h1>
          <p className="font-sans text-sm text-ink-muted">sign in to continue</p>
        </div>

        <SignInOptions callbackUrl="/" className="w-full" />
      </div>
    </div>
  )
}


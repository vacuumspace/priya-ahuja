import SignInOptions from "@/components/SignInOptions"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-6 p-10 border border-ink/10 rounded-sm bg-paper w-80">
        <div className="text-center">
          <h1 className="font-serif text-2xl text-ink">Sign in</h1>
          <p className="mt-1 text-sm font-sans text-ink/50">to priyaahuja.com</p>
        </div>
        <SignInOptions callbackUrl="/" />
      </div>
    </div>
  )
}

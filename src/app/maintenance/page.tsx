import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Under Maintenance",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Priya Ahuja
      </p>
      <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
        We&apos;ll be right back
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground">
        This site is temporarily down for maintenance. Please check back soon.
      </p>
    </main>
  )
}

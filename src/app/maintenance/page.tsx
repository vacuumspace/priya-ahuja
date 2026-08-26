import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Under Maintenance",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <p className="text-lg text-foreground">offline for sometime</p>
    </main>
  )
}

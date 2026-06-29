import { Suspense } from "react"
import { grants, lastRefreshed } from "@/lib/grants-data"
import { GrantsClient } from "./GrantsClient"

type Props = { searchParams: Promise<{ sector?: string }> }

export default async function FundraiseGrantsPage({ searchParams }: Props) {
  const { sector } = await searchParams
  const activeSector = sector ?? "All"

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>fundraise · grants</span>
        <span>{grants.length} grants</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          grant resources.
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          government schemes, accelerators, and non-dilutive funding programs for indian startups, curated by sector. sign in to see eligibility and apply links.
        </p>
      </div>

      <Suspense>
        <GrantsClient activeSector={activeSector} lastRefreshed={lastRefreshed} />
      </Suspense>
    </div>
  )
}

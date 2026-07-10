import { SidebarWithAuth } from "@/components/layout/SidebarWithAuth"
import { AnalyticsTracker } from "@/components/AnalyticsTracker"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <AnalyticsTracker />
      {/* print:hidden keeps the fixed sidebar and mobile top bar out of saved PDFs */}
      <div className="print:hidden">
        <SidebarWithAuth />
      </div>
      <main className="flex-1 min-w-0 md:ml-[240px] min-h-screen pt-[52px] md:pt-0 overflow-x-hidden print:ml-0! print:pt-0!">
        {children}
      </main>
    </div>
  )
}

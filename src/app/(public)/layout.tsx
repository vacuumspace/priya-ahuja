import { SidebarWithAuth } from "@/components/layout/SidebarWithAuth"
import { AnalyticsTracker } from "@/components/AnalyticsTracker"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <AnalyticsTracker />
      <SidebarWithAuth />
      <main className="flex-1 min-w-0 md:ml-[240px] min-h-screen pt-[52px] md:pt-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

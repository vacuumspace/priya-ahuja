import { SidebarWithAuth } from "@/components/layout/SidebarWithAuth"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <SidebarWithAuth />
      <main className="flex-1 md:ml-[240px] min-h-screen pt-[52px] md:pt-0">
        {children}
      </main>
    </div>
  )
}

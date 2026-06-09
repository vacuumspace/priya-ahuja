"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  CalendarCheck,
  Briefcase,
  Package,
  BookOpen,
  Users,
  LogOut,
  Home,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Digital Products", href: "/admin/products", icon: Package },
  { label: "Blog Posts", href: "/admin/blog", icon: BookOpen },
]

interface AdminSidebarProps {
  userEmail: string
  collapsed: boolean
  onToggle: () => void
}

export function AdminSidebar({ userEmail, collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      style={{ width: collapsed ? 56 : 240 }}
      className="fixed top-0 left-0 h-screen bg-peach flex flex-col z-40 border-r border-peach-dark/20 transition-all duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="px-3 pt-4 pb-5 flex items-center justify-between min-w-0">
        {!collapsed && (
          <span className="font-heading text-base font-800 text-ink truncate">Admin</span>
        )}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 p-1.5 rounded-lg text-ink/50 hover:bg-peach-dark/20 hover:text-ink transition-colors ${collapsed ? "mx-auto" : ""}`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 flex flex-col gap-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
                isActive
                  ? "bg-peach-dark/30 text-ink"
                  : "text-ink/70 hover:bg-peach-dark/20 hover:text-ink"
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-peach-dark/20">
        <Link
          href="/"
          title={collapsed ? "View site" : undefined}
          className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-sans font-medium text-ink/70 hover:bg-peach-dark/20 hover:text-ink transition-colors mb-1"
        >
          <Home size={16} className="flex-shrink-0" />
          {!collapsed && <span>View site</span>}
        </Link>
        {!collapsed && (
          <p className="text-[10px] text-ink/40 font-sans truncate px-2.5 mb-2">{userEmail}</p>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title={collapsed ? "Sign out" : undefined}
          className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-sm font-sans font-medium text-ink/70 hover:bg-peach-dark/20 hover:text-ink transition-colors"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}

"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Video,
  FileStack,
  Users,
  LogOut,
  Home,
  Sun,
  Moon,
  Wrench,
  Inbox,
  MessageSquare,
  Lightbulb,
  CalendarCheck,
  TrendingUp,
  Mail,
  ShoppingCart,
  BarChart2,
  CalendarDays,
  Briefcase,
  type LucideIcon,
} from "lucide-react"
import { useState } from "react"
import { useAdminTheme } from "./AdminShell"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

type NavGroup = {
  label: string
  // standalone direct link (no expand/collapse)
  directHref?: string
  directIcon?: LucideIcon
  // collapsible group
  prefixes?: string[]
  items?: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    prefixes: ["/admin/stats", "/admin/sales"],
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Stats", href: "/admin/stats", icon: BarChart2 },
      { label: "Sales", href: "/admin/sales", icon: ShoppingCart },
    ],
  },
  {
    label: "Transactions",
    prefixes: ["/admin/bookings", "/admin/startup-scores", "/admin/idea-scores", "/admin/investor-list"],
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Templates", href: "/admin/products?tab=transactions", icon: FileStack },
      { label: "Investor List", href: "/admin/investor-list", icon: TrendingUp },
      { label: "Fundability Scores", href: "/admin/startup-scores", icon: Lightbulb },
      { label: "Idea Scores", href: "/admin/idea-scores", icon: Lightbulb },
    ],
  },
  {
    label: "Enquiry",
    prefixes: ["/admin/custom-requests", "/admin/service-inquiries"],
    items: [
      { label: "Custom Requests", href: "/admin/custom-requests", icon: MessageSquare },
      { label: "Service Enquiries", href: "/admin/service-inquiries", icon: Inbox },
    ],
  },
  {
    label: "Products",
    prefixes: ["/admin/products", "/admin/services", "/admin/tools", "/admin/investor-list-products"],
    items: [
      { label: "Templates", href: "/admin/products?tab=list", icon: FileStack },
      { label: "Investor Lists", href: "/admin/investor-list-products", icon: TrendingUp },
      { label: "Sessions", href: "/admin/services?tab=list", icon: Video },
      { label: "Slots", href: "/admin/services?tab=slots", icon: CalendarDays },
      { label: "Tools", href: "/admin/tools", icon: Wrench },
    ],
  },
  {
    label: "Users",
    directHref: "/admin/users",
    directIcon: Users,
  },
  {
    label: "Email Templates",
    directHref: "/admin/email-templates",
    directIcon: Mail,
  },
  {
    label: "Work",
    directHref: "/work",
    directIcon: Briefcase,
  },
]

interface AdminSidebarProps {
  userEmail: string
  collapsed: boolean
  onToggle: () => void
  notificationCounts?: Record<string, number>
}

function isItemActive(item: NavItem, pathname: string, searchParams: URLSearchParams): boolean {
  const [itemPath, itemQuery] = item.href.split("?")
  const pathMatch = itemPath === "/admin" ? pathname === "/admin" : pathname.startsWith(itemPath)
  if (!pathMatch) return false
  if (!itemQuery) return true
  const params = new URLSearchParams(itemQuery)
  return [...params.entries()].every(([k, v]) => searchParams.get(k) === v)
}

function getAllItems(group: NavGroup): NavItem[] {
  return group.items ?? []
}

export function AdminSidebar({ userEmail, collapsed, onToggle, notificationCounts = {} }: AdminSidebarProps) {
  const pathname = usePathname()
  const rawSearchParams = useSearchParams()
  const searchParams = new URLSearchParams(rawSearchParams.toString())
  const { theme, toggleTheme } = useAdminTheme()

  const getInitialOpen = () => {
    for (const g of navGroups) {
      if (g.directHref) continue
      const prefixes = g.prefixes ?? []
      const isOverview = g.label === "Overview"
      if (isOverview && (pathname === "/admin" || prefixes.some((p) => pathname.startsWith(p)))) return g.label
      if (!isOverview && prefixes.some((p) => pathname.startsWith(p))) return g.label
      if (getAllItems(g).some((item) => isItemActive(item, pathname, searchParams))) return g.label
    }
    return "Overview"
  }

  const [openGroup, setOpenGroup] = useState<string | null>(getInitialOpen)
  const toggleGroup = (label: string) => setOpenGroup((prev) => (prev === label ? null : label))
  const [profileOpen, setProfileOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)

  return (
    <>
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
        <nav className="flex-1 px-2 flex flex-col gap-1 overflow-y-auto scrollbar-none py-1">
          {navGroups.map((group) => {
            // ── Direct link (Users, Service Enquiries) ──────────────
            if (group.directHref && group.directIcon) {
              const isActive = pathname.startsWith(group.directHref)
              const Icon = group.directIcon
              const count = isActive ? 0 : (notificationCounts[group.directHref] ?? 0)
              if (collapsed) {
                return (
                  <div key={group.label}>
                    <div className="h-px bg-peach-dark/20 mx-1 my-1" />
                    <Link
                      href={group.directHref}
                      title={group.label}
                      className={`flex items-center justify-center py-2 rounded-lg transition-colors ${
                        isActive ? "bg-peach-dark/30 text-ink" : "text-ink/70 hover:bg-peach-dark/20 hover:text-ink"
                      }`}
                    >
                      <Icon size={16} />
                    </Link>
                  </div>
                )
              }
              return (
                <Link
                  key={group.label}
                  href={group.directHref}
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
                    isActive ? "bg-peach-dark/30 text-ink" : "text-ink/70 hover:bg-peach-dark/20 hover:text-ink"
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="truncate flex-1">{group.label}</span>
                  {count > 0 && (
                    <span className="flex-shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-peach-dark text-cream text-[10px] font-sans font-semibold px-1">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </Link>
              )
            }

            // ── Collapsible group ────────────────────────────────────
            const prefixes = group.prefixes ?? []
            const allItems = getAllItems(group)
            const isGroupActive =
              group.label === "Overview"
                ? pathname === "/admin" || prefixes.some((p) => pathname.startsWith(p))
                : prefixes.some((p) => pathname.startsWith(p)) ||
                  allItems.some((item) => isItemActive(item, pathname, searchParams))
            const isOpen = openGroup === group.label

            const groupTotal = allItems.reduce((sum, item) => {
              if (isItemActive(item, pathname, searchParams)) return sum
              return sum + (notificationCounts[item.href] ?? 0)
            }, 0)

            const renderItem = (item: NavItem) => {
              const active = isItemActive(item, pathname, searchParams)
              const Icon = item.icon
              const count = active ? 0 : (notificationCounts[item.href] ?? 0)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
                    collapsed ? "justify-center" : "pl-6 pr-2.5"
                  } ${active ? "bg-peach-dark/30 text-ink" : "text-ink/70 hover:bg-peach-dark/20 hover:text-ink"}`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                  {count > 0 && (
                    <span className="flex-shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-peach-dark text-cream text-[10px] font-sans font-semibold px-1">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </Link>
              )
            }

            return (
              <div key={group.label}>
                {collapsed ? (
                  <div className="h-px bg-peach-dark/20 mx-1 my-1" />
                ) : (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-sans font-medium uppercase tracking-wider transition-colors ${
                      isGroupActive && !isOpen ? "text-ink" : "text-ink/40 hover:text-ink"
                    }`}
                  >
                    <span>{group.label}</span>
                    <div className="flex items-center gap-1.5">
                      {groupTotal > 0 && (
                        <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-peach-dark text-cream text-[10px] font-sans font-semibold px-1">
                          {groupTotal > 99 ? "99+" : groupTotal}
                        </span>
                      )}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                    </div>
                  </button>
                )}

                {(isOpen || collapsed) && (
                  <div className={collapsed ? "flex flex-col gap-0.5" : "flex flex-col gap-0.5 mb-1"}>
                    {(group.items ?? []).map(renderItem)}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer — kept exactly as-is */}
        <div className="px-2 py-3 border-t border-peach-dark/20 flex flex-col gap-0.5">
          <Link
            href="/"
            title={collapsed ? "View site" : undefined}
            className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-sans font-medium text-ink/70 hover:bg-peach-dark/20 hover:text-ink transition-colors"
          >
            <Home size={16} className="flex-shrink-0" />
            {!collapsed && <span>View site</span>}
          </Link>

          {!collapsed ? (
            <div className="mt-1 rounded-xl bg-peach-dark/10 overflow-hidden flex flex-col-reverse">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-peach-dark/10 transition-colors"
              >
                <div className="flex flex-col gap-0.5 min-w-0 text-left">
                  <span className="text-[11px] font-sans font-semibold text-ink leading-tight truncate">Admin</span>
                  <span className="text-[10px] font-sans text-ink/50 leading-tight truncate">{userEmail}</span>
                </div>
                <ChevronDown size={12} className={`text-ink/40 flex-shrink-0 transition-transform duration-200 ${profileOpen ? "" : "rotate-180"}`} />
              </button>
              {profileOpen && (
                <div className="border-b border-peach-dark/20 flex flex-col">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-sans font-medium text-ink/60 hover:bg-peach-dark/20 hover:text-ink transition-colors"
                  >
                    {theme === "dark" ? <Sun size={13} className="flex-shrink-0" /> : <Moon size={13} className="flex-shrink-0" />}
                    <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
                  </button>
                  <button
                    onClick={() => setSignOutOpen(true)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-sans font-medium text-ink/60 hover:bg-peach-dark/20 hover:text-ink transition-colors"
                  >
                    <LogOut size={13} className="flex-shrink-0" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                title={theme === "dark" ? "Light mode" : "Dark mode"}
                className="flex items-center justify-center w-full py-2 rounded-lg text-ink/60 hover:bg-peach-dark/20 hover:text-ink transition-colors"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setSignOutOpen(true)}
                title="Sign out"
                className="flex items-center justify-center w-full py-2 rounded-lg text-ink/60 hover:bg-peach-dark/20 hover:text-ink transition-colors"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </aside>

      {signOutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSignOutOpen(false)}>
          <div
            className="flex flex-col items-center gap-6 px-10 py-10 border border-border rounded-2xl bg-card shadow-xl w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-sans text-sm text-ink">are you sure you want to sign out?</p>
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full inline-flex items-center justify-center font-sans font-semibold text-sm py-2.5 rounded-xl bg-ink text-cream hover:bg-ink/80 transition-colors"
              >
                yes, sign out
              </button>
              <button
                onClick={() => setSignOutOpen(false)}
                className="w-full inline-flex items-center justify-center font-sans font-semibold text-sm py-2.5 rounded-xl border border-border text-ink hover:bg-muted transition-colors"
              >
                go back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

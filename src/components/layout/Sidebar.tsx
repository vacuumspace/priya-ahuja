"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import SignInOptions from "@/components/SignInOptions"

type SidebarProps = { isAdmin?: boolean; isSignedIn?: boolean; userName?: string; userEmail?: string }

const topItems = [
  { label: "home", href: "/", badge: null },
  { label: "connect", href: "/connect", badge: null },
]

const topicGroups = [
  {
    label: "startup",
    prefix: "/startup",
    children: [
      { label: "blog", href: "/startup/blog" },
      { label: "tools", href: "/startup/tools" },
      { label: "templates", href: "/startup/templates" },
      { label: "100 startup ideas", href: "/startup/ideas" },
    ],
  },
  {
    label: "fundraise",
    prefix: "/fundraise",
    children: [
      { label: "blog", href: "/fundraise/blog" },
      { label: "tools", href: "/fundraise/tools" },
      { label: "templates", href: "/fundraise/templates" },
      { label: "angel investors", href: "/fundraise/angel-investors" },
    ],
  },
  {
    label: "services",
    prefix: "/services",
    children: [
      { label: "tech product development", href: "/services/tech" },
      { label: "branding", href: "/services/branding" },
      { label: "finance", href: "/services/accounting" },
      { label: "legal compliance", href: "/services/incorporation" },
    ],
  },
]

const bottomItems: { label: string; href: string; badge: null }[] = []

export function Sidebar({ isAdmin = false, isSignedIn = false, userName, userEmail }: SidebarProps = {}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()

  const [open, setOpen] = useState<string | null>(() => {
    if (pathname.startsWith("/startup") || pathname.startsWith("/tools/startup-score")) return "startup"
    if (pathname.startsWith("/fundraise")) return "fundraise"
    if (pathname.startsWith("/services")) return "services"
    return null
  })

  // Sync sidebar-collapsed class on body for main margin adjustment
  useEffect(() => {
    document.body.classList.toggle("sidebar-collapsed", collapsed)
  }, [collapsed])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const toggle = (label: string) => setOpen((prev) => (prev === label ? null : label))

  const SidebarContent = () => (
    <>
      {/* Logo / name */}
      <div className="px-5 pt-4 pb-6 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="block">
            <span className="font-heading text-xl font-800 text-ink leading-tight">Priya Ahuja</span>
          </Link>
        )}
        {/* Theme toggle */}
        {!collapsed && (
          <button
            onClick={toggleTheme}
            className="text-ink/40 hover:text-ink transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        )}
        {/* Desktop collapse button */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="hidden md:flex text-ink/40 hover:text-ink transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-ink/40 hover:text-ink transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className={`flex-1 px-3 flex flex-col gap-1 overflow-y-auto scrollbar-none ${collapsed ? "hidden" : ""}`}>
        {topItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
                isActive
                  ? "bg-peach-dark/30 text-ink"
                  : "text-ink/70 hover:bg-peach-dark/20 hover:text-ink"
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-ink/10 text-ink/60 rounded px-1.5 py-0.5 font-mono">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}

        {topicGroups.map((group) => {
          const isGroupActive = pathname.startsWith(group.prefix) ||
            (group.label === "startup" && pathname.startsWith("/tools/startup-score"))
          const isOpen = open === group.label

          return (
            <div key={group.label}>
              <button
                onClick={() => toggle(group.label)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
                  isGroupActive
                    ? "bg-peach-dark/30 text-ink"
                    : "text-ink/70 hover:bg-peach-dark/20 hover:text-ink"
                }`}
              >
                <span>{group.label}</span>
                <ChevronDown
                  size={13}
                  className={`text-ink/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-peach-dark/20 pl-3">
                  {group.children.map((child) => {
                    const isActive = pathname === child.href || pathname.startsWith(child.href + "/")
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`px-2 py-1.5 rounded-md text-xs font-sans font-medium transition-colors ${
                          isActive
                            ? "bg-peach-dark/20 text-ink"
                            : "text-ink/60 hover:bg-peach-dark/10 hover:text-ink"
                        }`}
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {bottomItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
                isActive
                  ? "bg-peach-dark/30 text-ink"
                  : "text-ink/70 hover:bg-peach-dark/20 hover:text-ink"
              }`}
            >
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Profile + Footer */}
      {!collapsed && (
        <div className="border-t border-peach-dark/20 px-4 pt-3 pb-4 flex flex-col gap-3">

          {/* History link */}
          <Link
            href="/my-sessions"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
              pathname === "/my-sessions"
                ? "bg-peach-dark/30 text-ink"
                : "text-ink/70 hover:bg-peach-dark/20 hover:text-ink"
            }`}
          >
            history
          </Link>

          <Link
            href="/profile"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
              pathname === "/profile"
                ? "bg-peach-dark/30 text-ink"
                : "text-ink/70 hover:bg-peach-dark/20 hover:text-ink"
            }`}
          >
            profile
          </Link>

          {/* Profile card */}
          <div className="bg-peach-dark/10 rounded-xl px-3 py-2.5 flex flex-col gap-0.5">
            {isSignedIn ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-sans font-semibold text-ink leading-tight">{userName ?? "—"}</span>
                  {isAdmin && (
                    <Link href="/admin" className="text-[9px] font-sans font-semibold uppercase tracking-wide bg-ink text-cream rounded px-1.5 py-0.5 hover:bg-ink/80 transition-colors">
                      admin
                    </Link>
                  )}
                </div>
                <span className="text-[10px] font-sans text-ink/50 leading-tight truncate">{userEmail ?? ""}</span>
                <a href="/api/auth/signout" className="mt-1.5 text-[10px] font-sans text-ink/40 hover:text-ink transition-colors">
                  sign out
                </a>
              </>
            ) : (
              <SignInOptions callbackUrl="/" compact googleLabel="sign in with Google" />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
            <span className="text-[10px] text-ink/40 font-sans">©2026 Priya Ahuja</span>
            <Link href="/contact" className="text-[10px] font-sans text-ink/40 hover:text-ink transition-colors">contact</Link>
            <Link href="/privacy-policy" className="text-[10px] font-sans text-ink/40 hover:text-ink transition-colors">privacy</Link>
            <Link href="/terms" className="text-[10px] font-sans text-ink/40 hover:text-ink transition-colors">terms</Link>
          </div>

        </div>
      )}
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-peach border-b border-peach-dark/20 flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-heading text-lg font-800 text-ink">Priya Ahuja</Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="text-ink/60 hover:text-ink transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            className="text-ink/60 hover:text-ink transition-colors"
            aria-label="Open menu"
          >
          <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-screen w-64 bg-peach flex flex-col z-50 border-r border-peach-dark/20 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex ${collapsed ? "w-12" : "sidebar-width"} fixed top-0 left-0 h-screen bg-peach flex-col z-40 border-r border-peach-dark/20 transition-all duration-200`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

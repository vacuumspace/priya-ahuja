"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Menu, X } from "lucide-react"

type SidebarProps = { isAdmin?: boolean; isSignedIn?: boolean; userName?: string; userEmail?: string }

const topItems = [
  { label: "home", href: "/", badge: null },
  { label: "consult", href: "/consult", badge: null },
]

const topicGroups = [
  {
    label: "startup",
    prefix: "/startup",
    children: [
      { label: "blog", href: "/startup/blog" },
      { label: "tools", href: "/startup/tools" },
      { label: "templates", href: "/startup/templates" },
    ],
  },
  {
    label: "fundraise",
    prefix: "/fundraise",
    children: [
      { label: "blog", href: "/fundraise/blog" },
      { label: "tools", href: "/fundraise/tools" },
      { label: "templates", href: "/fundraise/templates" },
    ],
  },
]

const bottomItems: { label: string; href: string; badge: null }[] = []

export function Sidebar({ isAdmin = false, isSignedIn = false, userName, userEmail }: SidebarProps = {}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [open, setOpen] = useState<string | null>(() => {
    if (pathname.startsWith("/startup")) return "startup"
    if (pathname.startsWith("/fundraise")) return "fundraise"
    return null
  })

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
        {/* Desktop collapse button */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="hidden md:flex text-ink/40 hover:text-ink transition-colors ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-ink/40 hover:text-ink transition-colors ml-auto"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className={`flex-1 px-3 flex flex-col gap-1 ${collapsed ? "hidden" : ""}`}>
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
          const isGroupActive = pathname.startsWith(group.prefix)
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
              <form method="POST" action="/api/auth/signin/google">
                <input type="hidden" name="callbackUrl" value="/" />
                <button type="submit" className="flex items-center justify-center gap-1.5 w-full text-[11px] font-sans text-ink/50 hover:text-ink transition-colors">
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  sign in with Google
                </button>
              </form>
            )}
          </div>

          {/* Copyright */}
          <div className="flex items-center">
            <span className="text-[10px] text-ink/40 font-sans">©2026 Priya Ahuja</span>
          </div>

          {/* Legal footer */}
          <div className="flex gap-3 whitespace-nowrap">
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
        <button
          onClick={() => setMobileOpen(true)}
          className="text-ink/60 hover:text-ink transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
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

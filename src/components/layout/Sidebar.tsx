"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Menu, X } from "lucide-react"

type SidebarProps = { isAdmin?: boolean; isSignedIn?: boolean; userName?: string; userEmail?: string }

const topItems = [
  { label: "home", href: "/", badge: null },
  { label: "consult", href: "/services", badge: null },
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

const bottomItems = [{ label: "contact", href: "/contact", badge: null }]

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

      {/* CTA */}
      <div className={`px-4 py-4 border-t border-peach-dark/20 ${collapsed ? "hidden" : ""}`}>
        <Link
          href="/services"
          className="block w-full text-center bg-ink text-cream text-xs font-sans font-semibold py-2.5 px-4 rounded-lg hover:bg-ink/80 transition-colors"
        >
          consult with Priya
        </Link>
      </div>

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
              <>
                <span className="text-[11px] font-sans text-ink/60 leading-tight">not signed in</span>
                <a href="/api/auth/signin" className="mt-1 text-[11px] font-sans font-medium text-ink hover:underline transition-colors">
                  sign in →
                </a>
              </>
            )}
          </div>

          {/* Social + copyright */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-ink/40 font-sans">©2026 Priya Ahuja</span>
            <div className="flex gap-3">
              <a href="https://www.linkedin.com/in/ca-priya-harwani/" target="_blank" rel="noopener noreferrer" className="text-ink/40 hover:text-ink transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.instagram.com/pitchtopriya" target="_blank" rel="noopener noreferrer" className="text-ink/40 hover:text-ink transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Legal footer */}
          <div className="flex gap-3">
            <Link href="/privacy-policy" className="text-[10px] font-sans text-ink/40 hover:text-ink transition-colors">privacy policy</Link>
            <Link href="/terms" className="text-[10px] font-sans text-ink/40 hover:text-ink transition-colors">terms & conditions</Link>
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

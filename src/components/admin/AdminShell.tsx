"use client"

import { useState, useEffect, createContext, useContext, Suspense } from "react"
import { AdminSidebar } from "./AdminSidebar"

const CollapseCtx = createContext({ collapsed: false })
export const useAdminCollapsed = () => useContext(CollapseCtx)

const ThemeCtx = createContext({ theme: "light", toggleTheme: () => {} })
export const useAdminTheme = () => useContext(ThemeCtx)

interface AdminShellProps {
  userEmail: string
  children: React.ReactNode
  notificationCounts?: Record<string, number>
}

export function AdminShell({ userEmail, children, notificationCounts = {} }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const storedCollapse = localStorage.getItem("admin-sidebar-collapsed")
    if (storedCollapse === "true") setCollapsed(true)

    const storedTheme = localStorage.getItem("admin-theme") as "light" | "dark" | null
    const initial = storedTheme ?? "light"
    setTheme(initial)
    if (initial === "dark") document.documentElement.classList.add("dark")
  }, [])

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    localStorage.setItem("admin-theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme }}>
      <CollapseCtx.Provider value={{ collapsed }}>
        <div className="flex min-h-screen bg-cream">
          <Suspense fallback={null}>
            <AdminSidebar
              userEmail={userEmail}
              collapsed={collapsed}
              notificationCounts={notificationCounts}
              onToggle={() => {
                const next = !collapsed
                setCollapsed(next)
                localStorage.setItem("admin-sidebar-collapsed", String(next))
              }}
            />
          </Suspense>
          <main
            className="flex-1 min-h-screen transition-all duration-200"
            style={{ marginLeft: collapsed ? 56 : 240 }}
          >
            {children}
          </main>
        </div>
      </CollapseCtx.Provider>
    </ThemeCtx.Provider>
  )
}

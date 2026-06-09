"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { AdminSidebar } from "./AdminSidebar"

const CollapseCtx = createContext({ collapsed: false })
export const useAdminCollapsed = () => useContext(CollapseCtx)

interface AdminShellProps {
  userEmail: string
  children: React.ReactNode
}

export function AdminShell({ userEmail, children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed")
    if (stored === "true") setCollapsed(true)
  }, [])

  return (
    <CollapseCtx.Provider value={{ collapsed }}>
      <div className="flex min-h-screen bg-cream">
        <AdminSidebar
          userEmail={userEmail}
          collapsed={collapsed}
          onToggle={() => {
            const next = !collapsed
            setCollapsed(next)
            localStorage.setItem("admin-sidebar-collapsed", String(next))
          }}
        />
        <main
          className="flex-1 min-h-screen transition-all duration-200"
          style={{ marginLeft: collapsed ? 56 : 240 }}
        >
          {children}
        </main>
      </div>
    </CollapseCtx.Provider>
  )
}

"use client"

import { useEffect, useState } from "react"

const links = [
  { label: "experience", href: "#experience" },
  { label: "startup", href: "#strategy" },
  { label: "fundraising", href: "#fundraising" },
  { label: "how i work", href: "#how-i-work" },
  { label: "principles", href: "#principles" },
  { label: "get started", href: "#onboarding" },
]

export function AnchorNav() {
  const [active, setActive] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const update = () => setSidebarCollapsed(document.body.classList.contains("sidebar-collapsed"))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* spacer so content doesn't hide under the fixed nav */}
      <div className="h-[41px]" />
      <div className={`fixed top-[52px] md:top-0 left-0 right-0 z-10 bg-cream shadow-sm border-b border-border px-4 md:px-10 py-3 flex gap-5 overflow-x-auto scrollbar-none transition-all duration-200 ${sidebarCollapsed ? "md:left-12" : "md:left-[240px]"}`}>
      {links.map((link) => {
        const isActive = active === link.href.slice(1)
        return (
          <a
            key={link.href}
            href={link.href}
            className={`font-sans text-[11px] whitespace-nowrap transition-colors ${
              isActive ? "text-ink font-600" : "text-ink/50 hover:text-ink"
            }`}
          >
            {link.label}
          </a>
        )
      })}
    </div>
    </>
  )
}

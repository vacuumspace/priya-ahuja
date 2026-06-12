"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  className?: string
}

export function CustomSelect({ value, onChange, options, placeholder, className = "" }: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink focus:outline-none focus:border-peach-dark/50 transition-colors"
      >
        <span className={selected ? "text-ink" : "text-ink/40"}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={14} className={`text-ink/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="absolute z-50 w-full mt-1 bg-cream-light border border-peach-dark/20 rounded-xl overflow-hidden shadow-lg">
          <li
            className="px-3 py-2.5 text-sm font-sans text-ink/40 cursor-pointer hover:bg-peach/20"
            onClick={() => { onChange(""); setOpen(false) }}
          >
            {placeholder}
          </li>
          {options.map((o) => (
            <li
              key={o.value}
              className={`px-3 py-2.5 text-sm font-sans cursor-pointer hover:bg-peach/20 ${value === o.value ? "text-ink font-medium" : "text-ink/80"}`}
              onClick={() => { onChange(o.value); setOpen(false) }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useRef } from "react"
import { Search } from "lucide-react"

const PAGE_SIZE = 10

interface UsersControlsProps {
  total: number
  page: number
  totalPages: number
  search: string
}

export function UsersControls({ total, page, totalPages, search }: UsersControlsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function navigate(params: Record<string, string>) {
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => v && sp.set(k, v))
    startTransition(() => router.push(`${pathname}?${sp.toString()}`))
  }

  function onSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      navigate({ search: value, page: "1" })
    }, 300)
  }

  function goTo(p: number) {
    navigate({ search, page: String(p) })
  }

  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none" />
        <input
          type="text"
          defaultValue={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name or email…"
          className="w-full pl-9 pr-4 py-2 font-sans text-sm bg-card border border-border rounded-xl text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/30"
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-ink/30 font-sans">loading…</span>
        )}
      </div>

      {/* Pagination row */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-sans text-xs text-ink/40">
            {total === 0 ? "No results" : `${start}–${end} of ${total}`}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => goTo(page - 1)}
              className="px-3 py-1.5 font-sans text-xs rounded-lg border border-border text-ink/60 hover:bg-peach/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="px-3 font-sans text-xs text-ink/50">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => goTo(page + 1)}
              className="px-3 py-1.5 font-sans text-xs rounded-lg border border-border text-ink/60 hover:bg-peach/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

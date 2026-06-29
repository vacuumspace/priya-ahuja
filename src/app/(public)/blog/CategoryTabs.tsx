"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function CategoryTabs({ categories, active }: { categories: string[]; active: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setActive(cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === "all") {
      params.delete("tag")
    } else {
      params.set("tag", cat)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`text-[13px] font-sans px-3 py-1.5 rounded-full border transition-all ${
            active === cat
              ? "bg-ink text-cream border-ink"
              : "bg-transparent text-ink/50 border-border hover:border-ink/30 hover:text-ink/70"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

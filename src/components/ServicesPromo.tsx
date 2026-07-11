import Link from "next/link"

export type ServicePromo = {
  title: string
  description: string
  href: string
  cta: string
}

type Props = {
  heading: string
  services: ServicePromo[]
}

export default function ServicesPromo({ heading, services }: Props) {
  return (
    <div>
      <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-1">Services</p>
      <p className="font-sans text-sm font-semibold text-ink/70 mb-3">{heading}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="border border-border rounded-xl px-5 py-4 hover:border-peach-dark/40 hover:shadow-sm transition-all flex flex-col gap-1"
          >
            <span className="font-sans text-sm font-semibold text-ink">{s.title}</span>
            <span className="font-sans text-xs text-ink/50 leading-relaxed">{s.description}</span>
            <span className="font-sans text-xs font-semibold text-peach-dark mt-1.5">{s.cta} →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

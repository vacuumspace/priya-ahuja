"use client"

import { useState } from "react"

type Product = { id: string; slug: string; title: string; price: number }

function ProductRow({ product }: { product: Product }) {
  const [title, setTitle] = useState(product.title)
  const [price, setPrice] = useState(String(product.price / 100))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isDirty = title !== product.title || price !== String(product.price / 100)

  async function save() {
    const priceVal = Math.round(parseFloat(price) * 100)
    if (isNaN(priceVal) || priceVal <= 0) return
    setSaving(true)
    await fetch(`/api/admin/digital-products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price: priceVal }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-card border border-border rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-sans text-[10px] text-ink/30 font-mono mb-1">{product.slug}</p>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="font-sans text-sm font-semibold text-ink bg-transparent border-b border-transparent hover:border-border focus:border-peach-dark/50 focus:outline-none w-full pb-0.5"
        />
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 border border-border rounded-lg px-3 py-1.5 bg-cream">
          <span className="font-sans text-xs text-ink/40">₹</span>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="font-sans text-sm font-semibold text-ink bg-transparent focus:outline-none w-24"
            placeholder="999"
          />
        </div>
        <button
          onClick={save}
          disabled={!isDirty || saving}
          className="font-sans text-xs font-semibold px-4 py-2 rounded-lg bg-ink text-cream hover:bg-ink/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  )
}

export default function InvestorListProductsClient({ products }: { products: Product[] }) {
  return (
    <div className="px-10 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-800 text-ink">Investor List Products</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">Edit title and price. Changes apply to the next Razorpay checkout immediately.</p>
      </div>

      <div className="flex flex-col gap-3 max-w-2xl">
        {products.map(p => (
          <ProductRow key={p.slug} product={p} />
        ))}
      </div>
    </div>
  )
}

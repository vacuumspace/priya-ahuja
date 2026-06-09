"use client"

import { useEffect, useState } from "react"

type Product = {
  id: string
  slug: string
  title: string
  description: string
  shortDescription: string | null
  price: number
  fileUrl: string | null
  previewImageUrl: string | null
  isActive: boolean
  createdAt: string
}

function ProductCard({
  product,
  onUpdate,
}: {
  product: Product
  onUpdate: (id: string, patch: Partial<Product>) => void
}) {
  const [price, setPrice] = useState(String(product.price / 100))
  const [title, setTitle] = useState(product.title)

  const patch = async (data: Partial<Product>) => {
    await fetch(`/api/admin/digital-products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    onUpdate(product.id, data)
  }

  return (
    <div className={`bg-card border rounded-2xl p-5 ${product.isActive ? "border-border" : "border-border opacity-60"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => patch({ title })}
            className="font-heading text-base font-700 text-ink normal-case bg-transparent border-b border-transparent hover:border-border focus:border-peach-dark/50 focus:outline-none w-full pb-0.5"
          />
          <p className="font-sans text-xs text-ink/50 mt-2 leading-relaxed line-clamp-2">{product.shortDescription ?? product.description}</p>
          {product.fileUrl && (
            <p className="font-sans text-[10px] text-ink/30 mt-2 truncate">📎 {product.fileUrl}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <button
            onClick={() => patch({ isActive: !product.isActive })}
            className={`w-10 h-5 rounded-full transition-colors relative ${product.isActive ? "bg-ink" : "bg-border"}`}
            aria-label={product.isActive ? "Deactivate" : "Activate"}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${product.isActive ? "left-5" : "left-0.5"}`} />
          </button>

          <div className="flex items-center gap-1">
            <span className="text-sm font-sans text-ink/50">₹</span>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={() => {
                const val = Math.round(parseFloat(price) * 100)
                if (!isNaN(val)) patch({ price: val })
              }}
              className="w-20 text-sm font-sans bg-cream border border-border rounded-lg px-2 py-1 text-ink focus:outline-none focus:border-peach-dark/50"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/digital-products")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false) })
  }, [])

  const handleUpdate = (id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Digital Products</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{products.length} products</p>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-ink/40">Loading...</p>
      ) : products.length === 0 ? (
        <p className="font-sans text-sm text-ink/40">No products yet.</p>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}

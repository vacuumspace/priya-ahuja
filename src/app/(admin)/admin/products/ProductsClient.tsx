"use client"

import { useState } from "react"
import { Trash2, Plus, X } from "lucide-react"

type Product = {
  id: string
  slug: string
  title: string
  description: string
  shortDescription: string | null
  tag: string
  price: number
  fileUrl: string | null
  previewImageUrl: string | null
  isActive: boolean
  createdAt: string
}

type Purchase = {
  id: string
  userName: string
  userEmail: string
  razorpayPaymentId: string | null
  downloadToken: string | null
  createdAt: string
  amountPaid: number | null
  productTitle: string
  productSlug: string
}

const PRODUCT_TAGS = ["template", "playbook", "checklist", "guide", "toolkit", "swipe-file"]

function ProductCard({
  product,
  onUpdate,
  onDelete,
}: {
  product: Product
  onUpdate: (id: string, patch: Partial<Product>) => void
  onDelete: (id: string) => void
}) {
  const [price, setPrice] = useState(String(product.price / 100))
  const [title, setTitle] = useState(product.title)
  const [shortDesc, setShortDesc] = useState(product.shortDescription ?? "")
  const [fileUrl, setFileUrl] = useState(product.fileUrl ?? "")
  const [previewImageUrl, setPreviewImageUrl] = useState(product.previewImageUrl ?? "")
  const [tag, setTag] = useState(product.tag)

  const patch = async (data: Partial<Product>) => {
    await fetch(`/api/admin/digital-products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    onUpdate(product.id, data)
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return
    await fetch(`/api/admin/digital-products/${product.id}`, { method: "DELETE" })
    onDelete(product.id)
  }

  return (
    <div className={`bg-card border rounded-2xl p-5 ${product.isActive ? "border-border" : "border-border opacity-60"}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-mono text-ink/25 block mb-1">{product.slug}</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => patch({ title })}
            className="font-heading text-base font-700 text-ink normal-case bg-transparent border-b border-transparent hover:border-border focus:border-peach-dark/50 focus:outline-none w-full pb-0.5"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => patch({ isActive: !product.isActive })}
            className={`w-10 h-5 rounded-full transition-colors relative ${product.isActive ? "bg-ink" : "bg-border"}`}
            aria-label={product.isActive ? "Deactivate" : "Activate"}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${product.isActive ? "left-5" : "left-0.5"}`} />
          </button>
          <button onClick={handleDelete} className="p-1.5 rounded-lg text-ink/25 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Tag</label>
          <select
            value={tag}
            onChange={(e) => { setTag(e.target.value); patch({ tag: e.target.value }) }}
            className="w-full text-xs font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
          >
            {PRODUCT_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Price (₹)</label>
          <div className="flex items-center gap-1">
            <span className="text-sm font-sans text-ink/50">₹</span>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={() => {
                const val = Math.round(parseFloat(price) * 100)
                if (!isNaN(val)) patch({ price: val })
              }}
              className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-2 py-1 text-ink focus:outline-none focus:border-peach-dark/50"
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Short Description</label>
        <input
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          onBlur={() => patch({ shortDescription: shortDesc })}
          placeholder="One-line description shown on listing"
          className="w-full text-xs font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
        />
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">File URL</label>
        <input
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          onBlur={() => patch({ fileUrl: fileUrl || null })}
          placeholder="Vercel Blob or direct download URL"
          className="w-full text-xs font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
        />
      </div>

      <div>
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Preview Image URL</label>
        <input
          value={previewImageUrl}
          onChange={(e) => setPreviewImageUrl(e.target.value)}
          onBlur={() => patch({ previewImageUrl: previewImageUrl || null })}
          placeholder="Cover image shown on the public listing"
          className="w-full text-xs font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
        />
      </div>
    </div>
  )
}

function AddProductForm({ onAdd }: { onAdd: (p: Product) => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    slug: "", title: "", shortDescription: "", description: "",
    price: "", tag: "template", fileUrl: "",
  })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/admin/digital-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: form.slug, title: form.title,
        shortDescription: form.shortDescription,
        description: form.description,
        price: parseFloat(form.price),
        tag: form.tag,
        fileUrl: form.fileUrl || null,
      }),
    })
    const data = await res.json()
    onAdd(data)
    setForm({ slug: "", title: "", shortDescription: "", description: "", price: "", tag: "template", fileUrl: "" })
    setOpen(false)
    setSaving(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-sm font-sans font-semibold text-ink/60 border border-dashed border-border rounded-2xl px-5 py-3.5 hover:border-ink/30 hover:text-ink transition-colors w-full">
        <Plus size={14} /> Add Product
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-peach-dark/30 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-heading text-base font-700 text-ink">New Product</p>
        <button type="button" onClick={() => setOpen(false)} className="text-ink/30 hover:text-ink"><X size={16} /></button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Slug *</label>
          <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. investor-templates" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Tag *</label>
          <select value={form.tag} onChange={(e) => set("tag", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50">
            {PRODUCT_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Title *</label>
        <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Short Description</label>
        <input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="One-line shown on listing" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Description *</label>
        <textarea required rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50 resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Price (₹) *</label>
          <input required type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="499" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">File URL</label>
          <input value={form.fileUrl} onChange={(e) => set("fileUrl", e.target.value)} placeholder="optional" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-sans text-ink/40 hover:text-ink">Cancel</button>
        <button type="submit" disabled={saving} className="text-sm font-sans font-semibold bg-ink text-cream px-4 py-2 rounded-lg hover:bg-ink/80 disabled:opacity-50 transition-colors">
          {saving ? "Saving…" : "Add Product"}
        </button>
      </div>
    </form>
  )
}

function ListTab({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const handleUpdate = (id: string, patch: Partial<Product>) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  const handleDelete = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id))
  const handleAdd = (p: Product) =>
    setProducts((prev) => [p, ...prev])

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onUpdate={handleUpdate} onDelete={handleDelete} />
      ))}
      <AddProductForm onAdd={handleAdd} />
    </div>
  )
}

function TemplateTransactionsTab({ initialPurchases }: { initialPurchases: Purchase[] }) {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases)
  const [revoking, setRevoking] = useState<string | null>(null)

  const revoke = async (id: string, name: string) => {
    if (!confirm(`Revoke download access for ${name}? They will no longer be able to download.`)) return
    setRevoking(id)
    await fetch(`/api/admin/purchases/${id}`, { method: "PATCH" })
    setPurchases((prev) => prev.map((p) => p.id === id ? { ...p, downloadToken: null } : p))
    setRevoking(null)
  }

  if (purchases.length === 0) return <p className="font-sans text-sm text-ink/40">No template purchases yet.</p>

  const revenue = purchases.reduce((sum, p) => sum + (p.amountPaid ?? 0), 0)

  return (
    <div>
      <p className="font-sans text-xs text-ink/40 mb-4">
        {purchases.length} purchases · ₹{(revenue / 100).toLocaleString("en-IN")} revenue
      </p>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border bg-card">
              {["#", "Name", "Email", "Product", "Amount", "Payment ID", "Date", "Access"].map((h) => (
                <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchases.map((p, i) => (
              <tr key={p.id} className={i !== purchases.length - 1 ? "border-b border-border" : ""}>
                <td className="py-3 px-4 font-sans text-xs text-ink/30">{i + 1}</td>
                <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{p.userName}</td>
                <td className="py-3 px-4 font-sans text-sm text-ink/70">{p.userEmail}</td>
                <td className="py-3 px-4 font-sans text-xs text-ink/60">{p.productTitle}</td>
                <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{p.amountPaid != null ? `₹${(p.amountPaid / 100).toLocaleString("en-IN")}` : " - "}</td>
                <td className="py-3 px-4 font-sans text-xs text-ink/50">{p.razorpayPaymentId ?? " - "}</td>
                <td className="py-3 px-4 font-sans text-xs text-ink/50">
                  {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(p.createdAt))}
                </td>
                <td className="py-3 px-4">
                  {p.downloadToken ? (
                    <button
                      onClick={() => revoke(p.id, p.userName)}
                      disabled={revoking === p.id}
                      className="font-sans text-[11px] text-red-500 hover:underline disabled:opacity-40"
                    >
                      {revoking === p.id ? "Revoking…" : "Revoke"}
                    </button>
                  ) : (
                    <span className="font-sans text-[11px] text-ink/30">Revoked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

type ProductTab = "transactions" | "list"

export default function ProductsClient({
  initialProducts,
  initialPurchases,
  defaultTab,
}: {
  initialProducts: Product[]
  initialPurchases: Purchase[]
  defaultTab?: string
}) {
  const tab: ProductTab = (defaultTab as ProductTab) || "transactions"

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Templates</h1>
      </div>

      {tab === "transactions" ? (
        <TemplateTransactionsTab initialPurchases={initialPurchases} />
      ) : (
        <ListTab initialProducts={initialProducts} />
      )}
    </div>
  )
}

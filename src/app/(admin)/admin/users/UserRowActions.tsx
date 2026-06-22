"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, X } from "lucide-react"

interface Props {
  id: string
  name: string | null
  email: string
}

export function UserRowActions({ id, name, email }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState(name ?? "")
  const [editEmail, setEditEmail] = useState(email)
  const [error, setError] = useState("")

  function refresh() {
    startTransition(() => router.refresh())
  }

  async function handleDelete() {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    setShowDelete(false)
    refresh()
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, email: editEmail }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Something went wrong")
      return
    }
    setShowEdit(false)
    refresh()
  }

  return (
    <>
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => { setEditName(name ?? ""); setEditEmail(email); setShowEdit(true) }}
          className="p-1 text-ink/30 hover:text-ink/70 transition-colors"
          title="Edit user"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="p-1 text-ink/30 hover:text-red-500 transition-colors"
          title="Delete user"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowDelete(false)}>
          <div className="bg-white dark:bg-card border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="font-heading text-lg font-700 text-ink">Delete user?</h2>
              <button onClick={() => setShowDelete(false)} className="text-ink/40 hover:text-ink">
                <X size={16} />
              </button>
            </div>
            <p className="font-sans text-sm text-ink/60 mb-5">
              This will permanently delete <strong>{name ?? email}</strong> and all associated data. This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 font-sans text-sm border border-border rounded-xl text-ink/60 hover:bg-ink/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 font-sans text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowEdit(false)}>
          <div className="bg-white dark:bg-card border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-heading text-lg font-700 text-ink">Edit user</h2>
              <button onClick={() => setShowEdit(false)} className="text-ink/40 hover:text-ink">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleEdit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-sans text-xs text-ink/50">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Full name"
                  className="px-3 py-2 font-sans text-sm bg-transparent border border-border rounded-xl text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/40"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-sans text-xs text-ink/50">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="px-3 py-2 font-sans text-sm bg-transparent border border-border rounded-xl text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/40"
                />
              </div>
              {error && <p className="font-sans text-xs text-red-500">{error}</p>}
              <div className="flex gap-2 justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 font-sans text-sm border border-border rounded-xl text-ink/60 hover:bg-ink/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 font-sans text-sm bg-ink text-white rounded-xl hover:bg-ink/80 disabled:opacity-50 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

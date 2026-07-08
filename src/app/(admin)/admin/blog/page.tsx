"use client"

import { useEffect, useState } from "react"

type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  isPublished: boolean
  publishedAt: string | null
  tags: string[] | null
  createdAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/blog-posts")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false) })
  }, [])

  const togglePublished = async (id: string, current: boolean) => {
    const next = !current
    await fetch(`/api/admin/blog-posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: next }),
    })
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isPublished: next, publishedAt: next ? new Date().toISOString() : null }
          : p
      )
    )
  }

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Blog Posts</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{posts.length} posts</p>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-ink/40">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="font-sans text-sm text-ink/40">No blog posts yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card">
                {["Title", "Tags", "Published At", "Status"].map((h) => (
                  <th key={h} className="py-3 px-5 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border hover:bg-peach/20 transition-colors">
                  <td className="py-3 px-5">
                    <p className="text-sm font-sans font-medium text-ink">{post.title}</p>
                    {post.excerpt && (
                      <p className="text-[11px] font-sans text-ink/40 mt-0.5 line-clamp-1">{post.excerpt}</p>
                    )}
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex flex-wrap gap-1">
                      {(post.tags ?? []).map((tag) => (
                        <span key={tag} className="text-[10px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-xs font-sans text-ink/50">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                      : " - "}
                  </td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => togglePublished(post.id, post.isPublished)}
                      className={`flex items-center gap-2 text-xs font-sans font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                        post.isPublished
                          ? "bg-ink text-cream border-ink hover:bg-ink/80"
                          : "bg-transparent text-ink/60 border-border hover:border-ink/30 hover:text-ink"
                      }`}
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

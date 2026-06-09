import { db } from "@/lib/db"
import { users, sessions } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export default async function AdminUsersPage() {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
      image: users.image,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))

  return (
    <div className="px-10 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-800 text-ink">Users</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{allUsers.length} signed in</p>
      </div>

      <div className="border border-border rounded-2xl overflow-hidden">
        {allUsers.length === 0 ? (
          <p className="font-sans text-sm text-ink/40 px-6 py-10 text-center">No users yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Name</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Email</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Email Verified</th>
                <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user, i) => (
                <tr key={user.id} className={i !== allUsers.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-5 py-3.5 font-sans text-sm text-ink font-medium">
                    {user.name ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm text-ink/70">{user.email}</td>
                  <td className="px-5 py-3.5">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center gap-1.5 font-sans text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        ✓ verified
                      </span>
                    ) : (
                      <span className="font-sans text-xs text-ink/30">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm text-ink/50">
                    {user.createdAt
                      ? new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(user.createdAt))
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

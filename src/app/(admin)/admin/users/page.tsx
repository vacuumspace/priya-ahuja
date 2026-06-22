import { db } from "@/lib/db"
import { users, userProfiles } from "@/lib/db/schema"
import { desc, ilike, or, count, eq } from "drizzle-orm"
import { UsersControls } from "./UsersControls"
import { UserRowActions } from "./UserRowActions"
import Link from "next/link"

const PAGE_SIZE = 10

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const { page: pageParam, search: searchParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? "1", 10))
  const search = searchParam?.trim() ?? ""

  const filter = search
    ? or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))
    : undefined

  const [totalResult, rows] = await Promise.all([
    db.select({ count: count() }).from(users).where(filter),
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        phone: userProfiles.phone,
        businessName: userProfiles.businessName,
        businessType: userProfiles.businessType,
        stage: userProfiles.stage,
        location: userProfiles.location,
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(filter)
      .orderBy(desc(users.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
  ])

  const total = totalResult[0].count
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const offset = (page - 1) * PAGE_SIZE

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Users</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{total} total</p>
      </div>

      <div className="flex flex-col gap-4">
        <UsersControls total={total} page={page} totalPages={totalPages} search={search} />

        <div className="border border-border rounded-2xl overflow-hidden">
          {rows.length === 0 ? (
            <p className="font-sans text-sm text-ink/40 px-6 py-10 text-center">
              {search ? "No users match your search." : "No users yet."}
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3 w-12">S.No</th>
                  <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Name</th>
                  <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Email</th>
                  <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Business</th>
                  <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Location</th>
                  <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Phone</th>
                  <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Signed Up</th>
                  <th className="px-5 py-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {rows.map((user, i) => (
                  <tr key={user.id} className={i !== rows.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-5 py-3.5 font-sans text-sm text-ink/30">{offset + i + 1}</td>
                    <td className="px-5 py-3.5 font-sans text-sm font-medium">
                      <Link href={`/admin/users/${user.id}`} className="text-ink hover:text-peach-dark transition-colors">
                        {user.name ?? "—"}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-sans text-sm text-ink/70">{user.email}</td>
                    <td className="px-5 py-3.5 font-sans text-sm text-ink/70">
                      {user.businessName ? (
                        <span>{user.businessName}{user.stage ? <span className="ml-1.5 text-[10px] text-ink/40">· {user.stage}</span> : null}</span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3.5 font-sans text-sm text-ink/60">{user.location ?? "—"}</td>
                    <td className="px-5 py-3.5 font-sans text-sm text-ink/60">{user.phone ?? "—"}</td>
                    <td className="px-5 py-3.5 font-sans text-sm text-ink/50">
                      {user.createdAt
                        ? new Intl.DateTimeFormat("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(user.createdAt))
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <UserRowActions id={user.id} name={user.name} email={user.email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <p className="font-sans text-xs text-ink/30 text-right">
            Page {page} of {totalPages}
          </p>
        )}
      </div>
    </div>
  )
}

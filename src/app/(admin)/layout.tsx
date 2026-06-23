import { redirect } from "next/navigation"
import { auth, isAdmin } from "@/lib/auth"
import { AdminShell } from "@/components/admin/AdminShell"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    redirect("/")
  }

  return (
    <AdminShell userEmail={session.user?.email ?? ""}>
      {children}
    </AdminShell>
  )
}

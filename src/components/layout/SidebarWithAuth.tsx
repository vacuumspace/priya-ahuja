import { auth, isAdmin as checkAdmin } from "@/lib/auth"
import { Sidebar } from "./Sidebar"

export async function SidebarWithAuth() {
  const session = await auth()
  const signedIn = !!session?.user
  const admin = checkAdmin(session?.user?.email)

  return (
    <Sidebar
      isSignedIn={signedIn}
      isAdmin={admin}
      userName={session?.user?.name ?? undefined}
      userEmail={session?.user?.email ?? undefined}
    />
  )
}

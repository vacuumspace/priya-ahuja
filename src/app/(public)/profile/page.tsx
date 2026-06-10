import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { userProfiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { LogIn } from "lucide-react"
import { ProfileForm } from "./ProfileForm"
import SignInOptions from "@/components/SignInOptions"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <LogIn size={40} className="text-peach-dark mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-800 text-ink mb-2">sign in to set up your profile</h1>
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-6">
            your profile helps us personalise your experience.
          </p>
          <SignInOptions callbackUrl="/profile" />
        </div>
      </div>
    )
  }

  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, session.user.id))

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>profile</span>
        <span>{session.user.email}</span>
      </div>

      <div className="px-4 md:px-10 pt-10 pb-16 max-w-2xl">
        <h1 className="font-heading text-3xl font-800 text-ink mb-2">your profile</h1>
        <p className="font-sans text-sm text-ink/60 mb-10">
          all fields are optional. details will be used to personalise your experience for future interactions.
        </p>

        <ProfileForm
          initialName={session.user.name ?? ""}
          initialEmail={session.user.email ?? ""}
          initialProfile={profile ?? null}
        />
      </div>
    </div>
  )
}

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { accounts, bannedIdentities, sessions, users, verificationTokens } from "@/lib/db/schema"
import { addMinutes } from "@/lib/priya-gpt-time"

const PRIYA_GPT_FREE_TRIAL_MINUTES = 5

async function isEmailBanned(email: string | null | undefined): Promise<boolean> {
  if (!email) return false
  const [row] = await db.select({ id: bannedIdentities.id }).from(bannedIdentities).where(eq(bannedIdentities.email, email)).limit(1)
  return Boolean(row)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google],
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  callbacks: {
    async signIn({ user }) {
      if (await isEmailBanned(user.email)) return false
      return true
    },
    async session({ session, user }) {
      // catches an already-signed-in browser whose cookie predates a ban - signIn() only
      // guards new logins, so an existing session needs its own check on every read to cut
      // access off immediately instead of waiting for the cookie to expire or a sign-out.
      if (await isEmailBanned(user.email)) {
        await db.delete(sessions).where(eq(sessions.userId, user.id))
        session.user.id = ""
        return session
      }
      session.user.id = user.id
      return session
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.id) return
      // gift every brand-new signup a few free PriyaGPT minutes so they can try it immediately
      await addMinutes(user.id, PRIYA_GPT_FREE_TRIAL_MINUTES, { reason: "free_trial" })
    },
  },
})

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim())
  return adminEmails.includes(email)
}

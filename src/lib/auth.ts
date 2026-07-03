import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema"
import { addMinutes } from "@/lib/priya-gpt-time"

const PRIYA_GPT_FREE_TRIAL_MINUTES = 5

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
    session({ session, user }) {
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

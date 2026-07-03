import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptSessions, priyaGptMessages, users, priyaGptTimeTransactions } from "@/lib/db/schema"
import { eq, sql, desc } from "drizzle-orm"

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be", "been", "being",
  "to", "of", "in", "on", "at", "for", "with", "about", "against", "between", "into", "through",
  "during", "before", "after", "above", "below", "from", "up", "down", "out", "off", "over",
  "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how",
  "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "can", "will", "just", "should",
  "now", "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours",
  "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself",
  "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which",
  "who", "whom", "this", "that", "these", "those", "am", "have", "has", "had", "having", "do",
  "does", "did", "doing", "would", "could", "should", "might", "must", "shall", "if", "because",
  "as", "until", "while", "im", "dont", "its", "get", "got", "like", "want", "need", "think",
  "know", "also", "really", "one", "going", "make", "thing", "things", "lot", "much", "way",
  // generic conversational filler that isn't a "topic" even though it's not a classic stopword
  "good", "great", "nice", "yes", "yeah", "yep", "no", "okay", "ok", "sure", "thanks", "thank",
  "check", "checking", "sounds", "sound", "start", "started", "starting", "build", "building",
  "built", "help", "helps", "helping", "name", "names", "restriction", "restrictions", "shares",
  "share", "sharing", "right", "actually", "maybe", "probably", "basically", "definitely",
  "something", "anything", "everything", "someone", "anyone", "everyone", "let", "lets", "sure",
  "give", "giving", "gave", "take", "taking", "took", "look", "looking", "looked", "see", "seeing",
  "saw", "come", "coming", "came", "go", "went", "gone", "say", "said", "saying", "tell", "telling",
  "told", "ask", "asking", "asked", "answer", "answering", "answered", "yeah", "hey", "hi", "hello",
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))
}

// bigrams (two consecutive meaningful words) read as far more useful "topics" than lone unigrams
function extractTopics(texts: string[], limit: number): { term: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const text of texts) {
    const words = tokenize(text)
    const seen = new Set<string>()
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`
      if (seen.has(phrase)) continue
      seen.add(phrase)
      counts.set(phrase, (counts.get(phrase) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1) // drop one-off phrases; too noisy to call a "topic"
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term, count]) => ({ term, count }))
}

function extractFaqs(texts: string[], limit: number): { question: string; count: number }[] {
  const questions = texts
    .map((t) => t.trim())
    .filter((t) => t.includes("?"))

  const counts = new Map<string, { original: string; count: number }>()
  for (const q of questions) {
    const normalized = q.toLowerCase().replace(/[^a-z0-9\s?]/g, "").replace(/\s+/g, " ").trim()
    if (!normalized) continue
    const existing = counts.get(normalized)
    if (existing) {
      existing.count++
    } else {
      counts.set(normalized, { original: q, count: 1 })
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((r) => ({ question: r.original, count: r.count }))
}

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const perUser = await db
    .select({
      userId: priyaGptSessions.userId,
      userName: users.name,
      userEmail: users.email,
      sessionCount: sql<number>`count(distinct ${priyaGptSessions.id})`,
      messageCount: sql<number>`count(${priyaGptMessages.id})`,
      lastActive: sql<string>`max(${priyaGptSessions.startedAt})`,
    })
    .from(priyaGptSessions)
    .leftJoin(users, eq(priyaGptSessions.userId, users.id))
    .leftJoin(priyaGptMessages, eq(priyaGptMessages.sessionId, priyaGptSessions.id))
    .groupBy(priyaGptSessions.userId, users.name, users.email)
    .orderBy(desc(sql`max(${priyaGptSessions.startedAt})`))

  const spendByUser = await db
    .select({
      userId: priyaGptTimeTransactions.userId,
      spent: sql<number>`coalesce(sum(${priyaGptTimeTransactions.amountPaise}), 0)`,
    })
    .from(priyaGptTimeTransactions)
    .where(eq(priyaGptTimeTransactions.reason, "purchase"))
    .groupBy(priyaGptTimeTransactions.userId)

  const spendMap = new Map(spendByUser.map((r) => [r.userId, Number(r.spent)]))

  // real wall-clock time actually spent chatting, not the package minutes allotted —
  // a session paused and abandoned early only counts time up to the pause, not its full allotment
  const allSessions = await db
    .select({
      userId: priyaGptSessions.userId,
      startedAt: priyaGptSessions.startedAt,
      expiresAt: priyaGptSessions.expiresAt,
      pausedAt: priyaGptSessions.pausedAt,
    })
    .from(priyaGptSessions)

  const minutesMap = new Map<string, number>()
  const now = Date.now()
  for (const s of allSessions) {
    const start = s.startedAt.getTime()
    const end = s.pausedAt ? s.pausedAt.getTime() : Math.min(s.expiresAt.getTime(), now)
    const minutes = Math.max(0, Math.round((end - start) / 60000))
    minutesMap.set(s.userId, (minutesMap.get(s.userId) ?? 0) + minutes)
  }

  const [totals] = await db
    .select({
      totalSessions: sql<number>`count(distinct ${priyaGptSessions.id})`,
      totalMessages: sql<number>`count(${priyaGptMessages.id})`,
      totalUsers: sql<number>`count(distinct ${priyaGptSessions.userId})`,
    })
    .from(priyaGptSessions)
    .leftJoin(priyaGptMessages, eq(priyaGptMessages.sessionId, priyaGptSessions.id))

  const [totalSpentRow] = await db
    .select({ total: sql<number>`coalesce(sum(${priyaGptTimeTransactions.amountPaise}), 0)` })
    .from(priyaGptTimeTransactions)
    .where(eq(priyaGptTimeTransactions.reason, "purchase"))

  const userMessages = await db
    .select({ content: priyaGptMessages.content })
    .from(priyaGptMessages)
    .where(eq(priyaGptMessages.role, "user"))

  const texts = userMessages.map((m) => m.content)
  const topics = extractTopics(texts, 12)
  const faqs = extractFaqs(texts, 10)

  const totalMinutes = [...minutesMap.values()].reduce((s, m) => s + m, 0)

  return Response.json({
    users: perUser.map((r) => ({
      userId: r.userId,
      userName: r.userName ?? "Unknown",
      userEmail: r.userEmail ?? "",
      sessionCount: Number(r.sessionCount),
      messageCount: Number(r.messageCount),
      lastActive: r.lastActive,
      spent: spendMap.get(r.userId) ?? 0,
      minutesUsed: minutesMap.get(r.userId) ?? 0,
    })),
    insights: {
      totalSessions: Number(totals?.totalSessions ?? 0),
      totalMessages: Number(totals?.totalMessages ?? 0),
      totalUsers: Number(totals?.totalUsers ?? 0),
      totalRevenue: Number(totalSpentRow?.total ?? 0),
      totalMinutes,
      avgMessagesPerSession:
        Number(totals?.totalSessions ?? 0) > 0
          ? Math.round((Number(totals?.totalMessages ?? 0) / Number(totals?.totalSessions ?? 1)) * 10) / 10
          : 0,
      topics,
      faqs,
    },
  })
}

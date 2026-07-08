import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { startupMistakes } from "../src/lib/db/schema"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema: { startupMistakes } })

// staggered fake timestamps so "latest first" ordering looks natural
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000)

const items = [
  {
    userName: "Rohan Mehta",
    title: "raised too early and it killed our focus",
    body: "closed a seed round before we had product-market fit. spent 6 months chasing investor updates instead of talking to users. wish we'd bootstrapped longer.",
    industry: "SaaS / B2B",
    topic: "Fundraise",
    daysAgo: 2,
  },
  {
    userName: "Ananya Kapoor",
    title: "launched without validating with a single paying customer",
    body: "built for 4 months based on what i assumed people wanted. launched to silence. the idea was fine, i just never asked anyone before building.",
    industry: "D2C / E-commerce",
    topic: "Validation",
    daysAgo: 3,
  },
  {
    userName: "Vikram Singh",
    title: "picked a co-founder because we were friends, not because we worked well together",
    body: "we split within a year. great friendship, terrible working relationship, different risk appetite and no real conversation about equity or roles upfront.",
    industry: "Fintech",
    topic: "Co-founder",
    daysAgo: 5,
  },
  {
    userName: "Priya Nair",
    title: "chased 5 ideas at once instead of committing to one",
    body: "kept pivoting every time growth stalled instead of digging in. two years later, no single product had enough time to actually work.",
    industry: "Edtech",
    topic: "Idea",
    daysAgo: 6,
  },
  {
    userName: "Karan Chopra",
    title: "hired senior people way too early",
    body: "brought in a VP of sales before we had repeatable revenue. burned 8 months of runway on a hire with nothing to sell yet.",
    industry: "SaaS / B2B",
    topic: "Hiring",
    daysAgo: 8,
  },
  {
    userName: "Sneha Reddy",
    title: "built the product before figuring out how to reach customers",
    body: "spent all our energy on features and none on distribution. by the time we were ready to sell, we had no channel and no audience.",
    industry: "Healthtech",
    topic: "Marketing",
    daysAgo: 9,
  },
  {
    userName: "Arjun Malhotra",
    title: "undercharged for a year because i was scared of rejection",
    body: "priced our product at a third of what it was worth to avoid hearing 'no'. it took a painful repricing conversation with existing customers to fix it.",
    industry: "Marketplace",
    topic: "Sales",
    daysAgo: 11,
  },
  {
    userName: "Divya Iyer",
    title: "ignored a contract clause that cost us the company",
    body: "signed a vendor agreement without a lawyer reading the exclusivity clause. it locked us out of our own core market for 2 years.",
    industry: "Foodtech",
    topic: "Legal / Compliance",
    daysAgo: 13,
  },
  {
    userName: "Aditya Bhatt",
    title: "never built a real financial model until we ran out of cash",
    body: "tracked revenue in a spreadsheet with no runway projection. found out we had 6 weeks of cash left with zero warning.",
    industry: "AI / Deep Tech",
    topic: "Finance",
    daysAgo: 15,
  },
  {
    userName: "Meera Joshi",
    title: "tried to do everything myself instead of delegating",
    body: "burnt out trying to be the designer, salesperson, and support team at once. the business plateaued because i was the bottleneck on everything.",
    industry: "Services / Agency",
    topic: "Mindset",
    daysAgo: 17,
  },
  {
    userName: "Nikhil Rao",
    title: "kept adding features nobody asked for",
    body: "obsessed over a roadmap instead of talking to churned customers. we built a bloated product while our actual problem was retention, not features.",
    industry: "Media / Content",
    topic: "Product",
    daysAgo: 19,
  },
  {
    userName: "Ishita Verma",
    title: "took the highest offer instead of the right investor",
    body: "picked the investor offering the best valuation over the one who understood our space. spent the next year fighting over strategy instead of building.",
    industry: "Fintech",
    topic: "Fundraise",
    daysAgo: 21,
  },
  {
    userName: "Rahul Desai",
    title: "assumed our idea was unique without checking",
    body: "found out 8 months in that three well-funded competitors already existed. a single afternoon of research would've saved us the pivot.",
    industry: "D2C / E-commerce",
    topic: "Idea",
    daysAgo: 24,
  },
  {
    userName: "Tanya Sharma",
    title: "split equity 50/50 without a vesting schedule",
    body: "co-founder left after 4 months but kept half the company. no vesting meant we had no way to claw back their share.",
    industry: "Edtech",
    topic: "Co-founder",
    daysAgo: 27,
  },
]

async function seed() {
  for (const item of items) {
    const [row] = await db
      .insert(startupMistakes)
      .values({
        userId: null,
        userName: item.userName,
        title: item.title,
        body: item.body,
        industry: item.industry,
        topic: item.topic,
        status: "published",
        publishedAt: daysAgo(item.daysAgo),
        createdAt: daysAgo(item.daysAgo),
      })
      .returning({ id: startupMistakes.id, title: startupMistakes.title })

    console.log(`✓ ${row.title}`)
  }

  console.log(`\nDone, ${items.length} startup mistakes seeded.`)
}

seed().catch((err) => { console.error(err); process.exit(1) })

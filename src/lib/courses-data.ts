export type Course = {
  slug: string
  title: string
  description: string
  tag: string
  price: number
  duration: string
  lessons: number
  comingSoon?: boolean
}

export const courses: Course[] = [
  {
    slug: "business-model-design",
    title: "Business Model Design",
    description: "Learn how to design, stress-test, and iterate on business models that actually make money. Covers unit economics, pricing strategy, revenue streams, and competitive moats.",
    tag: "strategy",
    price: 199900,
    duration: "3 hrs",
    lessons: 14,
  },
  {
    slug: "startup-finance-for-founders",
    title: "Finance for Founders",
    description: "Read your P&L, manage cash flow, build financial projections, and make decisions using numbers — practical business finance without the jargon.",
    tag: "finance",
    price: 249900,
    duration: "5 hrs",
    lessons: 22,
  },
  {
    slug: "gtm-strategy",
    title: "Go-to-Market Strategy",
    description: "Build a GTM playbook from scratch: ICP definition, channel selection, early sales motion, pricing, and how to find your first 100 customers without burning money.",
    tag: "growth",
    price: 199900,
    duration: "3.5 hrs",
    lessons: 16,
  },
  {
    slug: "leadership-early-stage",
    title: "Leadership & Team Building",
    description: "How to hire, manage, and retain the right people — building culture, setting OKRs, navigating team dynamics, and leading through uncertainty and rapid change.",
    tag: "leadership",
    price: 249900,
    duration: "4 hrs",
    lessons: 20,
  },
  {
    slug: "sales-fundamentals",
    title: "Sales Fundamentals for Business Owners",
    description: "Build a repeatable sales process from the ground up — qualifying leads, running discovery calls, handling objections, closing deals, and managing a pipeline without a full sales team.",
    tag: "sales",
    price: 199900,
    duration: "4 hrs",
    lessons: 18,
  },
  {
    slug: "operations-and-systems",
    title: "Operations & Business Systems",
    description: "Design the systems that let your business run without you in every meeting — SOPs, workflows, vendor management, and operational metrics that actually matter.",
    tag: "operations",
    price: 229900,
    duration: "3.5 hrs",
    lessons: 16,
    comingSoon: true,
  },
]

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug)
}

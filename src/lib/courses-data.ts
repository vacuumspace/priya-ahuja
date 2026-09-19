export type CoursePhase = "Mindset" | "Idea" | "Build" | "Money" | "Launch & run" | "Mental Game" | "1:1 Live Session"

export type CourseChapter = {
  number: number
  title: string
  subtitle: string
  phase: CoursePhase
  // The concrete thing the founder walks away with.
  takeaway: string
  // A 1:1 session that comes with the course rather than a video: shown with
  // its worth and a link to book once the founder has paid in full.
  session?: { worth: string; bookHref: string }
}

export type Course = {
  slug: string
  title: string
  // Card image on the courses list (served from /public).
  thumbnailUrl: string
  tagline: string
  // Who it is for - shown right under the tagline so visitors can place themselves.
  audience: string
  // The one-line hook above the description.
  lead: string
  // Paragraphs separated by a blank line.
  description: string
  // Prices in rupees here; the payment code works in paise (see coursePaise).
  listPrice: number
  founderPrice: number
  preRegisterPrice: number
  seatCap: number
  // Founders who paid outside the site (direct bank transfer). They hold real
  // founding seats; their access is handled separately, off-site. Only counts
  // toward the seat cap and the "X of 100" line - bump it when more offline
  // pre-registrations come in.
  offlineSeats: number
  // Founder price + pre-registration close here (IST).
  offerEndsAt: string
  // Course goes live and balance payments open here (IST).
  launchesAt: string
  launchLabel: string
  hoursPerChapter: number
  chapters: CourseChapter[]
  // The one free gift. Its worth is read live from the tool's price setting.
  gift: { title: string; description: string; href: string }
  faqs: { q: string; a: string }[]
}

export const PHASES: CoursePhase[] = ["Mindset", "Idea", "Build", "Money", "Launch & run", "Mental Game", "1:1 Live Session"]

// What a founder gets out of each stage - shown on the collapsed phase cards.
export const PHASE_OUTCOMES: Record<CoursePhase, string> = {
  Mindset: "Start on the right foundation.",
  Idea: "Find an idea worth building, and prove people want it.",
  Build: "Turn it into a lean product with the right help.",
  Money: "Make sure the business makes money, and know your numbers.",
  "Launch & run": "Get your first paying customers and keep the business healthy.",
  "Mental Game": "Look after yourself, so you can keep building.",
  "1:1 Live Session": "Get personal guidance on your own idea.",
}

// The 1:1 gift only works for this session (services.slug).
export const COURSE_GIFT_SERVICE_SLUG = "startup-idea-brainstorming"

export const zeroToLaunch: Course = {
  slug: "zero-to-launch",
  title: "Finding Idea to 100 Customers",
  thumbnailUrl: "/courses/finding-idea-to-100-customers.svg",
  tagline: "This course will guide you from figuring out your idea to launching and getting your first 100 paying customers.",
  audience: "For working professionals, first-time founders, and anyone with an idea, or without one yet.",
  lead: "Wanting to start is the easy part. Knowing what to do first is where most people get stuck.",
  description:
    "This course gives you the path: what to build, who it's for, how to price it, and how to win your first customers.",
  listPrice: 8999,
  founderPrice: 4999,
  preRegisterPrice: 100,
  seatCap: 100,
  offlineSeats: 19,
  offerEndsAt: "2026-10-10T23:59:59+05:30",
  launchesAt: "2026-10-11T00:00:00+05:30",
  launchLabel: "11 October 2026",
  hoursPerChapter: 1,
  chapters: [
    {
      number: 1,
      title: "Why 95% Never Launch",
      subtitle: "Course intro",
      phase: "Mindset",
      takeaway: "An honest snapshot of where you stand",
    },
    {
      number: 2,
      title: "Birth of the Founder",
      subtitle: "Mindset before you start",
      phase: "Mindset",
      takeaway: "Your personal founder commitment",
    },
    {
      number: 3,
      title: "Small Wedge, Big Dream",
      subtitle: "Finding your idea",
      phase: "Idea",
      takeaway: "Three ideas, scored side by side",
    },
    {
      number: 4,
      title: "Talk First, Build Later",
      subtitle: "Validating the problem",
      phase: "Idea",
      takeaway: "A customer interview script and problems worth solving",
    },
    {
      number: 5,
      title: "The Rival That Doesn't Exist Yet",
      subtitle: "Competitors",
      phase: "Idea",
      takeaway: "A competitor map and your edge",
    },
    {
      number: 6,
      title: "Say It So They Get It",
      subtitle: "Making sure people want it",
      phase: "Build",
      takeaway: "A one-line pitch and a check that people want it",
    },
    {
      number: 7,
      title: "Build to Learn, Not to Impress",
      subtitle: "Your first version",
      phase: "Build",
      takeaway: "Your first version, scoped on one page",
    },
    {
      number: 8,
      title: "Two People, Zero Excuses",
      subtitle: "Your team",
      phase: "Build",
      takeaway: "A first-hire brief",
    },
    {
      number: 9,
      title: "Your Unfair Advantage",
      subtitle: "Using AI",
      phase: "Build",
      takeaway: "Your AI toolkit for the next 90 days",
    },
    {
      number: 10,
      title: "Making Money Make Sense",
      subtitle: "How you earn",
      phase: "Money",
      takeaway: "A one-page business model, with the numbers that show it can work",
    },
    {
      number: 11,
      title: "Know Your Numbers",
      subtitle: "Finance",
      phase: "Money",
      takeaway: "A simple profit and loss sheet for your startup",
    },
    {
      number: 12,
      title: "Your First 100 Customers",
      subtitle: "Getting customers",
      phase: "Launch & run",
      takeaway: "A 30-day launch plan",
    },
    {
      number: 13,
      title: "Say It Out Loud",
      subtitle: "Your message and brand",
      phase: "Launch & run",
      takeaway: "Your positioning and a 30-second pitch",
    },
    {
      number: 14,
      title: "Surviving Yourself",
      subtitle: "The mental game",
      phase: "Mental Game",
      takeaway: "Your founder wellbeing plan",
    },
    {
      number: 15,
      title: "Your Idea, Live with Priya",
      subtitle: "1:1 brainstorm",
      phase: "1:1 Live Session",
      takeaway: "Answers to your questions, and actionable insights on your plan",
      session: { worth: "₹2,999", bookHref: "/connect/startup-idea-brainstorming" },
    },
  ],
  gift: {
    title: "Startup Score Report Card",
    description:
      "A report card on how strong your startup is today, with a list of what to improve first. Use it on your idea or your early startup. One-time access, included with your course.",
    href: "/fundraise/tools/fundability-score",
  },
  faqs: [
    {
      q: "Who is this for?",
      a: "Working professionals who want to build something of their own, people still in college, and anyone with an idea who wants to launch and win their first paying customers. You don't need to have started anything yet.",
    },
    {
      q: "I don't have an idea yet. Is this still for me?",
      a: "Yes. The early chapters help you find an idea worth pursuing and check that real people want it, before you build anything.",
    },
    {
      q: "Can I do this alongside my job?",
      a: "Yes. It's pre-recorded, about an hour per chapter, so you can go at your own pace, one chapter at a time. You don't need to quit your job to begin.",
    },
    {
      q: "Do I need a tech or business background?",
      a: "No. Every chapter is practical and made for first-time founders, with a clear takeaway to finish each one.",
    },
    {
      q: "Which sectors is this for?",
      a: "All of them. Whether you're building a food brand, a fashion label, an edtech or healthtech product, a software tool, a service business or something in deeptech, the process is the same: find the problem, test the idea, build a lean first version, and win your first customers. What changes is the timeline. A deeptech product takes longer to build than a consumer brand, and the course also covers how to launch those.",
    },
    {
      q: "What does the ₹100 do?",
      a: "Pay ₹100 before 10 October to lock the founder price of ₹4,999 instead of ₹8,999. Your ₹100 is adjusted against the final price, so the balance is ₹4,899. It only locks the price. Your free gift and 1:1 session come with your course access.",
    },
    {
      q: "When does the course start?",
      a: "The course launches on 11 October 2026. That's when you pay the balance and get access.",
    },
    {
      q: "What format is it?",
      a: "Pre-recorded video, about an hour per chapter, with practical, hands-on tasks to finish each one. You get lifetime access, so you can learn at your own pace and come back anytime.",
    },
    {
      q: "Is there a refund?",
      a: "No. All payments, including the ₹100 pre-registration, are non-refundable.",
    },
    {
      q: "How does the 1:1 session work?",
      a: "It comes with the course. When you get access, sign in, pick a slot, and book one 30-minute startup idea brainstorming session with Priya. There's no payment step.",
    },
  ],
}

export const courses: Course[] = [zeroToLaunch]

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug)
}

// Server-side pricing, in paise. Everything the payment routes charge comes
// from here, never from the client.
export function coursePaise(course: Course) {
  return {
    list: course.listPrice * 100,
    founder: course.founderPrice * 100,
    preRegister: course.preRegisterPrice * 100,
  }
}

export function courseOfferOpen(course: Course, now = Date.now()) {
  return now <= new Date(course.offerEndsAt).getTime()
}

export function courseLaunched(course: Course, now = Date.now()) {
  return now >= new Date(course.launchesAt).getTime()
}

export type OptionValue = 0 | 1 | 2

export type QuestionOption = {
  label: string
  sublabel?: string
  points: number
}

export type Question = {
  id: number
  text: string
  pillarIndex: number
  options: [QuestionOption, QuestionOption, QuestionOption]
  recommendationByOption: [string | null, string | null, string | null]
}

export type Pillar = {
  index: number
  title: string
  maxPoints: number
  questionIds: number[]
}

export type Answers = Record<number, OptionValue>

export const PILLARS: Pillar[] = [
  { index: 0, title: "problem definition",      maxPoints: 12, questionIds: [1,  2,  3,  4,  5,  6] },
  { index: 1, title: "market opportunity",       maxPoints: 12, questionIds: [7,  8,  9,  10, 11, 12] },
  { index: 2, title: "solution & product",       maxPoints: 12, questionIds: [13, 14, 15, 16, 17, 18] },
  { index: 3, title: "competitive advantage",    maxPoints: 10, questionIds: [19, 20, 21, 22, 23] },
  { index: 4, title: "founder & team",           maxPoints: 12, questionIds: [24, 25, 26, 27, 28, 29] },
  { index: 5, title: "customer validation",      maxPoints: 12, questionIds: [30, 31, 32, 33, 34, 35] },
  { index: 6, title: "business model",           maxPoints: 12, questionIds: [36, 37, 38, 39, 40, 41] },
  { index: 7, title: "go-to-market",             maxPoints: 10, questionIds: [42, 43, 44, 45, 46] },
  { index: 8, title: "execution & scalability",  maxPoints: 8,  questionIds: [47, 48, 49, 50] },
]

export const QUESTIONS: Question[] = [
  // ─── Segment 0: Problem Definition ────────────────────────────────────────
  {
    id: 1,
    text: "how clearly can you define the problem you're solving?",
    pillarIndex: 0,
    options: [
      { label: "vague idea",               sublabel: "i know something is wrong but can't articulate it",   points: 0 },
      { label: "clear pain point",          sublabel: "i can describe who has it and what it costs them",    points: 1 },
      { label: "urgent pain with evidence", sublabel: "data, interviews, or personal experience back it up", points: 2 },
    ],
    recommendationByOption: [
      "Run 10 problem discovery interviews before writing any code. Document who has the pain, what they currently do, and what it costs them.",
      "Sharpen your problem statement with user evidence — 5 recorded interviews beat 50 survey responses.",
      null,
    ],
  },
  {
    id: 2,
    text: "how frequently does your target user experience this problem?",
    pillarIndex: 0,
    options: [
      { label: "rarely",             sublabel: "once a month or less",       points: 0 },
      { label: "occasionally",       sublabel: "weekly",                      points: 1 },
      { label: "daily or weekly",    sublabel: "constant friction in their workflow", points: 2 },
    ],
    recommendationByOption: [
      "Low-frequency problems are hard to monetise. Validate whether the pain intensity is high enough to justify the purchase even if infrequent.",
      "Weekly pain is workable. Document the exact trigger moments — that's where your activation hook lives.",
      null,
    ],
  },
  {
    id: 3,
    text: "what is the current cost of this problem to users?",
    pillarIndex: 0,
    options: [
      { label: "minor inconvenience",                sublabel: "no real cost, just annoying",                     points: 0 },
      { label: "notable cost",                       sublabel: "measurable time or money lost regularly",          points: 1 },
      { label: "significant operational pain",       sublabel: "measurable revenue loss, risk, or wasted headcount", points: 2 },
    ],
    recommendationByOption: [
      "If the problem has no real cost, users won't pay to solve it. Reframe around a sub-problem that does have economic impact.",
      "Quantify the cost. 'Time saved' is weak — convert it to money or risk, then use that number in your pitch.",
      null,
    ],
  },
  {
    id: 4,
    text: "how long has this problem existed without a good solution?",
    pillarIndex: 0,
    options: [
      { label: "recently emerged",              sublabel: "less than a year old",                        points: 0 },
      { label: "years but partially solved",    sublabel: "workarounds exist but they're painful",       points: 1 },
      { label: "long-standing and unsolved",    sublabel: "people have tolerated this for a long time",  points: 2 },
    ],
    recommendationByOption: [
      "Newly emerging problems are risky — the pain may not be real yet. Validate whether it's actually a problem or just early noise.",
      "A partially-solved problem is a real opportunity. Map exactly where the existing solutions fall short — that's your wedge.",
      null,
    ],
  },
  {
    id: 5,
    text: "is this problem a 'nice to have' or a 'must solve'?",
    pillarIndex: 0,
    options: [
      { label: "nice to have",           sublabel: "they'd use it if it were free",            points: 0 },
      { label: "somewhere in between",   sublabel: "they want it but are managing without",    points: 1 },
      { label: "must solve",             sublabel: "things break or money is lost without it", points: 2 },
    ],
    recommendationByOption: [
      "Nice-to-haves don't build companies. Find the version of this problem that someone would pay for today, even a small amount.",
      "Validate whether 'somewhere in between' crosses the willingness-to-pay line. Ask 5 users: 'Would you pay ₹X/month for this right now?'",
      null,
    ],
  },
  {
    id: 6,
    text: "have you personally experienced the problem you're solving?",
    pillarIndex: 0,
    options: [
      { label: "no",                   sublabel: "i spotted it from the outside",            points: 0 },
      { label: "adjacent experience",  sublabel: "worked in a related area",                 points: 1 },
      { label: "lived it directly",    sublabel: "i had this exact problem and couldn't find a solution", points: 2 },
    ],
    recommendationByOption: [
      "Outsider founders face a steep empathy gap. Spend 60 days embedded with your target user — shadow them, not just survey them.",
      "Adjacent experience helps. Find 3–5 users who lived the exact problem and make them your design partners.",
      null,
    ],
  },

  // ─── Segment 1: Market Opportunity ────────────────────────────────────────
  {
    id: 7,
    text: "what is your total addressable market (TAM)?",
    pillarIndex: 1,
    options: [
      { label: "under $100M",   sublabel: "niche or unclear",             points: 0 },
      { label: "$100M – $1B",   sublabel: "focused but sizeable",         points: 1 },
      { label: "over $1B",      sublabel: "large and well-documented",    points: 2 },
    ],
    recommendationByOption: [
      "A sub-$100M TAM makes venture funding nearly impossible. Validate whether your category is part of a larger market.",
      "Map adjacent markets and document your path to a $1B+ opportunity — investors think in multiples.",
      null,
    ],
  },
  {
    id: 8,
    text: "is your target market growing?",
    pillarIndex: 1,
    options: [
      { label: "shrinking or flat",  sublabel: "declining category",          points: 0 },
      { label: "stable growth",      sublabel: "growing but slowly",          points: 1 },
      { label: "fast-growing",       sublabel: "strong tailwind or new wave", points: 2 },
    ],
    recommendationByOption: [
      "Shrinking markets are existential for startups. Identify the tailwind or consider whether you're solving for a legacy context.",
      "Document the growth drivers — regulation, behaviour change, technology shift. Investors need to feel the momentum.",
      null,
    ],
  },
  {
    id: 9,
    text: "how well-defined is your target customer segment?",
    pillarIndex: 1,
    options: [
      { label: "broad or unclear",           sublabel: "targeting everyone",                     points: 0 },
      { label: "defined but large",          sublabel: "a clear category but still very wide",   points: 1 },
      { label: "narrow, specific, reachable", sublabel: "a specific persona with known channels", points: 2 },
    ],
    recommendationByOption: [
      "Targeting everyone means converting no one. Pick one persona, one job title, one industry — dominate that before expanding.",
      "Narrow your ICP further. Who feels the pain most acutely? Start there and expand outward once you have density.",
      null,
    ],
  },
  {
    id: 10,
    text: "how fragmented is the competitive landscape?",
    pillarIndex: 1,
    options: [
      { label: "dominated by 1–2 giants",    sublabel: "category is locked up",                 points: 0 },
      { label: "a few strong players",        sublabel: "competitive but with gaps",             points: 1 },
      { label: "highly fragmented",           sublabel: "many weak players or underserved niche", points: 2 },
    ],
    recommendationByOption: [
      "Entering a market owned by giants requires a strong wedge. Map which segment they serve poorly — that's your beachhead.",
      "In a competitive market, your differentiation must be crisp. Define the one dimension you win on and make it the whole story.",
      null,
    ],
  },
  {
    id: 11,
    text: "are there regulatory or macro tailwinds in your market?",
    pillarIndex: 1,
    options: [
      { label: "headwinds or unclear",  sublabel: "regulations work against you or unclear",    points: 0 },
      { label: "neutral",               sublabel: "no major regulatory factor",                 points: 1 },
      { label: "clear tailwinds",       sublabel: "regulation, behaviour shift, or tech wave driving demand", points: 2 },
    ],
    recommendationByOption: [
      "If regulation is a headwind, map your compliance path before scaling. Ignoring it is a landmine.",
      "Neutral is fine, but actively look for a macro trend you can attach to — it makes fundraising stories much stronger.",
      null,
    ],
  },
  {
    id: 12,
    text: "what is your realistic serviceable obtainable market (SOM) in 5 years?",
    pillarIndex: 1,
    options: [
      { label: "unclear",                 sublabel: "haven't modelled it",                    points: 0 },
      { label: "under 1% of TAM",         sublabel: "small share, path unclear",              points: 1 },
      { label: "1–5% of TAM",             sublabel: "modest share with a documented path",    points: 2 },
    ],
    recommendationByOption: [
      "SOM is how investors check whether your ambition is grounded. Build a bottom-up model: channels × conversion × ARPU.",
      "Under 1% SOM is fine early, but document the distribution math that gets you there.",
      null,
    ],
  },

  // ─── Segment 2: Solution & Product ────────────────────────────────────────
  {
    id: 13,
    text: "how unique is your solution vs. existing alternatives?",
    pillarIndex: 2,
    options: [
      { label: "very similar to existing",        sublabel: "copied or minor variation",                      points: 0 },
      { label: "incremental improvement",          sublabel: "better UX, price, or one key feature",          points: 1 },
      { label: "10x better or new category",       sublabel: "solves it in a fundamentally different way",    points: 2 },
    ],
    recommendationByOption: [
      "A copied solution needs 10x better execution. If you can't articulate what you do better specifically, pause and redesign.",
      "An incremental improvement needs a clear wedge. Define the one use case where you win before expanding.",
      null,
    ],
  },
  {
    id: 14,
    text: "does your product already exist in any form?",
    pillarIndex: 2,
    options: [
      { label: "idea only",                sublabel: "nothing built yet",                        points: 0 },
      { label: "prototype or MVP",         sublabel: "something exists but unpolished",          points: 1 },
      { label: "live product with usage",  sublabel: "real users are using it today",            points: 2 },
    ],
    recommendationByOption: [
      "An idea with no prototype means all assumptions are untested. Build the smallest testable version in 2 weeks.",
      "An MVP is a good start. Now get 10 people to use it without you explaining how — see where they drop off.",
      null,
    ],
  },
  {
    id: 15,
    text: "how quickly can you iterate on your product?",
    pillarIndex: 2,
    options: [
      { label: "slowly",       sublabel: "months per release cycle",         points: 0 },
      { label: "moderate",     sublabel: "changes take 2–4 weeks",           points: 1 },
      { label: "fast",         sublabel: "weekly iterations are possible",   points: 2 },
    ],
    recommendationByOption: [
      "Slow iteration is a competitive disadvantage early. Simplify the stack or scope — speed of learning beats breadth of features.",
      "Moderate pace is fine, but identify the one bottleneck slowing you down. Removing it could 2x your learning speed.",
      null,
    ],
  },
  {
    id: 16,
    text: "is your product designed for a specific use case?",
    pillarIndex: 2,
    options: [
      { label: "very broad or unclear",   sublabel: "trying to solve many things",                points: 0 },
      { label: "two or three use cases",  sublabel: "focused but still a few directions",         points: 1 },
      { label: "one clear use case",      sublabel: "built for one specific job-to-be-done",      points: 2 },
    ],
    recommendationByOption: [
      "Broad products are hard to market, sell, and improve. Pick the single job your product does best and cut everything else.",
      "Trim to one primary use case. Early traction comes from being the best at one thing, not decent at several.",
      null,
    ],
  },
  {
    id: 17,
    text: "have real users engaged with your product and given structured feedback?",
    pillarIndex: 2,
    options: [
      { label: "no",                       sublabel: "no user testing yet",                      points: 0 },
      { label: "informal chats",           sublabel: "casual conversations, no structure",       points: 1 },
      { label: "structured sessions",      sublabel: "usability tests or jobs-to-be-done interviews", points: 2 },
    ],
    recommendationByOption: [
      "No user testing means you're building on assumptions. Do 5 structured sessions this week — watch them use the product, don't explain.",
      "Informal feedback is biased. Run structured sessions: give a task, say nothing, observe. The silence is the data.",
      null,
    ],
  },
  {
    id: 18,
    text: "how well does the product solve the problem end-to-end today?",
    pillarIndex: 2,
    options: [
      { label: "barely",     sublabel: "solves a small part of it",           points: 0 },
      { label: "partially",  sublabel: "helps but leaves gaps",               points: 1 },
      { label: "fully",      sublabel: "solves it from start to finish",      points: 2 },
    ],
    recommendationByOption: [
      "Partial solutions lead to partial retention. Map the full job and identify the next piece you need to build.",
      "Close the gaps before expanding. A product that fully solves one problem retains users far better than one that partially solves many.",
      null,
    ],
  },

  // ─── Segment 3: Competitive Advantage ─────────────────────────────────────
  {
    id: 19,
    text: "do you have a defensible moat?",
    pillarIndex: 3,
    options: [
      { label: "no moat",          sublabel: "anyone could build this tomorrow",                      points: 0 },
      { label: "possible moat",    sublabel: "network effects, data, or switching cost — in theory",  points: 1 },
      { label: "clear moat",       sublabel: "demonstrably hard for competitors to replicate",        points: 2 },
    ],
    recommendationByOption: [
      "No moat means you'll be copied the moment you prove the market. Identify your path: data flywheel, network effects, or switching cost.",
      "A possible moat isn't enough. If a well-funded competitor launched today, what would slow them down?",
      null,
    ],
  },
  {
    id: 20,
    text: "what is your primary competitive advantage?",
    pillarIndex: 3,
    options: [
      { label: "price or features only",        sublabel: "cheaper or slightly better",              points: 0 },
      { label: "one structural advantage",       sublabel: "data, network, or integration depth",    points: 1 },
      { label: "multiple layered advantages",    sublabel: "data + network + switching cost",        points: 2 },
    ],
    recommendationByOption: [
      "Price and features are temporary. Define the structural advantage you'll build in the next 12 months.",
      "One strong advantage is a start. Plan the second — layered moats compound over time.",
      null,
    ],
  },
  {
    id: 21,
    text: "how long would it take a well-funded competitor to replicate you?",
    pillarIndex: 3,
    options: [
      { label: "under 3 months",          sublabel: "straightforward to copy",              points: 0 },
      { label: "6–12 months",             sublabel: "some complexity slows them down",      points: 1 },
      { label: "over a year",             sublabel: "structurally difficult to replicate",  points: 2 },
    ],
    recommendationByOption: [
      "If you can be copied in 3 months, your defensibility is zero. Build the thing that takes longer — proprietary data, network, or contracts.",
      "6–12 months buys time but not safety. Identify what makes you progressively harder to catch as you grow.",
      null,
    ],
  },
  {
    id: 22,
    text: "do you have proprietary data, technology, or exclusive relationships?",
    pillarIndex: 3,
    options: [
      { label: "none",           sublabel: "using the same tools and data as everyone",  points: 0 },
      { label: "one of these",   sublabel: "some proprietary element exists",            points: 1 },
      { label: "two or more",    sublabel: "stacked proprietary advantages",             points: 2 },
    ],
    recommendationByOption: [
      "Without any proprietary asset, you compete on execution alone — that's hard to sustain. Identify one asset you can own.",
      "Build on your one advantage. If it's data, collect more. If it's a relationship, deepen it or replicate it.",
      null,
    ],
  },
  {
    id: 23,
    text: "does your competitive advantage grow stronger as you scale?",
    pillarIndex: 3,
    options: [
      { label: "gets weaker",     sublabel: "margins compress or advantages erode at scale",  points: 0 },
      { label: "stays the same",  sublabel: "scale doesn't change the dynamic much",          points: 1 },
      { label: "gets stronger",   sublabel: "each new customer or data point widens the gap", points: 2 },
    ],
    recommendationByOption: [
      "A weakening advantage is a death spiral at scale. Redesign the model so that growth compounds the moat, not erodes it.",
      "Flat competitive advantages are fine but not exciting to investors. Think about what a 10x user base would change.",
      null,
    ],
  },

  // ─── Segment 4: Founder & Team ─────────────────────────────────────────────
  {
    id: 24,
    text: "what is your domain expertise in this market?",
    pillarIndex: 4,
    options: [
      { label: "entering fresh",         sublabel: "new to this space",                                     points: 0 },
      { label: "adjacent experience",    sublabel: "worked in a related area",                              points: 1 },
      { label: "deep domain expertise",  sublabel: "years in this domain or lived the problem personally",  points: 2 },
    ],
    recommendationByOption: [
      "No domain expertise increases execution risk dramatically. Either bring in a domain expert co-founder or spend 90 days in immersive research.",
      "Adjacent experience helps. Deepen it: spend 3 months in the industry or find an advisor who can stress-test your assumptions.",
      null,
    ],
  },
  {
    id: 25,
    text: "how complete is your founding team?",
    pillarIndex: 4,
    options: [
      { label: "solo, no plan",            sublabel: "building alone with no hiring roadmap",          points: 0 },
      { label: "solo, actively building",  sublabel: "alone but working on finding co-founder/team",   points: 1 },
      { label: "team in place",            sublabel: "co-founder or 2–3 key people already on board",  points: 2 },
    ],
    recommendationByOption: [
      "A solo founder without a team plan is a serious gap. Map the 3 key hires you need and start building relationships now.",
      "Actively looking is better than not. Set a deadline — if no co-founder in 60 days, hire a fractional lead for the critical gap.",
      null,
    ],
  },
  {
    id: 26,
    text: "have you or your co-founders built a product before?",
    pillarIndex: 4,
    options: [
      { label: "no",                          sublabel: "first time building",                             points: 0 },
      { label: "side project or internal tool", sublabel: "built something but not for paying users",     points: 1 },
      { label: "launched a paid product",     sublabel: "built and shipped something people paid for",    points: 2 },
    ],
    recommendationByOption: [
      "No prior build experience makes the first product hard. Partner with someone who has shipped before — even as an advisor.",
      "Internal tools count as experience. The gap is user empathy and distribution — invest time learning those two.",
      null,
    ],
  },
  {
    id: 27,
    text: "does the team have the technical capability to build the product?",
    pillarIndex: 4,
    options: [
      { label: "no, need to hire",  sublabel: "no tech on the team",           points: 0 },
      { label: "partially",         sublabel: "some tech but key gaps remain",  points: 1 },
      { label: "yes, in-house",     sublabel: "core tech capability on team",   points: 2 },
    ],
    recommendationByOption: [
      "No technical capability means relying entirely on contractors — expensive and slow. Find a technical co-founder before building anything substantial.",
      "Partial tech is manageable. Identify the single biggest technical risk and ensure someone owns it.",
      null,
    ],
  },
  {
    id: 28,
    text: "do you have relevant advisors or mentors?",
    pillarIndex: 4,
    options: [
      { label: "none",                  sublabel: "no formal advisors",                              points: 0 },
      { label: "one informal advisor",  sublabel: "someone i can call but no formal commitment",     points: 1 },
      { label: "active advisors",       sublabel: "committed advisors with equity or regular check-ins", points: 2 },
    ],
    recommendationByOption: [
      "No advisors means you're missing external pattern matching. Find one domain expert and one operator who has scaled a startup.",
      "An informal advisor is a start. Give them a small equity stake and a structured monthly commitment — convert them to engaged.",
      null,
    ],
  },
  {
    id: 29,
    text: "how committed is the team?",
    pillarIndex: 4,
    options: [
      { label: "part-time, other priorities",  sublabel: "everyone has a day job",                       points: 0 },
      { label: "part-time, transitioning",     sublabel: "planning to go full-time but haven't yet",     points: 1 },
      { label: "full-time, all-in",            sublabel: "the team is fully committed, no side bets",    points: 2 },
    ],
    recommendationByOption: [
      "Part-time founders move too slowly in competitive markets. Set a clear trigger: what milestone makes you go full-time?",
      "Transitioning is good progress. Set a hard date, not a soft intention — ambiguity kills momentum.",
      null,
    ],
  },

  // ─── Segment 5: Customer Validation ───────────────────────────────────────
  {
    id: 30,
    text: "how many discovery interviews have you done?",
    pillarIndex: 5,
    options: [
      { label: "zero",           sublabel: "haven't spoken to potential users yet",            points: 0 },
      { label: "fewer than 10",  sublabel: "some conversations but limited sample",            points: 1 },
      { label: "20 or more",     sublabel: "spoke to 20+ and iterated based on feedback",      points: 2 },
    ],
    recommendationByOption: [
      "Zero customer discovery is the highest-risk position. Schedule 15 conversations with your target persona this month.",
      "Under 10 is a sample size problem. You need 20+ before patterns emerge — the insights compound fast.",
      null,
    ],
  },
  {
    id: 31,
    text: "do you have paying customers or signed pilots?",
    pillarIndex: 5,
    options: [
      { label: "no",                  sublabel: "no customers or pilots yet",          points: 0 },
      { label: "pilot in progress",   sublabel: "someone is testing it, unpaid",      points: 1 },
      { label: "paying customers",    sublabel: "at least one person has paid",        points: 2 },
    ],
    recommendationByOption: [
      "No customers means no validation. Find one person willing to pay today — even ₹100. That conversation will reshape everything.",
      "A free pilot is learning but not proof. Convert it: ask what it would take for them to pay. Money is the honest signal.",
      null,
    ],
  },
  {
    id: 32,
    text: "how did you get your first users or customers?",
    pillarIndex: 5,
    options: [
      { label: "haven't yet",         sublabel: "no users at all",                   points: 0 },
      { label: "warm outreach",       sublabel: "friends, network, or cold messages", points: 1 },
      { label: "organic or inbound",  sublabel: "they found you, not the other way",  points: 2 },
    ],
    recommendationByOption: [
      "No users means no signal. Start with warm outreach — your network's network is 10 conversations away.",
      "Warm outreach is a valid start but doesn't scale. Identify what about your value prop made those people say yes and test it cold.",
      null,
    ],
  },
  {
    id: 33,
    text: "what does your early retention look like?",
    pillarIndex: 5,
    options: [
      { label: "no data",              sublabel: "haven't tracked it",                   points: 0 },
      { label: "users churn quickly",  sublabel: "most don't come back after first use", points: 1 },
      { label: "users return",         sublabel: "users come back, renew, or expand",    points: 2 },
    ],
    recommendationByOption: [
      "No retention data means you're flying blind. Set up one metric: are users back in week 2?",
      "High churn early is normal, but requires diagnosis. Exit-interview 5 churned users this week — the reason is usually fixable.",
      null,
    ],
  },
  {
    id: 34,
    text: "have you meaningfully changed direction based on user feedback?",
    pillarIndex: 5,
    options: [
      { label: "no feedback received",    sublabel: "no user input yet",                               points: 0 },
      { label: "received but unchanged",  sublabel: "heard feedback but didn't act on it",             points: 1 },
      { label: "pivoted based on it",     sublabel: "changed product, positioning, or ICP because of user input", points: 2 },
    ],
    recommendationByOption: [
      "No feedback means no iteration. Find 5 people, show them what you have, and ask: 'What would make this 10x more valuable?'",
      "Ignoring feedback is a red flag. If you heard it and didn't change, explain why — the reasoning matters more than the pivot.",
      null,
    ],
  },
  {
    id: 35,
    text: "do users recommend you to others?",
    pillarIndex: 5,
    options: [
      { label: "no data",       sublabel: "haven't tracked referrals",          points: 0 },
      { label: "occasionally",  sublabel: "a few referrals but not consistent", points: 1 },
      { label: "yes, referrals happening", sublabel: "users are actively spreading the word", points: 2 },
    ],
    recommendationByOption: [
      "Referrals are the earliest signal of product-market fit. Ask your current users: 'Would you recommend this? Why or why not?'",
      "Occasional referrals are encouraging. Find what triggered each one — make that moment repeatable and systematic.",
      null,
    ],
  },

  // ─── Segment 6: Business Model ─────────────────────────────────────────────
  {
    id: 36,
    text: "how clear is your revenue model?",
    pillarIndex: 6,
    options: [
      { label: "no idea yet",           sublabel: "haven't thought about how to charge",                   points: 0 },
      { label: "one option in mind",    sublabel: "have a rough idea but haven't tested it",               points: 1 },
      { label: "tested and validated",  sublabel: "customers have paid or confirmed willingness to pay",   points: 2 },
    ],
    recommendationByOption: [
      "No revenue model is a dealbreaker. Write down three ways you could monetise and pressure-test each against your target user.",
      "One untested revenue model is fragile. Run a pricing experiment this month — even a fake door test.",
      null,
    ],
  },
  {
    id: 37,
    text: "do you understand your unit economics (CAC, LTV)?",
    pillarIndex: 6,
    options: [
      { label: "never thought about it", sublabel: "don't know what LTV or CAC means",   points: 0 },
      { label: "rough estimates",         sublabel: "back-of-envelope numbers",           points: 1 },
      { label: "calculated clearly",      sublabel: "know my LTV, CAC, and payback period", points: 2 },
    ],
    recommendationByOption: [
      "Unit economics are the language of scale. Calculate your estimated CAC and LTV even if the numbers are rough.",
      "Rough estimates are a start. Now model it: what do unit economics look like at 1,000 customers?",
      null,
    ],
  },
  {
    id: 38,
    text: "what is your gross margin profile?",
    pillarIndex: 6,
    options: [
      { label: "under 30% or unknown",  sublabel: "thin margins or no visibility",     points: 0 },
      { label: "30–60%",                sublabel: "moderate, typical of marketplaces",  points: 1 },
      { label: "over 60%",              sublabel: "high margins, SaaS-like",            points: 2 },
    ],
    recommendationByOption: [
      "Low margins cap your ability to invest in growth. Either redesign the model or find the high-margin wedge within your business.",
      "30–60% is workable. Identify whether there's a software or data layer you can add to structurally improve margins.",
      null,
    ],
  },
  {
    id: 39,
    text: "how scalable is your pricing model?",
    pillarIndex: 6,
    options: [
      { label: "requires negotiation per deal",  sublabel: "custom pricing every time",          points: 0 },
      { label: "somewhat scalable",              sublabel: "a few tiers but still manual",       points: 1 },
      { label: "fully scalable",                 sublabel: "self-serve or clearly tiered pricing", points: 2 },
    ],
    recommendationByOption: [
      "Custom pricing per deal doesn't scale. Move toward packaged tiers — even 3 options is better than none.",
      "Semi-scalable is progress. Remove the last manual step — what would it take to go fully self-serve?",
      null,
    ],
  },
  {
    id: 40,
    text: "have you tested willingness to pay?",
    pillarIndex: 6,
    options: [
      { label: "no",               sublabel: "haven't asked anyone to pay",              points: 0 },
      { label: "informally",       sublabel: "asked in surveys or casual conversation",  points: 1 },
      { label: "yes, with money",  sublabel: "someone has actually paid",               points: 2 },
    ],
    recommendationByOption: [
      "Untested pricing means you're guessing. Ask 5 users: 'Would you pay ₹X/month?' — even a yes or no changes everything.",
      "Survey answers on price are unreliable. Real money is the only test. Charge for something, even a small beta access fee.",
      null,
    ],
  },
  {
    id: 41,
    text: "is your revenue recurring or transactional?",
    pillarIndex: 6,
    options: [
      { label: "transactional only",     sublabel: "one-time purchases",             points: 0 },
      { label: "mixed",                   sublabel: "some recurring, some one-time",  points: 1 },
      { label: "primarily recurring",     sublabel: "subscription or annual contract", points: 2 },
    ],
    recommendationByOption: [
      "Transactional models require constant re-acquisition. Identify the repeating use case in your product and build a subscription around it.",
      "Moving toward recurring is the right direction. Find the highest-retention cohort and convert them to a subscription first.",
      null,
    ],
  },

  // ─── Segment 7: Go-to-Market ───────────────────────────────────────────────
  {
    id: 42,
    text: "do you have a clear go-to-market strategy?",
    pillarIndex: 7,
    options: [
      { label: "no plan",                  sublabel: "will figure it out after building",          points: 0 },
      { label: "some ideas",               sublabel: "thinking about channels but not documented", points: 1 },
      { label: "documented strategy",      sublabel: "clear channel hypothesis with testable steps", points: 2 },
    ],
    recommendationByOption: [
      "No GTM plan is dangerous. Answer this: how does the first 100th customer find out about you? Work backwards from there.",
      "Ideas without a plan don't execute. Write down your primary channel, the message, and the conversion path. Test it this week.",
      null,
    ],
  },
  {
    id: 43,
    text: "what is your primary customer acquisition channel?",
    pillarIndex: 7,
    options: [
      { label: "undefined",             sublabel: "don't know yet",                      points: 0 },
      { label: "paid or outbound",      sublabel: "ads, cold email, or direct sales",    points: 1 },
      { label: "organic, PLG, or partner", sublabel: "content, referral, or integration-led", points: 2 },
    ],
    recommendationByOption: [
      "No defined channel means no repeatable growth. Pick one and go deep — breadth comes after proving one works.",
      "Paid and outbound work but don't compound. Plan the organic channel in parallel so your CAC drops over time.",
      null,
    ],
  },
  {
    id: 44,
    text: "do you have early distribution partners, integrations, or channels?",
    pillarIndex: 7,
    options: [
      { label: "none",               sublabel: "no distribution beyond direct outreach",     points: 0 },
      { label: "in conversation",    sublabel: "some discussions but nothing signed",        points: 1 },
      { label: "at least one live",  sublabel: "a partnership or integration that's active", points: 2 },
    ],
    recommendationByOption: [
      "No distribution leverage means you're competing on effort alone. Identify one partner whose audience trusts you — one relationship can unlock 100 customers.",
      "Conversations are good. Move at least one to a live test, even if small. Proof of distribution is worth more than promises.",
      null,
    ],
  },
  {
    id: 45,
    text: "what is your estimated CAC for your primary channel?",
    pillarIndex: 7,
    options: [
      { label: "no estimate",       sublabel: "haven't thought about acquisition cost",   points: 0 },
      { label: "rough guess",       sublabel: "intuition-based estimate",                 points: 1 },
      { label: "modelled with data", sublabel: "calculated from actual experiments",      points: 2 },
    ],
    recommendationByOption: [
      "Unknown CAC means you can't evaluate whether your model works. Run a $5,000 paid experiment and measure cost per lead and close rate.",
      "Intuition-based estimates are often off by 5x. Run a small real test to anchor your model.",
      null,
    ],
  },
  {
    id: 46,
    text: "do you have a content, community, or product-led growth engine?",
    pillarIndex: 7,
    options: [
      { label: "no",               sublabel: "no organic growth lever",           points: 0 },
      { label: "in early stages",  sublabel: "started but not driving users yet", points: 1 },
      { label: "active and growing", sublabel: "a real organic channel is working", points: 2 },
    ],
    recommendationByOption: [
      "Without an organic engine, all growth is paid. Pick one: content, community, or in-product virality. Start small but start now.",
      "Early stage is fine. Focus on one format and one platform — consistency beats volume in the early days.",
      null,
    ],
  },

  // ─── Segment 8: Execution & Scalability ───────────────────────────────────
  {
    id: 47,
    text: "how fast can your team ship and learn?",
    pillarIndex: 8,
    options: [
      { label: "slowly",      sublabel: "things take months to ship",         points: 0 },
      { label: "moderate",    sublabel: "2–4 week cycles",                    points: 1 },
      { label: "fast",        sublabel: "weekly releases or micro-experiments", points: 2 },
    ],
    recommendationByOption: [
      "Slow shipping is a strategic problem. Cut scope radically — what's the smallest change that would teach you the most?",
      "2–4 week cycles are workable. Identify the bottleneck: is it decisions, dependencies, or testing? Remove the single biggest blocker.",
      null,
    ],
  },
  {
    id: 48,
    text: "can your product scale without costs increasing linearly?",
    pillarIndex: 8,
    options: [
      { label: "no, very manual",   sublabel: "more users means proportionally more work",  points: 0 },
      { label: "somewhat",          sublabel: "some manual steps but mostly automated",     points: 1 },
      { label: "yes",               sublabel: "infrastructure scales independently of headcount", points: 2 },
    ],
    recommendationByOption: [
      "Manual scaling is a growth ceiling. Map every manual step and prioritise automating the one that limits throughput most.",
      "Partial automation is progress. Identify the most expensive manual step and eliminate it in the next sprint.",
      null,
    ],
  },
  {
    id: 49,
    text: "do you have a repeatable process for acquiring and onboarding customers?",
    pillarIndex: 8,
    options: [
      { label: "no process",            sublabel: "every customer is a one-off effort",             points: 0 },
      { label: "ad hoc",                sublabel: "some steps are consistent but not documented",   points: 1 },
      { label: "documented and repeatable", sublabel: "a clear playbook that anyone can follow",   points: 2 },
    ],
    recommendationByOption: [
      "No process means you can't delegate or improve. Document what you did for your last 3 customers — that's your v1 playbook.",
      "Ad hoc works for 10 customers, not 100. Write down the steps and hand them to someone who wasn't there — see if they can replicate it.",
      null,
    ],
  },
  {
    id: 50,
    text: "how aware are you of your biggest execution risk right now?",
    pillarIndex: 8,
    options: [
      { label: "not sure what it is",     sublabel: "unclear where things could break",           points: 0 },
      { label: "aware but not addressing", sublabel: "know the risk, not actively managing it",   points: 1 },
      { label: "identified and managing",  sublabel: "the risk is known and has a mitigation plan", points: 2 },
    ],
    recommendationByOption: [
      "Unknown risks are the most dangerous. Spend one hour doing a pre-mortem: what would cause this to fail in 6 months? Write it down.",
      "Knowing the risk but not managing it is worse than not knowing. Assign an owner and a deadline this week.",
      null,
    ],
  },
]

export function computePillarScores(answers: Answers): Record<number, { earned: number; max: number }> {
  return Object.fromEntries(
    PILLARS.map((pillar) => {
      const earned = pillar.questionIds.reduce((sum, qId) => {
        const optIdx = answers[qId]
        if (optIdx === undefined) return sum
        const q = QUESTIONS.find((q) => q.id === qId)!
        return sum + q.options[optIdx].points
      }, 0)
      return [pillar.index, { earned, max: pillar.maxPoints }]
    })
  )
}

export function computeTotal(answers: Answers): number {
  return QUESTIONS.reduce((sum, q) => {
    const optIdx = answers[q.id]
    return optIdx !== undefined ? sum + q.options[optIdx].points : sum
  }, 0)
}

export function getTopRecommendations(answers: Answers, max = 3): string[] {
  return QUESTIONS.flatMap((q) => {
    const optIdx = answers[q.id]
    if (optIdx === undefined) return []
    const rec = q.recommendationByOption[optIdx]
    if (!rec) return []
    const gap = q.options[2].points - q.options[optIdx].points
    return [{ rec, gap }]
  })
    .sort((a, b) => b.gap - a.gap)
    .slice(0, max)
    .map((x) => x.rec)
}

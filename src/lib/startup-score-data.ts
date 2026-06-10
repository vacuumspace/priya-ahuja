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

export type ScoreBand = {
  min: number
  max: number
  label: string
  sublabel: string
}

export type Answers = Record<number, OptionValue>

export const PILLARS: Pillar[] = [
  { index: 0, title: "problem & market",          maxPoints: 20, questionIds: [1, 2, 3] },
  { index: 1, title: "solution & differentiation", maxPoints: 20, questionIds: [4, 5] },
  { index: 2, title: "founder-market fit",         maxPoints: 20, questionIds: [6, 7] },
  { index: 3, title: "validation & traction",      maxPoints: 25, questionIds: [8, 9] },
  { index: 4, title: "business model",             maxPoints: 15, questionIds: [10, 11] },
]

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "how clearly can you define the problem you're solving?",
    pillarIndex: 0,
    options: [
      { label: "vague idea",                sublabel: "i know something is wrong but can't articulate it",         points: 0 },
      { label: "clear pain point",           sublabel: "i can describe who has it and what it costs them",          points: 4 },
      { label: "urgent pain with evidence",  sublabel: "data, interviews, or personal experience back it up",       points: 8 },
    ],
    recommendationByOption: [
      "Run 10 problem discovery interviews before writing code. Document who has the pain, what they currently do, and what it costs them.",
      "Sharpen your problem statement with user evidence — 5 recorded interviews beat 50 survey responses.",
      null,
    ],
  },
  {
    id: 2,
    text: "what is the size of your target market?",
    pillarIndex: 0,
    options: [
      { label: "under $100M",   sublabel: "niche or unclear",                  points: 0 },
      { label: "$100M – $1B",   sublabel: "focused but sizeable",              points: 3 },
      { label: "over $1B",      sublabel: "large and well-documented",         points: 7 },
    ],
    recommendationByOption: [
      "A sub-$100M market makes venture funding nearly impossible. Validate whether your category is actually part of a larger TAM.",
      "Map out adjacent markets and document your path to a $1B+ opportunity — investors think in multiples.",
      null,
    ],
  },
  {
    id: 3,
    text: "is the market you're entering growing?",
    pillarIndex: 0,
    options: [
      { label: "shrinking or flat",  sublabel: "declining category",           points: 0 },
      { label: "stable growth",      sublabel: "growing but slowly",           points: 2 },
      { label: "growing fast",       sublabel: "strong tailwind or new wave",  points: 5 },
    ],
    recommendationByOption: [
      "Shrinking markets are existential for startups. Identify the tailwind or consider whether you're solving for a legacy context.",
      "Document the growth drivers in your market — regulation, behaviour change, technology shift. Make investors feel the momentum.",
      null,
    ],
  },
  {
    id: 4,
    text: "how unique is your solution compared to what exists today?",
    pillarIndex: 1,
    options: [
      { label: "similar to existing",    sublabel: "copied or very close to a competitor",          points: 0 },
      { label: "incremental improvement", sublabel: "better UX, price, or one key feature",         points: 7 },
      { label: "10x better or new category", sublabel: "solves it in a fundamentally different way", points: 14 },
    ],
    recommendationByOption: [
      "A copied solution needs 10x better execution. If you can't articulate what you do better specifically, pause and redesign.",
      "An incremental improvement needs a clear wedge strategy. Define the one use case where you win before expanding.",
      null,
    ],
  },
  {
    id: 5,
    text: "do you have a defensible moat?",
    pillarIndex: 1,
    options: [
      { label: "no moat",          sublabel: "anyone could build this tomorrow",                    points: 0 },
      { label: "possible moat",    sublabel: "network effects, data, or switching cost — in theory", points: 3 },
      { label: "clear moat",       sublabel: "demonstrably hard for competitors to replicate",       points: 6 },
    ],
    recommendationByOption: [
      "No moat means you'll be copied the moment you prove the market. Identify your path: data flywheel, network effects, or switching cost.",
      "A possible moat isn't enough. If a well-funded competitor launched today, what would slow them down?",
      null,
    ],
  },
  {
    id: 6,
    text: "what is your domain expertise in this market?",
    pillarIndex: 2,
    options: [
      { label: "no expertise",     sublabel: "entering a space I'm new to",                              points: 0 },
      { label: "some experience",  sublabel: "worked in adjacent space or done research",               points: 6 },
      { label: "deep expertise",   sublabel: "years in this domain or lived the problem personally",    points: 12 },
    ],
    recommendationByOption: [
      "No domain expertise dramatically increases execution risk. Either hire a domain expert co-founder or spend 90 days in immersive research.",
      "Some experience helps. Deepen it: work in the industry for 3 months or find an advisor who can stress-test your assumptions.",
      null,
    ],
  },
  {
    id: 7,
    text: "how complete is your founding team?",
    pillarIndex: 2,
    options: [
      { label: "solo, no plan",       sublabel: "building alone with no hiring roadmap",         points: 0 },
      { label: "solo, actively hiring", sublabel: "alone but working on finding co-founder/team", points: 4 },
      { label: "small team in place", sublabel: "co-founder or 2–3 key people already on board", points: 8 },
    ],
    recommendationByOption: [
      "A solo founder without a team plan is a red flag for investors. Map the 3 key hires you need and start building relationships now.",
      "Actively hiring is better than solo, but set a deadline — if no co-founder in 60 days, consider a fractional hire for the critical gap.",
      null,
    ],
  },
  {
    id: 8,
    text: "how much customer discovery have you done?",
    pillarIndex: 3,
    options: [
      { label: "none",           sublabel: "haven't spoken to potential users yet",               points: 0 },
      { label: "a few",          sublabel: "spoke to fewer than 10 people",                       points: 5 },
      { label: "20+ interviews", sublabel: "spoke to 20+ and iterated based on feedback",         points: 10 },
    ],
    recommendationByOption: [
      "Zero customer discovery is the highest-risk position. Schedule 15 conversations with your target persona this month.",
      "Under 10 interviews is a sample size problem. You need 20+ before patterns emerge — the insights compound fast.",
      null,
    ],
  },
  {
    id: 9,
    text: "what is the current state of your startup?",
    pillarIndex: 3,
    options: [
      { label: "just an idea",       sublabel: "nothing built yet",                           points: 0 },
      { label: "MVP built",          sublabel: "product exists but no paying customers",      points: 5 },
      { label: "paying customers",   sublabel: "at least one person has paid for this",       points: 15 },
    ],
    recommendationByOption: [
      "An idea without an MVP means all assumptions are untested. Build the smallest possible thing that creates a testable moment.",
      "An MVP without paying customers means you haven't validated willingness to pay. Charge for the next pilot, even a token amount.",
      null,
    ],
  },
  {
    id: 10,
    text: "how clear is your revenue model?",
    pillarIndex: 4,
    options: [
      { label: "no idea yet",         sublabel: "haven't thought about how to charge",                    points: 0 },
      { label: "one option in mind",  sublabel: "have a rough idea but haven't tested it",                points: 5 },
      { label: "tested and validated", sublabel: "customers have paid or confirmed willingness to pay",   points: 10 },
    ],
    recommendationByOption: [
      "No revenue model is a dealbreaker for investors. Write down three ways you could monetise and pressure-test each against your target customer.",
      "One revenue model is fragile. Test two simultaneously in your MVP — price sensitivity data is extremely valuable early.",
      null,
    ],
  },
  {
    id: 11,
    text: "how well do you understand your unit economics?",
    pillarIndex: 4,
    options: [
      { label: "never thought about it", sublabel: "don't know what LTV or CAC means",               points: 0 },
      { label: "rough estimates",        sublabel: "have back-of-envelope numbers",                   points: 2 },
      { label: "calculated clearly",     sublabel: "know my LTV, CAC, payback period",                points: 5 },
    ],
    recommendationByOption: [
      "Unit economics are the language investors speak. Calculate your estimated CAC and LTV even if it's rough.",
      "Rough estimates are a good start. Now model it: what do unit economics look like at 1,000 customers?",
      null,
    ],
  },
]

export const SCORE_BANDS: ScoreBand[] = [
  { min: 0,  max: 40,  label: "idea stage",              sublabel: "needs validation before anything else" },
  { min: 41, max: 60,  label: "early promise",            sublabel: "build & test — don't over-plan" },
  { min: 61, max: 75,  label: "fundable in 6–12 months",  sublabel: "close the gaps, then raise" },
  { min: 76, max: 90,  label: "investor-ready",           sublabel: "polish the story and get in rooms" },
  { min: 91, max: 100, label: "strong conviction",        sublabel: "move fast — this is the moment" },
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

export function getScoreBand(total: number): ScoreBand {
  return SCORE_BANDS.find((b) => total >= b.min && total <= b.max) ?? SCORE_BANDS[0]
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

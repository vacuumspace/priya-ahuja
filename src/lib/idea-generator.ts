import { GoogleGenerativeAI } from "@google/generative-ai"
import { IDEA_GEN_QUESTIONS, type IdeaGenAnswers } from "@/lib/idea-generator-questions"

let client: GoogleGenerativeAI | null = null

function getGeminiClient(): GoogleGenerativeAI {
  if (!client) {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  }
  return client
}

const MODEL = "gemini-2.5-flash"

export type GtmPhase = {
  phase: string
  steps: string[]
}

export type GeneratedIdea = {
  title: string
  oneLiner: string
  whyThisFitsYou: string
  theProblem: string
  targetCustomer: string
  marketEvidence: string
  marketSize: string
  competitorLandscape: string
  keyCompetitors: string[]
  differentiation: string
  businessModel: string
  gtmPlan: GtmPhase[]
  capitalNeeded: string
  timeToFirstRevenue: string
  biggestRisk: string
  riskMitigation: string
  firstValidationStep: string
}

export type IdeaGenReportData = {
  summary: string
  ideas: GeneratedIdea[]
}

function answersToBrief(answers: IdeaGenAnswers): string {
  return IDEA_GEN_QUESTIONS
    .map((q) => {
      const val = answers[q.id]
      if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) return null
      const text = Array.isArray(val) ? val.join(", ") : val
      return `${q.prompt}\n${text}`
    })
    .filter(Boolean)
    .join("\n\n")
}

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback)
const strArr = (v: unknown, maxItems: number): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "").slice(0, maxItems) : []

function cleanJson(text: string): string {
  return text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
}

/** Stage 1: turn the raw intake answers into a founder profile - unfair
 * advantages, hard constraints, and what to avoid. No web research yet. */
async function buildFounderProfile(brief: string): Promise<string> {
  const genAI = getGeminiClient()
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { temperature: 0.5 },
  })

  const prompt = `You are a sharp startup advisor building an internal research brief on a founder, based on their intake answers below. Do not address the founder directly - this is an internal working note for the next research stage.

Write a dense analytical brief covering:
1. Their concrete unfair advantages - specific combinations of background, work history, licenses, network, assets, or personal pain points that give them an edge others in the same space wouldn't have. Be specific, not generic ("ex-pharma sales rep with hospital relationships in Tier-2 cities" not "sales experience").
2. Hard constraints that must gate any idea: capital ceiling, hours/week available, risk tolerance, savings runway, growth ambition (bootstrap vs venture-scale), timeline, industries to avoid.
3. Candidate problem spaces worth researching further - rooted in their actual pain points, interests, and experience, not generic categories.

Founder's intake:
${brief}

Write the brief now, plain text, no markdown headers needed, 300-500 words.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

/** Stage 2: grounded web research on trends/gaps in the candidate spaces. */
async function researchMarketDirections(profile: string): Promise<string> {
  const genAI = getGeminiClient()
  const model = genAI.getGenerativeModel({
    model: MODEL,
    tools: [{ googleSearch: {} }] as unknown as never,
  })

  const prompt = `You are a market researcher. Using web search, research current (2025-2026) market trends, underserved niches, and non-obvious gaps relevant to the founder profile below. Focus on the Indian market unless the profile suggests otherwise.

For each candidate problem space in the profile, search for and report:
- Recent market signals, regulatory or behavioral shifts, and what's changed recently that makes now a good time
- Any non-obvious adjacent niches a generic brainstorm would miss
- Real numbers where you can find them: market size, growth rate, number of potential customers, price points people currently pay for adjacent solutions
- Who the likely target customer is and where they currently go to solve this problem
- Any non-obvious adjacent niches a generic brainstorm would miss

Prioritize niche, specific opportunities over broad categories. Go deep on the 3-4 strongest directions rather than shallow on all of them.

Founder profile:
${profile}

Write your research notes as plain text, citing what you found (trends, numbers, sources where relevant), organized by candidate direction. This is a deep-research pass, not a summary - aim for 800-1200 words with real substance, not padding.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

/** Stage 3: grounded competitor/evidence research on the strongest directions. */
async function researchCompetitionAndEvidence(profile: string, marketNotes: string): Promise<string> {
  const genAI = getGeminiClient()
  const model = genAI.getGenerativeModel({
    model: MODEL,
    tools: [{ googleSearch: {} }] as unknown as never,
  })

  const prompt = `You are a competitive analyst. Based on the founder profile and market research notes below, pick the 5-8 most promising, niche, non-obvious directions and research via web search:
- Name actual companies/products operating in or near that space (or the closest adjacent category if it's truly greenfield) - real names, not "several players exist"
- How saturated it is, typical pricing/business model they use
- The specific gap or weakness in what exists today that a new entrant could exploit
- What it would take to differentiate - the wedge, not just "do it better"

Reject any direction that's already crowded with well-funded players and no clear wedge. Prefer directions where this specific founder's background creates a real edge over generic competitors.

Founder profile:
${profile}

Market research notes:
${marketNotes}

Write your findings as plain text: for each direction, name the real competitors you found, the gap, and whether it survives as a strong candidate. This is a deep-research pass - aim for 800-1200 words with real substance, not padding.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

/** Stage 4: final synthesis into exactly 5 ranked-equal, evidence-backed ideas. */
async function synthesizeIdeas(profile: string, marketNotes: string, competitionNotes: string): Promise<IdeaGenReportData> {
  const genAI = getGeminiClient()
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: "application/json", temperature: 0.7, maxOutputTokens: 16384 },
  })

  const prompt = `You are a startup idea strategist producing a final personalised report. You have an internal founder profile and research notes from earlier stages. Produce exactly 5 startup ideas.

Hard rules:
1. NEVER reference the intake questions or their categories directly (no "based on your family background", "given your stated risk appetite", etc). The ideas must read as pure insight the founder could not have gotten from a generic brainstorm - never expose the underlying questionnaire.
2. Every idea must be NICHE - a specific underserved segment, not a broad category. Avoid the obvious, top-of-Google idea for this founder's space.
3. Every idea must use a real, specific unfair advantage this founder has (from the profile) - reject any idea a random stranger googling the space could execute just as well.
4. Every idea must be backed by something concrete from the research notes (a trend, a competitor gap, evidence) - never invent market claims not grounded in the notes.
5. All 5 ideas are equal, independent options - do not rank them as primary/secondary or best/backup. Order them by variety of angle, not by preference.
6. Respect the founder's hard constraints (capital, hours/week, risk appetite, growth ambition, timeline, industries to avoid) from the profile - every idea must actually be executable given these.
7. Writing style: plain, direct, no em dashes, no fluff, no generic startup-advice platitudes.

Founder profile:
${profile}

Market research notes:
${marketNotes}

Competition & evidence notes:
${competitionNotes}

8. This is a paid, deep-research report - each idea needs real depth, not a one-line pitch. Use the specific numbers, names, and evidence from the research notes wherever you have them; don't pad with generic filler to hit length, but don't be thin either.

Respond with ONLY this JSON structure, no markdown fences:
{
  "summary": "<3-4 sentences: an overview of this founder's overall opportunity space and the common thread across the 5 ideas, written as insight, never referencing 'your answers' or specific input categories>",
  "ideas": [
    {
      "title": "<short, specific, memorable name for the idea>",
      "oneLiner": "<one sentence: what it is>",
      "whyThisFitsYou": "<4-6 sentences: the specific, multi-part unfair advantage this founder has for this idea - combine at least two distinct things from their background - stated as insight, never as a callback to a question>",
      "theProblem": "<4-5 sentences: the specific, niche problem, who feels it, how often, and what it currently costs them in time or money>",
      "targetCustomer": "<3-4 sentences: a specific, concrete customer persona - not a demographic bracket, an actual description of who buys first and why>",
      "marketEvidence": "<4-6 sentences: the concrete evidence/trend/gap from research backing this - cite real numbers, what changed, and why now, using specifics from the research notes>",
      "marketSize": "<2-3 sentences: a realistic, grounded estimate of the addressable opportunity - number of potential customers or revenue ceiling, not an inflated TAM slide number>",
      "competitorLandscape": "<3-4 sentences: name the real competitors/adjacent players from the research notes and how they fall short>",
      "keyCompetitors": ["<2-4 short entries, each 'name - one line on their gap'>"],
      "differentiation": "<2-3 sentences: the specific wedge/differentiation, grounded in the founder's advantage, not a generic claim>",
      "businessModel": "<2-3 sentences: how this actually makes money - pricing model, unit economics logic>",
      "gtmPlan": [
        {"phase": "days 1-30", "steps": ["<2-4 concrete steps>"]},
        {"phase": "days 31-60", "steps": ["<2-4 concrete steps>"]},
        {"phase": "days 61-90", "steps": ["<2-4 concrete steps>"]}
      ],
      "capitalNeeded": "<realistic capital range for this idea, in ₹, with a one-phrase breakdown of where it goes>",
      "timeToFirstRevenue": "<realistic estimate with a one-phrase reason>",
      "biggestRisk": "<2-3 sentences: the single biggest reason this fails, stated concretely>",
      "riskMitigation": "<2-3 sentences: the specific way to reduce or route around that risk>",
      "firstValidationStep": "<2-3 sentences: the cheapest, fastest way to test this before spending real money, specific enough to do this week>"
    }
    // exactly 5 of these
  ]
}`

  const result = await model.generateContent(prompt)
  const parsed = JSON.parse(cleanJson(result.response.text()))

  const ideas: GeneratedIdea[] = (Array.isArray(parsed?.ideas) ? parsed.ideas : [])
    .slice(0, 5)
    .map((idea: unknown): GeneratedIdea => {
      const i = idea as Record<string, unknown>
      const gtmPlanRaw: unknown[] = Array.isArray(i?.gtmPlan) ? (i.gtmPlan as unknown[]) : []
      const gtmPlan: GtmPhase[] = gtmPlanRaw.slice(0, 4).map((p): GtmPhase => {
        const phase = p as Record<string, unknown>
        return { phase: str(phase?.phase, "next steps"), steps: strArr(phase?.steps, 5) }
      })
      return {
        title: str(i?.title, "untitled idea"),
        oneLiner: str(i?.oneLiner),
        whyThisFitsYou: str(i?.whyThisFitsYou),
        theProblem: str(i?.theProblem),
        targetCustomer: str(i?.targetCustomer),
        marketEvidence: str(i?.marketEvidence),
        marketSize: str(i?.marketSize),
        competitorLandscape: str(i?.competitorLandscape),
        keyCompetitors: strArr(i?.keyCompetitors, 4),
        differentiation: str(i?.differentiation),
        businessModel: str(i?.businessModel),
        gtmPlan,
        capitalNeeded: str(i?.capitalNeeded),
        timeToFirstRevenue: str(i?.timeToFirstRevenue),
        biggestRisk: str(i?.biggestRisk),
        riskMitigation: str(i?.riskMitigation),
        firstValidationStep: str(i?.firstValidationStep),
      }
    })

  return {
    summary: str(parsed?.summary, "your personalised report is ready below."),
    ideas,
  }
}

/** Runs the full multi-stage deep-research pipeline and returns the final report. */
export async function generateIdeaGenReport(answers: IdeaGenAnswers): Promise<IdeaGenReportData> {
  const brief = answersToBrief(answers)
  const profile = await buildFounderProfile(brief)
  const marketNotes = await researchMarketDirections(profile)
  const competitionNotes = await researchCompetitionAndEvidence(profile, marketNotes)
  return synthesizeIdeas(profile, marketNotes, competitionNotes)
}

/** Random target duration for the progress-bar reveal, in minutes. Purely a
 * UI pacing device - decoupled from how long Gemini actually takes. */
export function randomRevealMinutes(): number {
  return 45 + Math.random() * 15
}

export const STAGE_LABELS = [
  "reading your profile...",
  "researching your industry...",
  "scanning market trends...",
  "mapping the competitor landscape...",
  "identifying your unfair advantages...",
  "cross-checking demand signals...",
  "stress-testing candidate ideas...",
  "finalizing your report...",
]

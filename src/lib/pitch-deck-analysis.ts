import { GoogleGenerativeAI } from "@google/generative-ai"
import { DECK_SECTIONS, type PitchDeckReport, type Improvement, type SectionReview, type StoryRewrite } from "@/lib/pitch-deck-report"

let client: GoogleGenerativeAI | null = null

function getGeminiClient(): GoogleGenerativeAI {
  if (!client) {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  }
  return client
}

const MODEL = "gemini-2.5-flash"

const ANALYSIS_PROMPT = `You are a pitch deck analyst combining two perspectives: a partner at an early-stage VC fund in India who has screened thousands of decks, and a pitch narrative coach who helps founders turn substance into a story investors fund. You are reviewing the attached startup pitch deck (PDF) on behalf of the founder who made it. Your job is to give them the unvarnished read an investor would never say out loud, plus the concrete fixes a coach would charge for.

FIRST, sanity-check the document. If the PDF is clearly NOT a startup pitch deck (e.g. a resume, invoice, report, book, random document), respond with exactly:
{"isPitchDeck": false, "reason": "<one sentence saying what the document appears to be instead>"}

Otherwise, analyse the deck and respond with:
{"isPitchDeck": true, "report": <report object matching the schema below>}

## How to analyse

1. Read the deck the way a VC does on first pass: under 3 minutes, skimming headlines, looking for a reason to say no. Then read it deeply.
2. Judge the STORY above all: is there a narrative arc (hook → problem tension → solution payoff → proof → why now → why this team → clear ask)? Founders fail on story more than substance.
3. Evaluate against the ${DECK_SECTIONS.length} sections listed in the schema. Some are literal slides (problem, team, the ask); others are investor questions the deck must answer somewhere, with or without a dedicated slide (niche & wedge, why now, unit economics, customer proof, moat & defensibility, founder-market fit, use of funds & milestones, vision & endgame). Mark one of these "present" if the deck answers the question anywhere - and judge how well. Mark it absent if the deck never answers it; that absence is itself a finding. Note the actual slide numbers you found each on.
4. Quote or closely paraphrase the deck's actual content in your feedback. Generic advice is worthless; the founder must feel you read THEIR deck.
5. Be honest and calibrated. Most decks score 45-65. Reserve 80+ for decks that would genuinely earn a meeting from a cold email. Do not inflate scores to be kind - a falsely high score costs the founder real meetings.
6. Context: assume Indian startup ecosystem unless the deck says otherwise (₹/crore/lakh amounts are normal; reference Indian funding norms - angels, micro-VCs, seed funds - where relevant). Mirror the deck's own currency in your feedback.
7. Everything you write must be actionable by editing the deck or the story. Do not tell them to "get more traction" as a deck fix - but DO flag when the underlying substance (not just the slide) is the real gap.
8. Writing style: plain, direct sentences. Never use em dashes (—) or en dashes (–) anywhere in your output - use a spaced hyphen ( - ) or restructure the sentence instead.

## Report schema

{
  "overallScore": <integer 0-100. Weighting guide: story/narrative 30%, section completeness & quality 40%, evidence/credibility 20%, design/clarity 10%>,
  "verdict": "<3-4 sentences. The honest summary of how this deck lands with an investor and the single biggest thing holding it back. Direct, specific to this deck, no hedging.>",
  "deckSnapshot": {
    "company": "<company name from the deck, or 'not clear from deck'>",
    "oneLiner": "<what this company does, as YOU understood it from the deck - if you struggled to work it out, say so, that itself is feedback>",
    "stage": "<stage + key metric as presented, e.g. 'pre-seed, pre-revenue' or 'seed, ₹40L ARR'>",
    "sector": "<sector/category>",
    "ask": "<what they're raising per the deck, or 'no ask found'>"
  },
  "dimensions": {
    "story": {"score": <0-10>, "assessment": "<2-3 sentences on the narrative arc: does it hook, build tension, resolve with proof? Where does the story sag?>"},
    "clarity": {"score": <0-10>, "assessment": "<2-3 sentences: one idea per slide? headlines that carry the takeaway? jargon? word-count offenders (name the slides)?>"},
    "evidence": {"score": <0-10>, "assessment": "<2-3 sentences: are claims backed by numbers/sources? is proof (traction, pilots, LOIs) positioned early enough? what's asserted but unproven?>"},
    "design": {"score": <0-10>, "assessment": "<2-3 sentences on visual readability, consistency, chart legibility. This is about communication, not aesthetics.>"}
  },
  "sections": [
    // EXACTLY these ${DECK_SECTIONS.length} sections, in this order: ${DECK_SECTIONS.map((s) => `"${s}"`).join(", ")}
    {
      "name": "<section name from the list>",
      "present": <true|false>,
      "slideRef": "<e.g. 'slide 3' or 'slides 7-8', or null if absent>",
      "score": <0-10; 0 if absent>,
      "feedback": "<2-3 sentences referencing the actual content: what works, what an investor stumbles on. For absent sections: what its absence signals to an investor.>",
      "fix": "<the single highest-leverage concrete fix for this section, or null if it's genuinely strong>"
    }
  ],
  "strengths": ["<3-5 specific things this deck genuinely does well - real strengths only, referencing actual content. These tell the founder what NOT to touch in the rewrite.>"],
  "improvements": [
    // 3-6 items, ordered most important first
    {
      "title": "<short imperative title>",
      "severity": "<critical | important | polish>",
      "why": "<1-2 sentences: what this costs them with investors>",
      "how": "<2-3 sentences: exactly how to fix it in the deck>"
    }
  ],
  "redFlags": ["<2-5 things a VC would silently reject on - unsourced TAM, missing competition, hockey-stick projections without assumptions, team gaps, inconsistent numbers between slides. Empty array only if genuinely none.>"],
  "investorQuestions": ["<3-5 sharp questions an investor WILL ask that this deck fails to answer. Phrase them as the investor would. These are the founder's prep list.>"],
  "rewrites": [
    // 2-4 of the weakest key statements in the deck, rewritten. Pick high-leverage ones: one-liner, problem headline, the ask.
    {
      "slide": "<which slide, e.g. 'slide 1 - one-liner'>",
      "current": "<the actual text from the deck, quoted or closely paraphrased>",
      "suggested": "<your investor-ready rewrite, using THEIR real numbers and facts from the deck - never invent metrics they didn't claim>",
      "why": "<1 sentence on why the rewrite works better>"
    }
  ],
  "actionPlan": ["<3-6 steps, highest-leverage first: the concrete order of operations to fix this deck this week. Imperative voice, specific to this deck.>"]
}

Respond with ONLY the JSON object. No markdown fences, no commentary.`

export type PitchDeckAnalysisResult =
  | { isPitchDeck: false; reason: string }
  | { isPitchDeck: true; report: PitchDeckReport }

const clamp = (n: unknown, min: number, max: number, fallback = 0): number => {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback
  return Math.max(min, Math.min(max, Math.round(v * 10) / 10))
}

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback)

const strArr = (v: unknown, maxItems: number): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "").slice(0, maxItems) : []

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeReport(raw: any): PitchDeckReport {
  const dim = (d: any) => ({
    score: clamp(d?.score, 0, 10),
    assessment: str(d?.assessment),
  })

  const sectionsRaw: any[] = Array.isArray(raw?.sections) ? raw.sections : []
  const sections: SectionReview[] = DECK_SECTIONS.map((name) => {
    const found = sectionsRaw.find((s) => str(s?.name).toLowerCase().trim() === name)
    return {
      name,
      present: Boolean(found?.present),
      slideRef: found?.slideRef ? str(found.slideRef) : null,
      score: clamp(found?.score, 0, 10),
      feedback: str(found?.feedback, "no assessment returned for this section."),
      fix: found?.fix ? str(found.fix) : null,
    }
  })

  const improvements: Improvement[] = (Array.isArray(raw?.improvements) ? raw.improvements : [])
    .slice(0, 6)
    .map((imp: any): Improvement => ({
      title: str(imp?.title, "improvement"),
      severity: (["critical", "important", "polish"].includes(imp?.severity) ? imp.severity : "important") as Improvement["severity"],
      why: str(imp?.why),
      how: str(imp?.how),
    }))

  const rewrites: StoryRewrite[] = (Array.isArray(raw?.rewrites) ? raw.rewrites : [])
    .slice(0, 4)
    .map((r: any): StoryRewrite => ({
      slide: str(r?.slide),
      current: str(r?.current),
      suggested: str(r?.suggested),
      why: str(r?.why),
    }))
    .filter((r: StoryRewrite) => r.current && r.suggested)

  return {
    overallScore: Math.round(clamp(raw?.overallScore, 0, 100)),
    verdict: str(raw?.verdict, "analysis completed - see the detailed breakdown below."),
    deckSnapshot: {
      company: str(raw?.deckSnapshot?.company, "not clear from deck"),
      oneLiner: str(raw?.deckSnapshot?.oneLiner, "not clear from deck"),
      stage: str(raw?.deckSnapshot?.stage, "not clear from deck"),
      sector: str(raw?.deckSnapshot?.sector, "not clear from deck"),
      ask: str(raw?.deckSnapshot?.ask, "no ask found"),
    },
    dimensions: {
      story: dim(raw?.dimensions?.story),
      clarity: dim(raw?.dimensions?.clarity),
      evidence: dim(raw?.dimensions?.evidence),
      design: dim(raw?.dimensions?.design),
    },
    sections,
    strengths: strArr(raw?.strengths, 5),
    improvements,
    redFlags: strArr(raw?.redFlags, 5),
    investorQuestions: strArr(raw?.investorQuestions, 5),
    rewrites,
    actionPlan: strArr(raw?.actionPlan, 6),
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function analyzePitchDeck(pdfBuffer: Buffer): Promise<PitchDeckAnalysisResult> {
  const genAI = getGeminiClient()
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  })

  const result = await model.generateContent([
    { inlineData: { mimeType: "application/pdf", data: pdfBuffer.toString("base64") } },
    { text: ANALYSIS_PROMPT },
  ])

  const text = result.response.text()
  // responseMimeType json should return bare JSON, but strip fences defensively
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
  const parsed = JSON.parse(cleaned)

  if (parsed?.isPitchDeck === false) {
    return { isPitchDeck: false, reason: str(parsed.reason, "the uploaded PDF does not appear to be a startup pitch deck.") }
  }

  return { isPitchDeck: true, report: normalizeReport(parsed?.report ?? parsed) }
}

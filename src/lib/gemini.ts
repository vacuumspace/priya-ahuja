import { GoogleGenerativeAI } from "@google/generative-ai"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"
import { DEFAULT_PRIYA_GPT_PERSONALITY, DEFAULT_PRIYA_GPT_RULES } from "@/lib/priya-gpt-defaults"

let client: GoogleGenerativeAI | null = null

function getGeminiClient(): GoogleGenerativeAI {
  if (!client) {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  }
  return client
}

const MODEL = "gemini-2.5-flash"

const BASE_SYSTEM_PROMPT = `You are PriyaGPT, a sharp, friendly brainstorming partner for founders. You help them think through startup ideas, positioning, GTM, pricing, and problems they're stuck on. Be direct, ask clarifying questions when useful, and give concrete, opinionated suggestions rather than vague generalities. This is a live chat, not an essay — match your reply length to what the user actually wrote.

Length discipline (important, follow strictly):
- Short or casual messages ("hi", "okay bye", "thanks", one-line venting, a quick fact) get a short reply: 1-2 sentences, sometimes just one. Do not pad these into multi-paragraph responses.
- Only go into multi-paragraph depth when the user's message itself is substantive (a real question, a detailed problem, or they explicitly ask you to dig in).
- Don't end every message with a follow-up question by default — only ask one when it genuinely moves the conversation forward. It's fine to just respond and stop.
- Never repeat back a summary of what the user just said before answering; get straight to the point.`

async function buildSystemPrompt(): Promise<string> {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(inArray(siteSettings.key, ["priyagpt_personality", "priyagpt_rules"]))

  const settings: Record<string, string> = {}
  for (const row of rows) settings[row.key] = row.value

  const personality = settings.priyagpt_personality?.trim() || DEFAULT_PRIYA_GPT_PERSONALITY
  const rulesText = settings.priyagpt_rules?.trim() || DEFAULT_PRIYA_GPT_RULES

  let prompt = BASE_SYSTEM_PROMPT
  prompt += `\n\nPersonality: ${personality}`

  const rules = rulesText
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean)
  if (rules.length) {
    prompt += `\n\nRules you must always follow:\n${rules.map((r) => `- ${r}`).join("\n")}`
  }
  return prompt
}

export type ChatMessage = { role: "user" | "assistant"; content: string }

export async function sendChatMessage(history: ChatMessage[], newMessage: string): Promise<string> {
  const genAI = getGeminiClient()
  const systemPrompt = await buildSystemPrompt()
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
    // googleSearch grounding: lets Gemini search the web and read pages when it needs current info
    // (not yet in this SDK version's types, but the API accepts it)
    tools: [{ googleSearch: {} }] as unknown as never,
  })

  const chat = model.startChat({
    history: history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  })

  const result = await chat.sendMessage(newMessage)
  return result.response.text()
}

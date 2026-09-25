/**
 * chatService.ts
 * ------------------------------------------------------------------
 * Powers the AgriSense chat assistant. This is a browser port of the
 * original AGRICON_TRIPLE_J.py terminal chatbot: same persona, same
 * preset commodity prices, same priority order for picking a backend.
 *
 *   1. Groq's free cloud API   — used if VITE_GROQ_API_KEY is set.
 *   2. Simple rule-based mode  — used otherwise, so the assistant still
 *      works out of the box in a demo with no API key configured.
 *
 * SECURITY NOTE
 * Calling Groq directly from the browser means the API key ships in
 * every request the browser makes and is visible in devtools. That's
 * fine for a local prototype, but before deploying this publicly you
 * should move this call behind a small backend/proxy that holds the
 * key server-side instead of shipping it in VITE_GROQ_API_KEY.
 * ------------------------------------------------------------------
 */

import { BASE_PRICES } from '../data/mockData'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const BOT_NAME = 'AgriSense AI'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? ''
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL ?? 'openai/gpt-oss-20b'

const MODE: 'groq' | 'rules' = GROQ_API_KEY ? 'groq' : 'rules'

// Preset prices come straight from the same mock data the prediction
// pages use, so the assistant and the rest of the app never disagree.
const PRESET_PRICES = Object.fromEntries(
  Object.entries(BASE_PRICES).filter(([crop]) => crop !== 'Other')
)

const priceListText = Object.entries(PRESET_PRICES)
  .map(([crop, price]) => `- ${crop}: PHP ${price}/kg`)
  .join('\n')

const SYSTEM_PROMPT = `AgriSense Intelligence Agent
You are ${BOT_NAME}, an expert agricultural economist and market advisor for the AgriSense platform. You help Filipino farmers, traders, and agri-logistics managers understand crop pricing, profitability, and location-based market decisions.
---
1. CORE OPERATIONAL MANDATE
Evaluate agricultural questions not just by gross market price, but through net profitability where relevant:
Net Profit (P) = (Usable weight * Market price) - (Production + Logistics + Storage + Spoilage + Platform costs)
Usable weight after transit/holding losses = Total weight * (1 - Spoilage rate).
---
2. RESPONSE STYLE
Keep answers concise and practical for a chat widget — a few short paragraphs or a small list, not a long report, unless the user asks for a detailed breakdown. Use plain language a farmer would understand. When math is involved, show the key numbers briefly rather than a long derivation.
---
3. PRESET COMMODITY PRICES (PHP per kg) — TREAT AS GROUND TRUTH
For the following crops, always use these exact preset prices as the current
market price unless the user explicitly gives you a different price to use:
${priceListText}

Rules for pricing:
- If asked the price of one of the crops above, state that exact preset price. Do not recalculate or estimate it.
- If asked about a real Philippine agricultural crop not in the list (e.g. "banana", "calamansi"), give a reasonable rough estimate in PHP/kg and clearly label it as an estimate.
- If asked about something that isn't an agricultural commodity at all, say it's outside AgriSense's scope.
- Never present a prediction or estimate as a guaranteed price — prices vary by location, quality, buyer, and market conditions.
`

// ---------------------------------------------------------------------------
// Rule-based fallback (used only when no Groq key is configured)
// ---------------------------------------------------------------------------
const PATTERNS: Array<[RegExp, string[]]> = [
  [/\b(hi|hello|hey|kumusta)\b/i, [
    "Hi! I'm AgriSense AI. Ask me about crop prices, or how to think about profit for a sale.",
  ]],
  [/\bhow are you\b/i, ["Running smoothly, thanks for asking! What crop or market can I help with?"]],
  [/\b(thanks|thank you|salamat)\b/i, ["You're welcome! Anything else about your crops or markets?"]],
  [/\bwhat('?s| is) your name\b/i, [`I'm ${BOT_NAME}, your agricultural market assistant.`]],
  [/\b(help|commands)\b/i, [
    'Try asking things like "what is the price of onion" or "should I sell tomato in Davao or Manila?"',
  ]],
]

const FALLBACKS = [
  "I don't have a full AI connection configured right now, so my answers are limited. Try asking about one of the listed crop prices, or set VITE_GROQ_API_KEY to unlock the full assistant.",
  "I can share preset crop prices in demo mode, but for deeper market analysis, connect a Groq API key.",
]

function findPresetPrice(text: string): { crop: string; price: number } | null {
  const lower = text.toLowerCase()
  for (const [crop, price] of Object.entries(PRESET_PRICES)) {
    if (lower.includes(crop.toLowerCase())) {
      return { crop, price: price as number }
    }
  }
  return null
}

function getRuleResponse(userInput: string): string {
  const priceMatch = findPresetPrice(userInput)
  if (priceMatch && /price|magkano|cost|worth/i.test(userInput)) {
    return `The current AgriSense reference price for ${priceMatch.crop} is PHP ${priceMatch.price}/kg. Actual prices can vary by market, quality, and buyer.`
  }

  for (const [pattern, replies] of PATTERNS) {
    if (pattern.test(userInput)) {
      return replies[Math.floor(Math.random() * replies.length)]
    }
  }

  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
}

// ---------------------------------------------------------------------------
// Groq backend
// ---------------------------------------------------------------------------
async function getGroqResponse(history: ChatMessage[]): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Groq API error ${res.status}: ${body}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response."
}

export async function sendChatMessage(history: ChatMessage[]): Promise<string> {
  if (MODE === 'groq') {
    return getGroqResponse(history)
  }
  const lastUserMessage = [...history].reverse().find((m) => m.role === 'user')
  await new Promise((resolve) => setTimeout(resolve, 400))
  return getRuleResponse(lastUserMessage?.content ?? '')
}

export function getChatMode(): 'groq' | 'rules' {
  return MODE
}

export function getChatModeLabel(): string {
  return MODE === 'groq' ? `AI mode — Groq (${GROQ_MODEL})` : 'Demo mode — rule-based replies'
}

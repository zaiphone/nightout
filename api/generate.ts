import { GoogleGenerativeAI } from '@google/generative-ai'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

function buildPrompt(form: any): string {
  return `You are a night-out planner. Given a group's details, return a JSON plan with 3 drinking game options and a post-game activity with real venue suggestions.

GROUP DETAILS:
- City: ${form.city}
- Group size: ${form.groupSize} people
- Vibe: ${form.vibe}
- Who's coming: ${form.whosComing}
- Budget per person: $${form.budget}
- Drinks: ${form.drinkType}
- Has cards: ${form.hasCards}
- Notes: ${form.notes || 'none'}

VENUE RULES:
- Suggest real venues that actually exist in ${form.city}. Do not make up names or addresses.
- For mapsUrl use: https://maps.google.com/?q=VENUE+NAME+${encodeURIComponent(form.city)} (replace spaces in the venue name with +)
- Match venues to the vibe and budget. "0-20" = cheap bars, no cover. "splurge" = upscale clubs or cocktail bars.
- Suggest 2 venues for the main activity and 1 for the backup.

GAME RULES:
- Return exactly 3 games. Each must be a DIFFERENT FORMAT — e.g. one card game, one verbal game, one phone or physical game. Never repeat the same format.
- If hasCards is "no" — do NOT suggest any card game across all 3 options.
- If drinkType is "sober" — replace every "drink" with "take a dare" or "do 10 pushups". Never mention alcohol.
- Each game needs exactly 5 rules. Each rule is one clear fun sentence.
- Games must suit ${form.groupSize} people.

Respond with ONLY valid JSON. No markdown. No backticks. No text before or after.

{
  "games": [
    {
      "name": "Game name",
      "tagline": "One fun sentence.",
      "rules": ["Rule 1.", "Rule 2.", "Rule 3.", "Rule 4.", "Rule 5."],
      "requiresCards": false,
      "requiresDice": false
    },
    {
      "name": "Different game name",
      "tagline": "One fun sentence.",
      "rules": ["Rule 1.", "Rule 2.", "Rule 3.", "Rule 4.", "Rule 5."],
      "requiresCards": false,
      "requiresDice": false
    },
    {
      "name": "Third different game name",
      "tagline": "One fun sentence.",
      "rules": ["Rule 1.", "Rule 2.", "Rule 3.", "Rule 4.", "Rule 5."],
      "requiresCards": false,
      "requiresDice": false
    }
  ],
  "activity": {
    "name": "Catchy name for the night plan",
    "description": "Two sentences selling the vibe.",
    "venues": [
      { "name": "Venue 1", "address": "Full address", "category": "Type", "mapsUrl": "https://maps.google.com/?q=..." },
      { "name": "Venue 2", "address": "Full address", "category": "Type", "mapsUrl": "https://maps.google.com/?q=..." }
    ]
  },
  "backup": {
    "name": "Backup venue name — one sentence on why it works as a fallback",
    "venues": [
      { "name": "Backup venue", "address": "Full address", "category": "Type", "mapsUrl": "https://maps.google.com/?q=..." }
    ]
  }
}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const form = req.body
  if (!form?.city?.trim() || !form?.vibe) {
    return res.status(400).json({ error: 'City and vibe are required.' })
  }

  try {
    const result  = await model.generateContent(buildPrompt(form))
    const raw     = result.response.text()
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const plan    = JSON.parse(cleaned)

    return res.status(200).json(plan)

  } catch (err: any) {
    console.error('Error:', err)
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'Unexpected AI response. Please try again.' })
    }
    return res.status(500).json({ error: 'Failed to generate plan. Please try again.' })
  }
}

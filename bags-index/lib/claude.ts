import Groq from 'groq-sdk'
import type { AIMessage } from '@/types'

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const SYSTEM_PROMPT = `You are an expert creator token analyst on the Bags platform (bags.fm) on Solana. You help users build optimal creator token index baskets for their investment goals. Bags is a platform where creators launch personal tokens and earn 1% fees on trades.

When suggesting an index, ALWAYS include a JSON block in your response formatted exactly like this:
<index_suggestion>
{
  "name": "Index Name",
  "category": "AI Creators",
  "tokens": [
    {"symbol": "TOKEN1", "weight": 40, "reason": "Why this token"},
    {"symbol": "TOKEN2", "weight": 35, "reason": "Why this token"},
    {"symbol": "TOKEN3", "weight": 25, "reason": "Why this token"}
  ],
  "rationale": "Overall strategy explanation"
}
</index_suggestion>

Be conversational, knowledgeable, and helpful. Keep messages concise. If the user hasn't specified their risk tolerance, ask before suggesting. Always explain your reasoning.

Available token categories on Bags: AI Creators, Dev Builders, Gaming, Art, Meme, Other.`

export async function getIndexAdvice(messages: AIMessage[]): Promise<{ text: string; suggestedIndex?: AIMessage['suggestedIndex'] }> {
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ],
  })

  const text = response.choices[0]?.message?.content ?? ''

  const match = text.match(/<index_suggestion>([\s\S]*?)<\/index_suggestion>/)
  let suggestedIndex: AIMessage['suggestedIndex'] | undefined
  if (match) {
    try {
      suggestedIndex = JSON.parse(match[1].trim())
    } catch {
      // ignore parse errors
    }
  }

  const cleanText = text.replace(/<index_suggestion>[\s\S]*?<\/index_suggestion>/g, '').trim()
  return { text: cleanText, suggestedIndex }
}

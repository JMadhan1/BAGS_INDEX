import { NextResponse } from 'next/server'
import { getIndexAdvice } from '@/lib/claude'
import type { AIMessage } from '@/types'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as { messages: AIMessage[] }
    if (!messages?.length) return NextResponse.json({ error: 'messages required' }, { status: 400 })

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key') {
      return NextResponse.json({
        message: "I'm the Bags Index AI Advisor! Add your GROQ_API_KEY to .env.local to enable full AI capabilities. Here's a sample suggestion in the meantime:\n\nBased on current trends, I'd recommend a balanced creator token basket with 40% AI creators, 35% dev builders, and 25% gaming tokens for solid diversification.",
        suggestedIndex: {
          name: 'Balanced Creator Index',
          category: 'AI Creators',
          tokens: [
            { symbol: 'SOL', weight: 40, reason: 'Strong AI creator presence on Bags' },
            { symbol: 'USDC', weight: 35, reason: 'Dev builder liquidity anchor' },
            { symbol: 'mSOL', weight: 25, reason: 'Gaming ecosystem exposure' },
          ],
          rationale: 'Diversified across top creator categories with SOL-heavy allocation for growth.',
        },
      })
    }

    const result = await getIndexAdvice(messages)
    return NextResponse.json({ message: result.text, suggestedIndex: result.suggestedIndex })
  } catch (e) {
    console.error('AI route error:', e)
    return NextResponse.json({ error: 'Failed to get AI advice' }, { status: 500 })
  }
}

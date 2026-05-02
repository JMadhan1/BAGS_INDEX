import { NextResponse } from 'next/server'
import { getIndexes, createIndex, getGlobalStats } from '@/lib/supabase'
import type { Index } from '@/types'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || undefined
  const sortBy = searchParams.get('sortBy') || 'volume'
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    const [indexes, stats] = await Promise.all([
      getIndexes({ category, sortBy, limit }),
      getGlobalStats(),
    ])
    return NextResponse.json({ indexes, total: indexes.length, stats })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch indexes' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, category, tokens, creator_wallet } = body

    if (!name || !category || !tokens || !creator_wallet) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!Array.isArray(tokens) || tokens.length < 2) {
      return NextResponse.json({ error: 'At least 2 tokens required' }, { status: 400 })
    }
    const totalWeight = tokens.reduce((s: number, t: { weight: number }) => s + t.weight, 0)
    if (Math.abs(totalWeight - 100) > 1) {
      return NextResponse.json({ error: 'Token weights must sum to 100' }, { status: 400 })
    }

    const index = await createIndex({ name, description, category, tokens, creator_wallet, fee_bps: 50 } as Partial<Index>)
    return NextResponse.json({ index }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create index' }, { status: 500 })
  }
}

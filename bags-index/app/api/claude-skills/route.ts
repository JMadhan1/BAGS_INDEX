import { NextResponse } from 'next/server'
import { getIndexes, getIndexById } from '@/lib/supabase'
import type { NextRequest } from 'next/server'

/**
 * Bags Index Claude Skills API
 * Implements MCP-compatible tool endpoints for Claude integration.
 * Track: Claude Skills — "portfolio management, trading insights, creator workflows"
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tool = searchParams.get('tool')

  switch (tool) {
    case 'list_indexes': {
      const category = searchParams.get('category') || undefined
      const sortBy = searchParams.get('sort') || 'volume'
      const indexes = await getIndexes({ category, sortBy, limit: 10 })
      return NextResponse.json({
        tool: 'list_indexes',
        result: indexes.map(i => ({
          id: i.id, name: i.name, category: i.category,
          performance_7d: i.performance_7d, total_volume_usd: i.total_volume_usd,
          total_fees_earned: i.total_fees_earned, holder_count: i.holder_count,
          token_count: i.tokens.length, curator: i.creator_wallet,
        })),
      })
    }

    case 'get_index': {
      const id = searchParams.get('id') || ''
      const index = await getIndexById(id)
      if (!index) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ tool: 'get_index', result: index })
    }

    case 'get_stats': {
      const indexes = await getIndexes({ limit: 100 })
      return NextResponse.json({
        tool: 'get_stats',
        result: {
          total_indexes: indexes.length,
          total_volume_usd: indexes.reduce((s, i) => s + Number(i.total_volume_usd), 0),
          total_fees_distributed: indexes.reduce((s, i) => s + Number(i.total_fees_earned), 0),
          total_holders: indexes.reduce((s, i) => s + Number(i.holder_count), 0),
          categories: Array.from(new Set(indexes.map(i => i.category))),
          top_index: indexes.sort((a, b) => b.performance_7d - a.performance_7d)[0]?.name,
        },
      })
    }

    case 'schema':
    default: {
      return NextResponse.json({
        name: 'Bags Index',
        description: 'Creator token index fund protocol on Solana. Curate baskets of creator tokens, earn 0.5% fees on every trade forever.',
        version: '1.0.0',
        tools: [
          {
            name: 'list_indexes',
            description: 'List all creator token index funds. Filter by category, sort by volume or performance.',
            parameters: {
              category: { type: 'string', description: 'Filter by: AI Creators, Dev Builders, Gaming, Art, Meme, Other', optional: true },
              sort: { type: 'string', description: 'Sort by: volume (default), newest, holders', optional: true },
            },
            endpoint: '/api/claude-skills?tool=list_indexes',
          },
          {
            name: 'get_index',
            description: 'Get full details of a specific index including token composition, fees earned, and holders.',
            parameters: { id: { type: 'string', description: 'The index UUID' } },
            endpoint: '/api/claude-skills?tool=get_index&id={id}',
          },
          {
            name: 'get_stats',
            description: 'Get global protocol statistics: total volume, fees distributed, active indexes.',
            parameters: {},
            endpoint: '/api/claude-skills?tool=get_stats',
          },
        ],
      })
    }
  }
}

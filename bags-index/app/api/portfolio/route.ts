import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { MOCK_INDEXES } from '@/lib/mockData'

const MOCK_HOLDINGS = (wallet: string) => [
  {
    id: '1', wallet, index_id: MOCK_INDEXES[0].id,
    amount_usd: 234, tokens_snapshot: MOCK_INDEXES[0].tokens, created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    index: MOCK_INDEXES[0],
    currentValue: 234 * (1 + MOCK_INDEXES[0].performance_7d / 100),
    pnl: 234 * (MOCK_INDEXES[0].performance_7d / 100),
    pnlPct: MOCK_INDEXES[0].performance_7d,
  },
  {
    id: '2', wallet, index_id: MOCK_INDEXES[3].id,
    amount_usd: 450, tokens_snapshot: MOCK_INDEXES[3].tokens, created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    index: MOCK_INDEXES[3],
    currentValue: 450 * (1 + MOCK_INDEXES[3].performance_7d / 100),
    pnl: 450 * (MOCK_INDEXES[3].performance_7d / 100),
    pnlPct: MOCK_INDEXES[3].performance_7d,
  },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get('wallet')
  if (!wallet) return NextResponse.json({ error: 'wallet required' }, { status: 400 })

  try {
    const { data: holdings, error } = await supabase
      .from('holdings')
      .select('*')
      .eq('wallet', wallet)
      .order('created_at', { ascending: false })

    if (error || !holdings || holdings.length === 0) {
      const mock = MOCK_HOLDINGS(wallet)
      const totalValue = mock.reduce((s, h) => s + h.currentValue, 0)
      const totalCost = mock.reduce((s, h) => s + h.amount_usd, 0)
      const totalPnl = totalValue - totalCost
      return NextResponse.json({ holdings: mock, totalValue, totalPnl, totalPnlPct: (totalPnl / totalCost) * 100 })
    }

    // Enrich with index data
    const { data: indexes } = await supabase
      .from('indexes')
      .select('*')
      .in('id', holdings.map(h => h.index_id))

    const indexMap = Object.fromEntries((indexes || []).map(i => [i.id, i]))

    const enriched = holdings.map(h => {
      const index = indexMap[h.index_id] || MOCK_INDEXES.find(m => m.id === h.index_id)
      const perf = index?.performance_7d ?? 0
      const currentValue = h.amount_usd * (1 + perf / 100)
      const pnl = currentValue - h.amount_usd
      return { ...h, index, currentValue, pnl, pnlPct: (pnl / h.amount_usd) * 100 }
    })

    const totalValue = enriched.reduce((s, h) => s + h.currentValue, 0)
    const totalCost = enriched.reduce((s, h) => s + h.amount_usd, 0)
    const totalPnl = totalValue - totalCost

    return NextResponse.json({ holdings: enriched, totalValue, totalPnl, totalPnlPct: totalCost > 0 ? (totalPnl / totalCost) * 100 : 0 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

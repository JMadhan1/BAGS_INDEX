import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { MOCK_INDEXES } from '@/lib/mockData'

export async function GET(_req: Request, { params }: { params: { wallet: string } }) {
  const { wallet } = params
  if (!wallet) return NextResponse.json({ error: 'wallet required' }, { status: 400 })

  try {
    const { data: indexes, error } = await supabase
      .from('indexes')
      .select('*')
      .eq('creator_wallet', wallet)
      .eq('is_active', true)
      .order('total_fees_earned', { ascending: false })

    const list = (error || !indexes || indexes.length === 0)
      ? MOCK_INDEXES.filter(i => i.creator_wallet === wallet)
      : indexes

    const totalVolume = list.reduce((s, i) => s + Number(i.total_volume_usd), 0)
    const totalFees = list.reduce((s, i) => s + Number(i.total_fees_earned), 0)
    const totalHolders = list.reduce((s, i) => s + Number(i.holder_count), 0)
    const avgPerf = list.length > 0 ? list.reduce((s, i) => s + Number(i.performance_7d), 0) / list.length : 0

    // Reputation score: based on volume, holders, performance
    const score = Math.min(100, Math.round(
      (totalVolume / 5000) * 30 +
      (totalHolders / 5) * 30 +
      (Math.max(0, avgPerf) * 2)
    ))

    return NextResponse.json({ wallet, indexes: list, totalVolume, totalFees, totalHolders, avgPerf, score })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

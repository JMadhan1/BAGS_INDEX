import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const MOCK_LEADERBOARD = [
  { wallet: 'Demo1111111111111111111111111111111111111', totalVolume: 128450, totalFees: 642.25, totalHolders: 89, indexCount: 1, topIndex: 'Top AI Builders' },
  { wallet: 'Demo4444444444444444444444444444444444444', totalVolume: 203100, totalFees: 1015.50, totalHolders: 142, indexCount: 1, topIndex: 'Meme Lords Index' },
  { wallet: 'Demo2222222222222222222222222222222222222', totalVolume: 87200, totalFees: 436.00, totalHolders: 54, indexCount: 1, topIndex: 'Rising Dev Builders' },
  { wallet: 'Demo5555555555555555555555555555555555555', totalVolume: 56800, totalFees: 284.00, totalHolders: 47, indexCount: 1, topIndex: 'Art & Music Creators' },
  { wallet: 'Demo3333333333333333333333333333333333333', totalVolume: 45600, totalFees: 228.00, totalHolders: 31, indexCount: 1, topIndex: 'Gaming Creator Fund' },
]

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('indexes')
      .select('creator_wallet, total_volume_usd, total_fees_earned, holder_count, name')
      .eq('is_active', true)
      .order('total_fees_earned', { ascending: false })

    if (error || !data) return NextResponse.json({ leaderboard: MOCK_LEADERBOARD })

    const walletMap = new Map<string, {
      wallet: string; totalVolume: number; totalFees: number
      totalHolders: number; indexCount: number; topIndex: string
    }>()

    for (const row of data) {
      const existing = walletMap.get(row.creator_wallet)
      if (existing) {
        existing.totalVolume += Number(row.total_volume_usd)
        existing.totalFees += Number(row.total_fees_earned)
        existing.totalHolders += Number(row.holder_count)
        existing.indexCount++
      } else {
        walletMap.set(row.creator_wallet, {
          wallet: row.creator_wallet,
          totalVolume: Number(row.total_volume_usd),
          totalFees: Number(row.total_fees_earned),
          totalHolders: Number(row.holder_count),
          indexCount: 1,
          topIndex: row.name,
        })
      }
    }

    const leaderboard = Array.from(walletMap.values())
      .sort((a, b) => b.totalFees - a.totalFees)
      .slice(0, 20)

    return NextResponse.json({ leaderboard: leaderboard.length > 0 ? leaderboard : MOCK_LEADERBOARD })
  } catch {
    return NextResponse.json({ leaderboard: MOCK_LEADERBOARD })
  }
}

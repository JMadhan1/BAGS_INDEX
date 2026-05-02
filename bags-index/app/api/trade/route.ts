import { NextResponse } from 'next/server'
import { recordTrade, supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { index_id, buyer_wallet, amount_usd, tx_signature, tokens_bought } = body

    if (!index_id || !buyer_wallet || !amount_usd || !tx_signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const fee_amount = amount_usd * 0.005
    const trade = await recordTrade({ index_id, buyer_wallet, amount_usd, fee_amount, tx_signature, tokens_bought })

    // Update index stats
    try {
      await supabase.rpc('increment_index_stats', {
        p_id: index_id,
        p_volume: amount_usd,
        p_fees: fee_amount,
      })
    } catch {
      // Fallback: fetch current and manually increment
      const { data: current } = await supabase.from('indexes').select('total_volume_usd, total_fees_earned, holder_count').eq('id', index_id).single()
      if (current) {
        await supabase.from('indexes').update({
          total_volume_usd: Number(current.total_volume_usd) + amount_usd,
          total_fees_earned: Number(current.total_fees_earned) + fee_amount,
          holder_count: Number(current.holder_count) + 1,
        }).eq('id', index_id)
      }
    }

    return NextResponse.json({ trade }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to record trade' }, { status: 500 })
  }
}

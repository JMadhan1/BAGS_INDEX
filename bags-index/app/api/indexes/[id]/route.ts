import { NextResponse } from 'next/server'
import { getIndexById, supabase } from '@/lib/supabase'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const index = await getIndexById(params.id)
    if (!index) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    let trades: unknown[] = []
    let holders: unknown[] = []
    try {
      const { data: t } = await supabase.from('trades').select('*').eq('index_id', params.id).order('created_at', { ascending: false }).limit(10)
      const { data: h } = await supabase.from('holdings').select('*').eq('index_id', params.id).order('amount_usd', { ascending: false }).limit(10)
      trades = t || []
      holders = h || []
    } catch { /* ignore if supabase not configured */ }

    return NextResponse.json({ index, trades, holders })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { is_active, name, description, creator_wallet } = body

    const existing = await getIndexById(params.id)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.creator_wallet !== creator_wallet) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('indexes')
      .update({ is_active, name, description })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ index: data })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

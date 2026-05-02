import { NextResponse } from 'next/server'
import { getCreatorStats } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get('wallet')
  if (!wallet) return NextResponse.json({ error: 'wallet param required' }, { status: 400 })

  try {
    const stats = await getCreatorStats(wallet)
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

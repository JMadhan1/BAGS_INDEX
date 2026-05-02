import { NextResponse } from 'next/server'
import { getTokenList } from '@/lib/bags'

export async function GET() {
  try {
    const tokens = await getTokenList()
    const trending = [...tokens]
      .sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0))
      .slice(0, 20)
    return NextResponse.json({ tokens: trending })
  } catch {
    return NextResponse.json({ tokens: [] })
  }
}

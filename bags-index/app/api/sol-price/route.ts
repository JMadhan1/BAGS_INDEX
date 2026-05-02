import { NextResponse } from 'next/server'

export const revalidate = 30

export async function GET() {
  try {
    const res = await fetch(
      'https://price.jup.ag/v6/price?ids=So11111111111111111111111111111111111111112',
      { next: { revalidate: 30 } }
    )
    if (res.ok) {
      const data = await res.json()
      const price = data.data?.['So11111111111111111111111111111111111111112']?.price
      if (price) return NextResponse.json({ price: Math.round(price * 100) / 100 })
    }
  } catch {}
  return NextResponse.json({ price: 180 })
}

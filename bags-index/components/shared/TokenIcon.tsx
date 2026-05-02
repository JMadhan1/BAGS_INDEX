'use client'

import { useState } from 'react'
import Image from 'next/image'

interface TokenIconProps {
  src: string
  symbol: string
  size?: number
}

const colors = ['#00FF87', '#00D4FF', '#FF6B6B', '#FFD93D', '#C77DFF', '#F72585']

function colorFromSymbol(symbol: string) {
  let hash = 0
  for (const c of symbol) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}

export default function TokenIcon({ src, symbol, size = 32 }: TokenIconProps) {
  const [error, setError] = useState(false)
  const bg = colorFromSymbol(symbol)

  if (!src || error) {
    return (
      <div
        style={{ width: size, height: size, background: bg, fontSize: size * 0.35 }}
        className="rounded-full flex items-center justify-center text-black font-bold font-mono shrink-0"
      >
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <div style={{ width: size, height: size }} className="rounded-full overflow-hidden shrink-0 bg-[#1A1A1A]">
      <Image
        src={src}
        alt={symbol}
        width={size}
        height={size}
        className="object-cover w-full h-full"
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  )
}

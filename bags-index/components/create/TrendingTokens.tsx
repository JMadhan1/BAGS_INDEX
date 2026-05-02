'use client'

import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, Flame } from 'lucide-react'
import TokenIcon from '@/components/shared/TokenIcon'
import type { BagsToken } from '@/types'

async function fetchTrending(): Promise<{ tokens: BagsToken[] }> {
  const res = await fetch('/api/tokens')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

interface Props {
  onSelect: (token: BagsToken) => void
  selectedMints: string[]
}

export default function TrendingTokens({ onSelect, selectedMints }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['trending-tokens'],
    queryFn: fetchTrending,
    staleTime: 60_000,
  })

  const tokens = data?.tokens ?? []

  return (
    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Flame size={14} className="text-orange-400" />
        <span className="text-xs font-medium text-[#888888]">Trending on Bags this week</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-[#1A1A1A] rounded-full animate-pulse" />
            ))
          : tokens.slice(0, 10).map(token => {
              const isSelected = selectedMints.includes(token.mint)
              const isPositive = token.change_24h >= 0
              return (
                <button
                  key={token.mint}
                  onClick={() => onSelect(token)}
                  disabled={isSelected}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-[#00FF87]/40 bg-[#00FF87]/10 text-[#00FF87] cursor-default'
                      : 'border-[#333333] text-[#888888] hover:border-[#00FF87]/40 hover:text-white bg-[#1A1A1A]'
                  }`}
                >
                  <TokenIcon src={token.icon_url} symbol={token.symbol} size={14} />
                  <span>{token.symbol}</span>
                  <span className={`font-mono ${isPositive ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
                    {isPositive ? '+' : ''}{token.change_24h.toFixed(1)}%
                  </span>
                  {isPositive ? <TrendingUp size={10} className="text-[#00FF87]" /> : <TrendingDown size={10} className="text-[#FF4444]" />}
                </button>
              )
            })}
      </div>
    </div>
  )
}

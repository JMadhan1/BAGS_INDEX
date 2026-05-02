'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, CheckCircle2, AlertCircle } from 'lucide-react'
import TokenIcon from '@/components/shared/TokenIcon'
import type { BagsToken, TokenInIndex } from '@/types'

async function fetchTokens(): Promise<BagsToken[]> {
  const { MOCK_TOKENS } = await import('@/lib/bags')
  return MOCK_TOKENS
}

interface TokenSelectorProps {
  selected: TokenInIndex[]
  onToggle: (token: TokenInIndex) => void
}

export default function TokenSelector({ selected, onToggle }: TokenSelectorProps) {
  const [search, setSearch] = useState('')
  const { data: tokens = [] } = useQuery({ queryKey: ['tokens'], queryFn: fetchTokens })

  const filtered = tokens.filter(t =>
    t.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const isSelected = (mint: string) => selected.some(t => t.mint === mint)
  const atLimit = selected.length >= 10

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tokens..."
            className="w-full bg-[#1A1A1A] border border-[#222222] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#888888] focus:outline-none focus:border-[#00FF87] transition-colors"
          />
        </div>
        <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
          {filtered.map(token => {
            const sel = isSelected(token.mint)
            const disabled = atLimit && !sel
            return (
              <button
                key={token.mint}
                onClick={() => !disabled && onToggle({ mint: token.mint, symbol: token.symbol, name: token.name, weight: 0, icon_url: token.icon_url })}
                disabled={disabled}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  sel ? 'bg-[#00FF87]/10 border border-[#00FF87]/30' :
                  disabled ? 'opacity-40 cursor-not-allowed border border-transparent' :
                  'hover:bg-[#1A1A1A] border border-transparent'
                }`}
              >
                <TokenIcon src={token.icon_url} symbol={token.symbol} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono font-bold text-sm text-white">{token.symbol}</div>
                  <div className="text-xs text-[#888888] truncate">{token.name}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-mono text-white">${token.price_usd < 0.01 ? token.price_usd.toFixed(6) : token.price_usd.toFixed(2)}</div>
                  <div className={`text-xs ${token.change_24h >= 0 ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
                    {token.change_24h >= 0 ? '+' : ''}{token.change_24h.toFixed(1)}%
                  </div>
                </div>
                {sel && <CheckCircle2 size={16} className="text-[#00FF87] shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="lg:w-56 shrink-0">
        <div className="bg-[#1A1A1A] border border-[#222222] rounded-xl p-4 sticky top-24">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">Your Basket</span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${atLimit ? 'bg-[#FF4444]/10 text-[#FF4444]' : 'bg-[#1A1A1A] text-[#888888] border border-[#222222]'}`}>
              {selected.length}/10
            </span>
          </div>
          {atLimit && (
            <div className="flex items-center gap-2 text-xs text-[#FF4444] mb-3">
              <AlertCircle size={12} /> Maximum tokens reached
            </div>
          )}
          {selected.length === 0 ? (
            <p className="text-xs text-[#888888]">Select at least 2 tokens</p>
          ) : (
            <div className="space-y-2">
              {selected.map(t => (
                <div key={t.mint} className="flex items-center gap-2">
                  <TokenIcon src={t.icon_url} symbol={t.symbol} size={20} />
                  <span className="text-sm font-mono text-white">{t.symbol}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

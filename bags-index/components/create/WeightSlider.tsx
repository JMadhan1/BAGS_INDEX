'use client'

import TokenIcon from '@/components/shared/TokenIcon'
import type { TokenInIndex } from '@/types'
import { AlertCircle } from 'lucide-react'

interface WeightSliderProps {
  tokens: TokenInIndex[]
  onUpdate: (mint: string, weight: number) => void
  onBalance: () => void
}

export default function WeightSlider({ tokens, onUpdate, onBalance }: WeightSliderProps) {
  const total = tokens.reduce((s, t) => s + t.weight, 0)
  const valid = Math.abs(total - 100) <= 1

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className={`text-sm font-mono font-bold ${valid ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
          Total: {total}%
          {!valid && (
            <span className="ml-2 text-xs font-normal flex items-center gap-1 inline-flex">
              <AlertCircle size={12} /> Must equal 100%
            </span>
          )}
        </div>
        <button
          onClick={onBalance}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#222222] text-[#888888] hover:border-[#00FF87] hover:text-[#00FF87] transition-colors"
        >
          Balance Equally
        </button>
      </div>

      <div className="space-y-5">
        {tokens.map(token => (
          <div key={token.mint}>
            <div className="flex items-center gap-3 mb-2">
              <TokenIcon src={token.icon_url} symbol={token.symbol} size={28} />
              <span className="font-mono text-sm font-bold text-white flex-1">{token.symbol}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={token.weight}
                  onChange={e => onUpdate(token.mint, Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  className="w-14 bg-[#1A1A1A] border border-[#222222] rounded-lg px-2 py-1 text-sm font-mono text-center text-white focus:outline-none focus:border-[#00FF87]"
                />
                <span className="text-[#888888] text-sm">%</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={token.weight}
              onChange={e => onUpdate(token.mint, parseInt(e.target.value))}
              className="w-full"
              style={{
                background: `linear-gradient(to right, #00FF87 ${token.weight}%, #222222 ${token.weight}%)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

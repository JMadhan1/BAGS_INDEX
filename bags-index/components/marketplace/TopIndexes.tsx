'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Zap, Award } from 'lucide-react'
import TokenIcon from '@/components/shared/TokenIcon'
import { formatUSD, getCategoryColor, truncateWallet } from '@/lib/utils'
import type { Index } from '@/types'

async function fetchTop(): Promise<{ indexes: Index[] }> {
  const res = await fetch('/api/indexes?sortBy=fees&limit=3')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

const MEDALS = ['🥇', '🥈', '🥉']
const GLOW_COLORS = ['rgba(255,215,0,0.08)', 'rgba(192,192,192,0.06)', 'rgba(205,127,50,0.06)']

export default function TopIndexes() {
  const { data, isLoading } = useQuery({
    queryKey: ['top-indexes'],
    queryFn: fetchTop,
    staleTime: 60_000,
  })

  const indexes = data?.indexes ?? []

  if (isLoading || indexes.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 pb-2">
      <div className="flex items-center gap-2 mb-4">
        <Award size={15} className="text-[#FFD700]" />
        <span className="font-mono font-bold text-sm text-white">Top Earning Curators</span>
        <span className="text-xs text-[#555555]">ranked by fees earned</span>
        <div className="flex items-center gap-1 ml-auto text-[10px] text-[#00FF87] font-mono">
          <span className="w-1.5 h-1.5 bg-[#00FF87] rounded-full animate-pulse inline-block" />
          LIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indexes.map((index, i) => {
          const isPositive = index.performance_7d >= 0
          return (
            <motion.div
              key={index.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, #111111, #0D0D0D)`,
                boxShadow: `0 0 0 1px ${i === 0 ? 'rgba(255,215,0,0.2)' : 'rgba(34,34,34,0.8)'}`,
              }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: GLOW_COLORS[i] }}
              />

              <div className="relative p-4">
                {/* Rank + performance */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl">{MEDALS[i]}</span>
                  <span className={`text-xs font-mono font-bold flex items-center gap-1 ${isPositive ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
                    {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {isPositive ? '+' : ''}{index.performance_7d.toFixed(1)}% 7d
                  </span>
                </div>

                {/* Token icons */}
                <div className="flex items-center gap-0.5 mb-3">
                  {index.tokens.slice(0, 4).map((t, ti) => (
                    <div key={t.mint} style={{ zIndex: 4 - ti, marginLeft: ti > 0 ? -8 : 0 }}>
                      <TokenIcon src={t.icon_url} symbol={t.symbol} size={26} />
                    </div>
                  ))}
                  {index.tokens.length > 4 && (
                    <span className="text-[10px] text-[#888888] ml-1.5">+{index.tokens.length - 4}</span>
                  )}
                  <div className="ml-auto flex items-center gap-1 text-[9px] bg-[#1A1A1A] border border-[#333333] px-1.5 py-0.5 rounded-full text-[#888888]">
                    <Zap size={8} className="text-[#00FF87]" />
                    {index.tokens.length} tokens
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-mono font-bold text-white text-sm leading-snug mb-0.5 line-clamp-1 group-hover:text-[#00FF87] transition-colors">
                  {index.name}
                </h3>
                <p className="text-[10px] text-[#555555] mb-3">by {truncateWallet(index.creator_wallet)}</p>

                {/* Category badge */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getCategoryColor(index.category)}`}>
                  {index.category}
                </span>

                {/* Stats */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1A1A1A]">
                  <div className="text-center">
                    <div className="text-[9px] text-[#555555] mb-0.5">Volume</div>
                    <div className="text-xs font-mono text-white">{formatUSD(index.total_volume_usd)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-[#00FF87]/70 mb-0.5">Fees Earned</div>
                    <div className="text-xs font-mono text-[#00FF87] font-bold">{formatUSD(index.total_fees_earned)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] text-[#555555] mb-0.5">Holders</div>
                    <div className="text-xs font-mono text-white">{index.holder_count}</div>
                  </div>
                </div>
              </div>

              <Link
                href={`/index/${index.id}`}
                className="block w-full text-center py-2.5 text-xs font-medium border-t transition-all"
                style={{
                  borderColor: i === 0 ? 'rgba(255,215,0,0.15)' : 'rgba(34,34,34,0.8)',
                  color: i === 0 ? '#FFD700' : '#888888',
                }}
              >
                View &amp; Buy →
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Users, BarChart2, Zap } from 'lucide-react'
import TokenIcon from '@/components/shared/TokenIcon'
import type { Index } from '@/types'
import { getCategoryColor, formatUSD, truncateWallet } from '@/lib/utils'

interface IndexCardProps {
  index: Index
  i: number
}

export default function IndexCard({ index, i }: IndexCardProps) {
  const isPositive = index.performance_7d >= 0
  const feePct = index.total_volume_usd > 0
    ? ((index.total_fees_earned / index.total_volume_usd) * 100).toFixed(2)
    : '0.50'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="group bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#00FF87]/50 hover:shadow-[0_0_20px_rgba(0,255,135,0.08)] transition-all duration-300 flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getCategoryColor(index.category)}`}>
          {index.category}
        </span>
        <span className={`text-sm font-mono font-bold flex items-center gap-1 ${isPositive ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? '+' : ''}{index.performance_7d.toFixed(1)}% 7d
        </span>
      </div>

      <div className="flex items-center gap-1 mb-3">
        {index.tokens.slice(0, 3).map((t, idx) => (
          <div key={t.mint} style={{ zIndex: 3 - idx, marginLeft: idx > 0 ? -8 : 0 }}>
            <TokenIcon src={t.icon_url} symbol={t.symbol} size={28} />
          </div>
        ))}
        {index.tokens.length > 3 && (
          <span className="text-xs text-[#888888] ml-2">+{index.tokens.length - 3} more</span>
        )}
        <div className="ml-auto flex items-center gap-1 text-[10px] bg-[#1A1A1A] border border-[#333333] px-2 py-0.5 rounded-full text-[#888888]">
          <Zap size={9} className="text-[#00FF87]" />
          {index.tokens.length} tokens
        </div>
      </div>

      <h3 className="font-mono font-bold text-white mb-0.5 group-hover:text-[#00FF87] transition-colors line-clamp-1">
        {index.name}
      </h3>
      <p className="text-xs text-[#888888] mb-3">
        by {truncateWallet(index.creator_wallet)}
      </p>

      {index.description && (
        <p className="text-xs text-[#666666] mb-3 line-clamp-2 leading-relaxed">{index.description}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3 mt-auto">
        <div className="bg-[#0D0D0D] rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-0.5 text-[#888888] mb-0.5">
            <BarChart2 size={9} />
          </div>
          <div className="text-xs font-mono text-white">{formatUSD(index.total_volume_usd)}</div>
          <div className="text-[9px] text-[#555555]">volume</div>
        </div>
        <div className="bg-[#0D0D0D] rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-0.5 text-[#888888] mb-0.5">
            <Users size={9} />
          </div>
          <div className="text-xs font-mono text-white">{index.holder_count}</div>
          <div className="text-[9px] text-[#555555]">holders</div>
        </div>
        <div className="bg-[#00FF87]/5 border border-[#00FF87]/10 rounded-lg p-2 text-center">
          <div className="text-[9px] text-[#00FF87] mb-0.5">fees</div>
          <div className="text-xs font-mono text-[#00FF87]">{formatUSD(index.total_fees_earned)}</div>
          <div className="text-[9px] text-[#555555]">{feePct}% rate</div>
        </div>
      </div>

      <Link
        href={`/index/${index.id}`}
        className="block w-full text-center py-2.5 rounded-lg border border-[#222222] text-sm font-medium text-[#888888] group-hover:border-[#00FF87] group-hover:text-[#00FF87] group-hover:bg-[#00FF87]/5 transition-all"
      >
        View &amp; Buy →
      </Link>
    </motion.div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'
import { TrendingUp, TrendingDown, Zap } from 'lucide-react'
import { PieChart, Pie, Cell } from 'recharts'
import TokenIcon from '@/components/shared/TokenIcon'
import { formatUSD, getCategoryBg, TOKEN_COLORS } from '@/lib/utils'
import type { Index } from '@/types'

async function fetchIndex(id: string) {
  const res = await fetch(`/api/indexes/${id}`)
  if (!res.ok) throw new Error('Not found')
  return res.json() as Promise<{ index: Index }>
}

function ShareCard() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['index-card', id],
    queryFn: () => fetchIndex(id),
  })

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00FF87] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return null
  const { index } = data
  const isPositive = index.performance_7d >= 0
  const catColor = getCategoryBg(index.category)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bags-index.vercel.app'

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      {/* Card — 1200×630 aspect, max 860px wide */}
      <div
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-[#222222]"
        style={{ aspectRatio: '1200/630', background: 'linear-gradient(135deg, #0D0D0D 0%, #111111 100%)' }}
      >
        {/* Glow accent */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: catColor }}
        />

        <div className="relative z-10 flex h-full p-8 gap-8">
          {/* Left: info */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full border" style={{ color: catColor, borderColor: `${catColor}40`, background: `${catColor}15` }}>
                  {index.category}
                </span>
                <span className={`text-sm font-mono font-bold flex items-center gap-1 ${isPositive ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
                  {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {isPositive ? '+' : ''}{index.performance_7d.toFixed(1)}% 7d
                </span>
              </div>

              <h1 className="font-mono font-bold text-white text-3xl leading-tight mb-3 line-clamp-2">
                {index.name}
              </h1>

              {index.description && (
                <p className="text-[#888888] text-sm leading-relaxed line-clamp-2 mb-5">{index.description}</p>
              )}

              {/* Token stack */}
              <div className="flex items-center gap-1 mb-6">
                {index.tokens.slice(0, 6).map((t, i) => (
                  <div key={t.mint} style={{ zIndex: 6 - i, marginLeft: i > 0 ? -10 : 0 }}>
                    <TokenIcon src={t.icon_url} symbol={t.symbol} size={36} />
                  </div>
                ))}
                {index.tokens.length > 6 && (
                  <span className="ml-2 text-xs text-[#888888] font-mono">+{index.tokens.length - 6} more</span>
                )}
                <span className="ml-3 text-xs text-[#555555]">{index.tokens.length} tokens</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Volume', value: formatUSD(index.total_volume_usd) },
                { label: 'Fees Earned', value: formatUSD(index.total_fees_earned) },
                { label: 'Holders', value: index.holder_count.toString() },
              ].map(s => (
                <div key={s.label} className="bg-[#1A1A1A] rounded-xl p-3 border border-[#222222]">
                  <div className="text-[10px] text-[#555555] mb-1 uppercase tracking-wide">{s.label}</div>
                  <div className="font-mono font-bold text-white text-sm">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1A1A1A]">
              <div className="flex items-center gap-1.5 text-[#00FF87]">
                <Zap size={13} />
                <span className="font-mono font-bold text-sm">bags-index.vercel.app</span>
              </div>
              <div className="text-xs text-[#555555] font-mono">Built on @bagsfm · Solana</div>
            </div>
          </div>

          {/* Right: pie chart */}
          <div className="shrink-0 flex flex-col items-center justify-center gap-4">
            <PieChart width={160} height={160}>
              <Pie
                data={index.tokens}
                dataKey="weight"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={72}
                isAnimationActive
                strokeWidth={0}
              >
                {index.tokens.map((_, i) => (
                  <Cell key={i} fill={TOKEN_COLORS[i % TOKEN_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>

            <div className="space-y-1.5 w-36">
              {index.tokens.slice(0, 5).map((t, i) => (
                <div key={t.mint} className="flex items-center gap-1.5 text-[11px]">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: TOKEN_COLORS[i % TOKEN_COLORS.length] }} />
                  <span className="font-mono text-[#888888] truncate">{t.symbol}</span>
                  <span className="ml-auto font-mono text-white">{t.weight}%</span>
                </div>
              ))}
              {index.tokens.length > 5 && (
                <div className="text-[10px] text-[#555555] pl-3.5">+{index.tokens.length - 5} more</div>
              )}
            </div>
          </div>
        </div>

        {/* Fee banner */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#00FF87]/5 border-t border-[#00FF87]/20 px-8 py-2 flex items-center justify-between">
          <span className="text-[11px] text-[#00FF87] font-mono">
            💰 0.5% curator fee on every trade • Earn forever
          </span>
          <a
            href={`${appUrl}/index/${id}`}
            className="text-[11px] text-[#00FF87]/70 font-mono hover:text-[#00FF87] transition-colors"
          >
            View & Buy →
          </a>
        </div>
      </div>

      {/* Action buttons below the card */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-3">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${index.name}" — a curated creator token index on @bagsfm! 📊\n\n${isPositive ? '🟢' : '🔴'} ${isPositive ? '+' : ''}${index.performance_7d.toFixed(1)}% this week\n💰 ${formatUSD(index.total_fees_earned)} in curator fees earned\n👥 ${index.holder_count} holders\n\n${appUrl}/index/${id}`)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-black border border-[#333333] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:border-white transition-colors"
        >
          Share on X
        </a>
        <a
          href={`/index/${id}`}
          className="flex items-center gap-2 bg-[#00FF87] text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#00FF87]/90 transition-all"
        >
          View Index →
        </a>
      </div>
    </div>
  )
}

export default function ShareCardPage() {
  return (
    <Suspense>
      <ShareCard />
    </Suspense>
  )
}

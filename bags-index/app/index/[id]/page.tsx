'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Suspense } from 'react'
import { Copy, Share2, Users, BarChart2, Calendar, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import BuyModal from '@/components/index/BuyModal'
import PerformanceChart from '@/components/index/PerformanceChart'
import HoldersList from '@/components/index/HoldersList'
import TokenIcon from '@/components/shared/TokenIcon'
import Skeleton from '@/components/shared/Skeleton'
import FeeFlowViz from '@/components/shared/FeeFlowViz'
import LiveActivityFeed from '@/components/shared/LiveActivityFeed'
import { getCategoryColor, formatUSD, truncateWallet, generateGradient, timeAgo, TOKEN_COLORS } from '@/lib/utils'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { Index, Holding } from '@/types'

async function fetchIndex(id: string) {
  const res = await fetch(`/api/indexes/${id}`)
  if (!res.ok) throw new Error('Not found')
  return res.json() as Promise<{ index: Index; trades: unknown[]; holders: Holding[] }>
}

function IndexContent() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'

  const { data, isLoading } = useQuery({
    queryKey: ['index', id],
    queryFn: () => fetchIndex(id),
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
        <div><Skeleton variant="card" /></div>
      </div>
    )
  }

  if (!data) {
    return <div className="text-center py-20 text-[#888888]">Index not found.</div>
  }

  const { index, holders = [] } = data
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bags-index.vercel.app'
  const shareUrl = `${appUrl}/index/${id}`
  const tweetText = `Check out "${index.name}" — a creator token index on @bagsfm! ${index.tokens.length} tokens, ${formatUSD(index.total_volume_usd)} volume. ${shareUrl}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 py-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getCategoryColor(index.category)}`}>
                {index.category}
              </span>
              <span className={`text-sm font-mono font-bold flex items-center gap-1 ${index.performance_7d >= 0 ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
                <TrendingUp size={13} />
                {index.performance_7d >= 0 ? '+' : ''}{index.performance_7d.toFixed(1)}% 7d
              </span>
            </div>
            <h1 className="font-mono text-2xl md:text-4xl font-bold text-white mb-2">{index.name}</h1>
            {index.description && <p className="text-[#888888] text-base mb-4">{index.description}</p>}

            <div className="flex items-center gap-3 mb-5">
              <a href={`/curator/${index.creator_wallet}`} className="flex items-center gap-3 group">
                <div
                  className="w-8 h-8 rounded-full shrink-0"
                  style={{ background: generateGradient(index.creator_wallet) }}
                />
                <span className="text-[#888888] text-sm">
                  by <span className="font-mono text-white group-hover:text-[#00FF87] transition-colors">{truncateWallet(index.creator_wallet)}</span>
                </span>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Volume', value: formatUSD(index.total_volume_usd), icon: <BarChart2 size={14} /> },
                { label: 'Fees Earned', value: formatUSD(index.total_fees_earned), icon: <TrendingUp size={14} /> },
                { label: 'Holders', value: index.holder_count.toString(), icon: <Users size={14} /> },
                { label: 'Created', value: timeAgo(index.created_at), icon: <Calendar size={14} /> },
              ].map((s, i) => (
                <div key={i} className="bg-[#111111] border border-[#222222] rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[#888888] text-xs mb-1">{s.icon}{s.label}</div>
                  <div className="font-mono font-bold text-white">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart */}
          <PerformanceChart performance7d={index.performance_7d} />

          {/* Composition */}
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
            <h2 className="font-mono font-bold text-white mb-4">Basket Composition</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="shrink-0">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={index.tokens} dataKey="weight" cx="50%" cy="50%" innerRadius={40} outerRadius={70} isAnimationActive>
                      {index.tokens.map((_, i) => <Cell key={i} fill={TOKEN_COLORS[i % TOKEN_COLORS.length]} strokeWidth={0} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111111', border: '1px solid #222222', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v}%`]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {index.tokens.map((t, i) => (
                  <div key={t.mint} className="flex items-center gap-3 py-1.5 border-b border-[#1A1A1A] last:border-0">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: TOKEN_COLORS[i % TOKEN_COLORS.length] }} />
                    <TokenIcon src={t.icon_url} symbol={t.symbol} size={24} />
                    <div className="flex-1 min-w-0">
                      <span className="font-mono font-bold text-sm text-white">{t.symbol}</span>
                      <span className="text-xs text-[#888888] ml-2 hidden md:inline">{t.name}</span>
                    </div>
                    <span className="font-mono text-sm text-white">{t.weight}%</span>
                    {t.current_price_usd && (
                      <span className="text-xs text-[#888888] hidden md:inline">
                        ${t.current_price_usd < 0.01 ? t.current_price_usd.toFixed(6) : t.current_price_usd.toFixed(2)}
                      </span>
                    )}
                    {t.change_24h !== undefined && (
                      <span className={`text-xs font-mono ${t.change_24h >= 0 ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
                        {t.change_24h >= 0 ? '+' : ''}{t.change_24h.toFixed(1)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Holders */}
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
            <h2 className="font-mono font-bold text-white mb-4">
              Top Holders <span className="text-[#888888] font-normal text-sm">({index.holder_count} total)</span>
            </h2>
            <HoldersList holders={holders} />
          </div>

          {/* Share Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A1A1F] border border-[#222222] text-sm text-white hover:border-[#00D4FF] transition-colors">
              <Share2 size={14} /> Share on Twitter
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success('Link copied!') }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#222222] text-sm text-[#888888] hover:text-white transition-colors"
            >
              <Copy size={14} /> Copy Link
            </button>
            <span className="text-sm text-[#888888]">{index.holder_count} people holding this index</span>
          </div>
        </div>

        {/* Right Column — Buy Panel + Fee Viz + Activity */}
        <div className="space-y-5">
          <BuyModal index={index} isDemo={isDemo} />
          <FeeFlowViz
            totalFees={index.total_fees_earned}
            totalVolume={index.total_volume_usd}
            creatorWallet={index.creator_wallet}
          />
          <LiveActivityFeed maxItems={5} />
        </div>
      </div>
    </motion.div>
  )
}

export default function IndexPage() {
  return <Suspense><IndexContent /></Suspense>
}

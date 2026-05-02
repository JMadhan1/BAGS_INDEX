'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Suspense } from 'react'
import { Trophy, TrendingUp, TrendingDown, Users, BarChart2, Layers, ExternalLink, Star } from 'lucide-react'
import IndexCard from '@/components/marketplace/IndexCard'
import Skeleton from '@/components/shared/Skeleton'
import { formatUSD, truncateWallet, generateGradient } from '@/lib/utils'
import type { Index } from '@/types'

interface CuratorData {
  wallet: string
  indexes: Index[]
  totalVolume: number
  totalFees: number
  totalHolders: number
  avgPerf: number
  score: number
}

async function fetchCurator(wallet: string): Promise<CuratorData> {
  const res = await fetch(`/api/curator/${wallet}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

function getBadge(score: number): { label: string; color: string } {
  if (score >= 80) return { label: '🏆 Elite Curator', color: 'text-[#FFD700]' }
  if (score >= 60) return { label: '⭐ Pro Curator', color: 'text-[#00FF87]' }
  if (score >= 40) return { label: '📈 Active Curator', color: 'text-[#00D4FF]' }
  return { label: '🌱 New Curator', color: 'text-[#888888]' }
}

function CuratorContent() {
  const { wallet } = useParams<{ wallet: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['curator', wallet],
    queryFn: () => fetchCurator(wallet),
  })

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <Skeleton variant="card" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="card" />)}
        </div>
      </div>
    )
  }

  if (!data) return <div className="text-center py-20 text-[#888888]">Curator not found.</div>

  const badge = getBadge(data.score)
  const isPositive = data.avgPerf >= 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div
              className="w-16 h-16 rounded-full shrink-0"
              style={{ background: generateGradient(data.wallet) }}
            />
            <div className="flex-1">
              <div className={`text-sm font-medium mb-1 ${badge.color}`}>{badge.label}</div>
              <h1 className="font-mono text-2xl font-bold text-white mb-1">{truncateWallet(data.wallet)}</h1>
              <p className="font-mono text-xs text-[#555555] break-all">{data.wallet}</p>
            </div>

            {/* Reputation Score */}
            <div className="shrink-0 text-center bg-[#0D0D0D] border border-[#222222] rounded-xl p-4">
              <div className="text-xs text-[#888888] mb-1">Curator Score</div>
              <div className="font-mono text-3xl font-bold text-[#00FF87]">{data.score}</div>
              <div className="text-xs text-[#888888]">/ 100</div>
              <div className="w-full bg-[#222222] rounded-full h-1.5 mt-2">
                <div
                  className="bg-[#00FF87] h-1.5 rounded-full transition-all"
                  style={{ width: `${data.score}%` }}
                />
              </div>
            </div>

            <Link
              href="/leaderboard"
              className="shrink-0 flex items-center gap-2 px-4 py-2 border border-[#222222] rounded-xl text-sm text-[#888888] hover:text-white hover:border-[#333333] transition-all"
            >
              <Trophy size={14} /> Leaderboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            {[
              { label: 'Total Fees', value: formatUSD(data.totalFees), icon: <Star size={13} className="text-[#00FF87]" />, highlight: true },
              { label: 'Total Volume', value: formatUSD(data.totalVolume), icon: <BarChart2 size={13} /> },
              { label: 'Total Holders', value: data.totalHolders.toString(), icon: <Users size={13} /> },
              {
                label: 'Avg Performance', icon: isPositive ? <TrendingUp size={13} className="text-[#00FF87]" /> : <TrendingDown size={13} className="text-[#FF4444]" />,
                value: `${isPositive ? '+' : ''}${data.avgPerf.toFixed(1)}%`, highlight: isPositive,
              },
            ].map((s, i) => (
              <div key={i} className={`rounded-xl p-3 ${s.highlight ? 'bg-[#00FF87]/5 border border-[#00FF87]/15' : 'bg-[#0D0D0D] border border-[#1A1A1A]'}`}>
                <div className="flex items-center gap-1.5 text-[#888888] text-xs mb-1">{s.icon}{s.label}</div>
                <div className={`font-mono font-bold ${s.highlight ? 'text-[#00FF87]' : 'text-white'}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Indexes */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono font-bold text-white text-lg flex items-center gap-2">
            <Layers size={16} className="text-[#00FF87]" />
            Indexes by this Curator
            <span className="text-[#888888] font-normal text-sm">({data.indexes.length})</span>
          </h2>
        </div>

        {data.indexes.length === 0 ? (
          <div className="text-center py-10 text-[#888888]">No indexes found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.indexes.map((index, i) => (
              <IndexCard key={index.id} index={index} i={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 bg-[#00FF87]/5 border border-[#00FF87]/20 rounded-xl p-5 text-center">
          <p className="text-[#888888] text-sm mb-3">Want to earn fees like this curator?</p>
          <Link href="/create" className="inline-flex items-center gap-2 bg-[#00FF87] text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#00FF87]/90 transition-all">
            Create Your Index <ExternalLink size={13} />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function CuratorPage() {
  return <Suspense><CuratorContent /></Suspense>
}

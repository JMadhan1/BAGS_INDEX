'use client'

import { useState, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import IndexCard from '@/components/marketplace/IndexCard'
import FilterBar from '@/components/marketplace/FilterBar'
import StatsBar from '@/components/marketplace/StatsBar'
import Skeleton from '@/components/shared/Skeleton'
import LiveActivityFeed from '@/components/shared/LiveActivityFeed'
import FeesTicker from '@/components/shared/FeesTicker'
import type { Index, GlobalStats } from '@/types'
import { useSearchParams } from 'next/navigation'

async function fetchIndexes(category: string, sortBy: string): Promise<{ indexes: Index[]; stats: GlobalStats }> {
  const params = new URLSearchParams({ sortBy, limit: '20' })
  if (category !== 'All') params.set('category', category)
  const res = await fetch(`/api/indexes?${params}`)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

function HomeContent() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('volume')

  const { data, isLoading } = useQuery({
    queryKey: ['indexes', category, sortBy],
    queryFn: () => fetchIndexes(category, sortBy),
  })

  const stats = data?.stats ?? { totalVolume: 521150, activeCount: 5, creatorCount: 5, feesDistributed: 2605.75 }

  return (
    <div>
      {isDemo && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00FF87] text-black text-xs font-mono font-bold px-3 py-1.5 rounded-full shadow-lg pointer-events-none">
          DEMO MODE
        </div>
      )}

      <FeesTicker stats={stats} />

      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-[#00FF87]/10 border border-[#00FF87]/20 text-[#00FF87] text-sm px-4 py-1.5 rounded-full mb-6">
              <Zap size={14} /> Live on Solana via Bags
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
          >
            The Index Fund for<br />
            <span className="text-[#00FF87]">Creator Tokens</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#888888] text-xl mb-8 max-w-2xl mx-auto"
          >
            Curate a basket. Share it. Earn fees forever.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a href="#indexes" className="flex items-center gap-2 bg-[#00FF87] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#00FF87]/90 transition-all hover:shadow-glow active:scale-95">
              Browse Indexes <ArrowRight size={16} />
            </a>
            <Link href="/create" className="flex items-center gap-2 border border-[#222222] text-white font-medium px-6 py-3 rounded-xl hover:border-[#00FF87] hover:text-[#00FF87] transition-all">
              Create Index
            </Link>
          </motion.div>
          <StatsBar stats={stats} />
        </div>
      </section>

      <div id="indexes">
        <FilterBar category={category} sortBy={sortBy} onCategory={setCategory} onSort={setSortBy} />
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="card" />)}
                </div>
              ) : (data?.indexes?.length ?? 0) === 0 ? (
                <div className="text-center py-20">
                  <p className="text-[#888888] text-lg mb-4">No indexes yet. Be the first to create one.</p>
                  <Link href="/create" className="inline-flex items-center gap-2 bg-[#00FF87] text-black font-bold px-6 py-3 rounded-xl">
                    Create Index <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.indexes?.map((index, i) => <IndexCard key={index.id} index={index} i={i} />)}
                </div>
              )}
            </div>
            <div className="xl:w-72 shrink-0">
              <LiveActivityFeed maxItems={8} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}

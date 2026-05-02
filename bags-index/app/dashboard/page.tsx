'use client'

import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Plus, BarChart2, Layers, Users } from 'lucide-react'
import StatCard from '@/components/shared/StatCard'
import LiveFeeCounter from '@/components/shared/LiveFeeCounter'
import EarningsChart from '@/components/dashboard/EarningsChart'
import IndexTable from '@/components/dashboard/IndexTable'
import TradesFeed from '@/components/dashboard/TradesFeed'
import Skeleton from '@/components/shared/Skeleton'
import FeeFlowViz from '@/components/shared/FeeFlowViz'
import LiveActivityFeed from '@/components/shared/LiveActivityFeed'
import { formatUSD } from '@/lib/utils'
import type { CreatorStats } from '@/types'

async function fetchStats(wallet: string): Promise<CreatorStats> {
  const res = await fetch(`/api/fees?wallet=${wallet}`)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

function DashboardContent() {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'

  const demoWallet = 'Demo1111111111111111111111111111111111111'
  const walletAddress = isDemo ? demoWallet : publicKey?.toBase58() || ''

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', walletAddress],
    queryFn: () => fetchStats(walletAddress),
    enabled: !!(connected || isDemo),
  })

  const demoStats: CreatorStats = {
    total_fees_earned: 642.25,
    total_volume: 128450,
    index_count: 3,
    total_holders: 89,
    indexes: [],
    recent_trades: [],
  }

  const stats = isDemo ? demoStats : data

  if (!connected && !isDemo) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-mono text-2xl font-bold mb-3">Connect Your Wallet</h2>
          <p className="text-[#888888] mb-6">View your creator earnings and manage your indexes.</p>
          <button
            onClick={() => setVisible(true)}
            className="bg-[#00FF87] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#00FF87]/90 transition-all"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-3xl font-bold text-white">Your Dashboard</h1>
          <p className="text-[#888888] mt-1">Track your earnings and manage your indexes.</p>
        </div>
        <Link href="/create" className="flex items-center gap-2 bg-[#00FF87] text-black font-bold px-4 py-2.5 rounded-xl hover:bg-[#00FF87]/90 transition-all text-sm">
          <Plus size={16} /> Create Index
        </Link>
      </div>

      {/* Stats Row */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="card" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <LiveFeeCounter totalFees={stats?.total_fees_earned ?? 0} />
          <StatCard label="Volume Generated" value={formatUSD(stats?.total_volume ?? 0)} icon={<BarChart2 size={16} />} />
          <StatCard label="Active Indexes" value={(stats?.index_count ?? 0).toString()} icon={<Layers size={16} />} />
          <StatCard label="Total Holders" value={(stats?.total_holders ?? 0).toString()} icon={<Users size={16} />} />
        </div>
      )}

      {/* Charts + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <EarningsChart />
        </div>
        <TradesFeed indexIds={stats?.indexes?.map(i => i.id) ?? []} />
      </div>

      {/* Fee Flow + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FeeFlowViz
          totalFees={stats?.total_fees_earned ?? 0}
          totalVolume={stats?.total_volume ?? 0}
          creatorWallet={walletAddress}
        />
        <LiveActivityFeed maxItems={6} />
      </div>

      {/* My Indexes Table */}
      <div>
        <h2 className="font-mono font-bold text-white text-xl mb-4">My Indexes</h2>
        {isLoading ? <Skeleton variant="card" /> : <IndexTable indexes={stats?.indexes ?? []} creatorWallet={walletAddress} />}
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>
}

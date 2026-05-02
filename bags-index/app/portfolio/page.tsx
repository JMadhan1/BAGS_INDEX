'use client'

import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Wallet, ArrowRight, PieChart, Clock } from 'lucide-react'
import TokenIcon from '@/components/shared/TokenIcon'
import { formatUSD, truncateWallet, timeAgo, TOKEN_COLORS } from '@/lib/utils'
import type { Index, TokenInIndex } from '@/types'

interface HoldingEntry {
  id: string
  wallet: string
  index_id: string
  amount_usd: number
  tokens_snapshot: TokenInIndex[]
  created_at: string
  index: Index
  currentValue: number
  pnl: number
  pnlPct: number
}

interface PortfolioData {
  holdings: HoldingEntry[]
  totalValue: number
  totalPnl: number
  totalPnlPct: number
}

async function fetchPortfolio(wallet: string): Promise<PortfolioData> {
  const res = await fetch(`/api/portfolio?wallet=${wallet}`)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export default function PortfolioPage() {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const wallet = publicKey?.toBase58() || ''

  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', wallet],
    queryFn: () => fetchPortfolio(wallet),
    enabled: !!wallet,
    refetchInterval: 30_000,
  })

  if (!connected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Wallet size={40} className="text-[#00FF87] mx-auto mb-4" />
          <h2 className="font-mono text-2xl font-bold mb-3">Your Portfolio</h2>
          <p className="text-[#888888] mb-6">Connect your wallet to view your index holdings.</p>
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

  const totalPnlPositive = (data?.totalPnl ?? 0) >= 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-mono text-3xl font-bold text-white">My Portfolio</h1>
            <p className="text-[#888888] mt-1 font-mono text-sm">{truncateWallet(wallet)}</p>
          </div>
          <Link href="/" className="flex items-center gap-2 border border-[#222222] text-[#888888] hover:text-white hover:border-[#333333] px-4 py-2 rounded-xl text-sm transition-all">
            Browse Indexes <ArrowRight size={14} />
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
            <div className="text-xs text-[#888888] mb-1.5 flex items-center gap-1.5"><PieChart size={12} />Portfolio Value</div>
            <div className="font-mono text-2xl font-bold text-white">
              {isLoading ? '...' : formatUSD(data?.totalValue ?? 0)}
            </div>
          </div>
          <div className={`bg-[#111111] border rounded-xl p-5 ${totalPnlPositive ? 'border-[#00FF87]/20' : 'border-[#FF4444]/20'}`}>
            <div className="text-xs text-[#888888] mb-1.5 flex items-center gap-1.5">
              {totalPnlPositive ? <TrendingUp size={12} className="text-[#00FF87]" /> : <TrendingDown size={12} className="text-[#FF4444]" />}
              Total P&amp;L
            </div>
            <div className={`font-mono text-2xl font-bold ${totalPnlPositive ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
              {isLoading ? '...' : `${totalPnlPositive ? '+' : ''}${formatUSD(data?.totalPnl ?? 0)}`}
            </div>
            {!isLoading && (
              <div className={`text-xs mt-1 ${totalPnlPositive ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
                {totalPnlPositive ? '+' : ''}{(data?.totalPnlPct ?? 0).toFixed(2)}% all time
              </div>
            )}
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
            <div className="text-xs text-[#888888] mb-1.5 flex items-center gap-1.5"><Clock size={12} />Positions</div>
            <div className="font-mono text-2xl font-bold text-white">
              {isLoading ? '...' : (data?.holdings?.length ?? 0)}
            </div>
            <div className="text-xs text-[#888888] mt-1">active index holdings</div>
          </div>
        </div>

        {/* Holdings List */}
        <div className="space-y-4">
          <h2 className="font-mono font-bold text-white text-lg">Holdings</h2>

          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 bg-[#111111] border border-[#222222] rounded-xl animate-pulse" />
            ))
          ) : (data?.holdings?.length ?? 0) === 0 ? (
            <div className="bg-[#111111] border border-[#222222] rounded-xl p-10 text-center">
              <PieChart size={36} className="text-[#333333] mx-auto mb-3" />
              <p className="text-[#888888] mb-4">You have no index holdings yet.</p>
              <Link href="/" className="inline-flex items-center gap-2 bg-[#00FF87] text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#00FF87]/90 transition-all">
                Browse Indexes <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            data?.holdings?.map((holding, i) => {
              const isPnlPositive = holding.pnl >= 0
              return (
                <motion.div
                  key={holding.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#333333] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Token icons + name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center">
                        {holding.index?.tokens?.slice(0, 3).map((t, idx) => (
                          <div key={t.mint} style={{ marginLeft: idx > 0 ? -8 : 0, zIndex: 3 - idx }}>
                            <TokenIcon src={t.icon_url} symbol={t.symbol} size={32} />
                          </div>
                        ))}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/index/${holding.index_id}`} className="font-mono font-bold text-white hover:text-[#00FF87] transition-colors">
                          {holding.index?.name ?? 'Unknown Index'}
                        </Link>
                        <div className="text-xs text-[#888888] mt-0.5 flex items-center gap-2">
                          <span>{holding.index?.category}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Clock size={10} />Bought {timeAgo(holding.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Token weights bar */}
                    <div className="hidden md:flex items-center gap-1 w-32">
                      {holding.index?.tokens?.map((t, idx) => (
                        <div
                          key={t.mint}
                          className="h-2 rounded-full"
                          style={{ width: `${t.weight}%`, background: TOKEN_COLORS[idx % TOKEN_COLORS.length] }}
                          title={`${t.symbol} ${t.weight}%`}
                        />
                      ))}
                    </div>

                    {/* Value */}
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-white text-lg">{formatUSD(holding.currentValue)}</div>
                      <div className={`text-xs font-mono ${isPnlPositive ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
                        {isPnlPositive ? '+' : ''}{formatUSD(holding.pnl)} ({isPnlPositive ? '+' : ''}{holding.pnlPct.toFixed(1)}%)
                      </div>
                      <div className="text-xs text-[#555555] mt-0.5">cost {formatUSD(holding.amount_usd)}</div>
                    </div>

                    <Link
                      href={`/index/${holding.index_id}`}
                      className="shrink-0 px-4 py-2 rounded-xl border border-[#222222] text-xs text-[#888888] hover:border-[#00FF87] hover:text-[#00FF87] transition-all"
                    >
                      View →
                    </Link>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>
    </div>
  )
}

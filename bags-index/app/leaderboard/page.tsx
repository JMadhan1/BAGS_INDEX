'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Users, BarChart2, Layers, Crown } from 'lucide-react'
import { formatUSD, truncateWallet, generateGradient } from '@/lib/utils'

interface LeaderboardEntry {
  wallet: string
  totalVolume: number
  totalFees: number
  totalHolders: number
  indexCount: number
  topIndex: string
}

async function fetchLeaderboard(): Promise<{ leaderboard: LeaderboardEntry[] }> {
  const res = await fetch('/api/leaderboard')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    refetchInterval: 30_000,
  })

  const entries = data?.leaderboard ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#00FF87]/10 border border-[#00FF87]/20 text-[#00FF87] text-sm px-4 py-1.5 rounded-full mb-4">
            <Trophy size={14} /> Top Index Curators
          </div>
          <h1 className="font-mono text-4xl font-bold text-white mb-3">Curator Leaderboard</h1>
          <p className="text-[#888888] max-w-xl mx-auto">
            The best curators earn passive fees forever. Every trade on their index pays them 0.5% — automatically, on-chain.
          </p>
        </div>

        {/* Top 3 Podium */}
        {!isLoading && entries.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[entries[1], entries[0], entries[2]].map((entry, podiumIdx) => {
              const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
              const isTop = rank === 1
              return (
                <motion.div
                  key={entry.wallet}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: podiumIdx * 0.1 }}
                  className={`${isTop ? 'border-[#00FF87]/30 bg-[#00FF87]/5' : 'border-[#222222] bg-[#111111]'} border rounded-xl p-4 text-center`}
                >
                  <div className="text-2xl mb-2">{MEDALS[rank - 1]}</div>
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-2"
                    style={{ background: generateGradient(entry.wallet) }}
                  />
                  <div className="font-mono text-xs text-white mb-1">{truncateWallet(entry.wallet)}</div>
                  <div className={`font-mono font-bold text-lg ${isTop ? 'text-[#00FF87]' : 'text-white'}`}>
                    {formatUSD(entry.totalFees)}
                  </div>
                  <div className="text-[10px] text-[#888888]">total fees earned</div>
                  <div className="text-xs text-[#888888] mt-1 truncate">{entry.topIndex}</div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Full Table */}
        <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-3 px-4 py-3 border-b border-[#222222] text-xs text-[#888888] font-medium">
            <span>#</span>
            <span>Curator</span>
            <span className="text-right hidden md:block">Indexes</span>
            <span className="text-right hidden md:block">Holders</span>
            <span className="text-right">Volume</span>
            <span className="text-right text-[#00FF87]">Fees</span>
          </div>

          {isLoading ? (
            <div className="space-y-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 border-b border-[#1A1A1A] animate-pulse bg-[#1A1A1A]/20" />
              ))}
            </div>
          ) : (
            entries.map((entry, i) => (
              <motion.div
                key={entry.wallet}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-3 px-4 py-3.5 border-b border-[#1A1A1A] last:border-0 items-center hover:bg-[#1A1A1A]/50 transition-colors`}
              >
                <div className="w-6 text-center">
                  {i < 3 ? (
                    <span className="text-base">{MEDALS[i]}</span>
                  ) : (
                    <span className="text-sm text-[#555555] font-mono">{i + 1}</span>
                  )}
                </div>

                <a href={`/curator/${entry.wallet}`} className="flex items-center gap-3 min-w-0 group">
                  <div
                    className="w-8 h-8 rounded-full shrink-0"
                    style={{ background: generateGradient(entry.wallet) }}
                  />
                  <div className="min-w-0">
                    <div className="font-mono text-sm text-white group-hover:text-[#00FF87] transition-colors">{truncateWallet(entry.wallet)}</div>
                    <div className="text-xs text-[#888888] truncate">{entry.topIndex}</div>
                  </div>
                  {i === 0 && (
                    <Crown size={13} className="text-[#FFD700] shrink-0" />
                  )}
                </a>

                <div className="text-right hidden md:block">
                  <div className="flex items-center gap-1 justify-end text-xs text-[#888888]">
                    <Layers size={11} /> {entry.indexCount}
                  </div>
                </div>

                <div className="text-right hidden md:block">
                  <div className="flex items-center gap-1 justify-end text-xs text-[#888888]">
                    <Users size={11} /> {entry.totalHolders}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-xs text-[#888888]">
                    <BarChart2 size={11} /> {formatUSD(entry.totalVolume)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-[#00FF87]">
                    {formatUSD(entry.totalFees)}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-[#00FF87]/5 border border-[#00FF87]/20 rounded-xl p-6 text-center"
        >
          <TrendingUp size={24} className="text-[#00FF87] mx-auto mb-3" />
          <h3 className="font-mono font-bold text-white mb-2">Want to climb the leaderboard?</h3>
          <p className="text-[#888888] text-sm mb-4">
            Create a curated index. Every trade earns you 0.5% — forever. No limits.
          </p>
          <a
            href="/create"
            className="inline-flex items-center gap-2 bg-[#00FF87] text-black font-bold px-6 py-2.5 rounded-xl hover:bg-[#00FF87]/90 transition-all"
          >
            Create Your Index
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}

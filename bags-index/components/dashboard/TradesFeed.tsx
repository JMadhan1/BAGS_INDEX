'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatUSD, truncateWallet, timeAgo } from '@/lib/utils'
import type { Trade } from '@/types'

const MOCK_TRADES: Trade[] = [
  { id: '1', index_id: 'a', buyer_wallet: 'ABC123xyz789def', amount_usd: 250, fee_amount: 1.25, tx_signature: 'tx1', tokens_bought: [], created_at: new Date(Date.now() - 120000).toISOString() },
  { id: '2', index_id: 'b', buyer_wallet: 'DEF456uvw012ghi', amount_usd: 500, fee_amount: 2.5, tx_signature: 'tx2', tokens_bought: [], created_at: new Date(Date.now() - 300000).toISOString() },
  { id: '3', index_id: 'c', buyer_wallet: 'GHI789rst345jkl', amount_usd: 100, fee_amount: 0.5, tx_signature: 'tx3', tokens_bought: [], created_at: new Date(Date.now() - 600000).toISOString() },
]

export default function TradesFeed({ indexIds }: { indexIds: string[] }) {
  const [trades, setTrades] = useState<Trade[]>(MOCK_TRADES)

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!indexIds.length) return
      try {
        const res = await fetch(`/api/trade?index_ids=${indexIds.join(',')}`)
        if (res.ok) {
          const data = await res.json()
          if (data.trades?.length) setTrades(prev => [...data.trades.slice(0, 5), ...prev].slice(0, 20))
        }
      } catch { /* ignore */ }
    }, 30000)
    return () => clearInterval(interval)
  }, [indexIds])

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-mono font-bold text-white">Live Activity</h3>
        <span className="w-2 h-2 bg-[#00FF87] rounded-full animate-pulse" />
      </div>
      <div className="space-y-0.5">
        <AnimatePresence initial={false}>
          {trades.map(trade => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 py-2.5 border-b border-[#1A1A1A] last:border-0 text-sm"
            >
              <span className="text-base">🔄</span>
              <span className="font-mono text-white">{truncateWallet(trade.buyer_wallet)}</span>
              <span className="text-[#888888]">bought</span>
              <span className="font-mono text-white">{formatUSD(trade.amount_usd)}</span>
              <span className="ml-auto text-[#00FF87] font-mono text-xs">+{formatUSD(trade.fee_amount)}</span>
              <span className="text-[#888888] text-xs">{timeAgo(trade.created_at)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

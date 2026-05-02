'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, TrendingUp } from 'lucide-react'
import { truncateWallet, formatUSD } from '@/lib/utils'

interface ActivityItem {
  id: string
  wallet: string
  action: string
  amount: number
  indexName: string
  time: string
}

const MOCK_ACTIVITIES: Omit<ActivityItem, 'id' | 'time'>[] = [
  { wallet: 'AUxP...rGX2', action: 'bought', amount: 234, indexName: 'Top AI Builders' },
  { wallet: '7kBn...mQ4R', action: 'bought', amount: 89, indexName: 'Meme Lords Index' },
  { wallet: 'Fz3R...9pQw', action: 'created', amount: 0, indexName: 'Gaming Creator Fund' },
  { wallet: 'Hx8T...vL2K', action: 'bought', amount: 450, indexName: 'Rising Dev Builders' },
  { wallet: '3mNp...8jYs', action: 'bought', amount: 127, indexName: 'Art & Music Creators' },
  { wallet: 'Qw5R...dK7M', action: 'bought', amount: 310, indexName: 'Top AI Builders' },
  { wallet: 'Lp9X...oT4E', action: 'bought', amount: 55, indexName: 'Meme Lords Index' },
]

function randomActivity(): ActivityItem {
  const base = MOCK_ACTIVITIES[Math.floor(Math.random() * MOCK_ACTIVITIES.length)]
  return {
    ...base,
    id: Math.random().toString(36).slice(2),
    amount: base.action === 'bought' ? Math.floor(Math.random() * 800) + 20 : 0,
    time: 'just now',
  }
}

interface Props {
  trades?: { buyer_wallet: string; amount_usd: number; created_at: string; index_id: string }[]
  indexNames?: Record<string, string>
  maxItems?: number
}

export default function LiveActivityFeed({ trades, maxItems = 6 }: Props) {
  const [items, setItems] = useState<ActivityItem[]>([])

  useEffect(() => {
    // Populate initial items client-side only to avoid hydration mismatch
    setItems(Array.from({ length: 4 }, randomActivity))
  }, [])

  useEffect(() => {
    if (trades && trades.length > 0) {
      const realItems: ActivityItem[] = trades.slice(0, maxItems).map(t => ({
        id: t.buyer_wallet + t.created_at,
        wallet: truncateWallet(t.buyer_wallet),
        action: 'bought',
        amount: t.amount_usd,
        indexName: 'Index',
        time: timeAgo(t.created_at),
      }))
      setItems(realItems)
      return
    }

    // Simulate live activity when no real trades
    const id = setInterval(() => {
      const newItem = randomActivity()
      setItems(prev => [newItem, ...prev].slice(0, maxItems))
    }, 3500)
    return () => clearInterval(id)
  }, [trades, maxItems])

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <Activity size={15} className="text-[#00FF87]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#00FF87] rounded-full animate-pulse" />
        </div>
        <h3 className="font-mono font-bold text-white text-sm">Live Activity</h3>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {items.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 py-1.5 border-b border-[#1A1A1A] last:border-0"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00FF87]/30 to-[#00D4FF]/30 flex items-center justify-center shrink-0">
                <TrendingUp size={10} className="text-[#00FF87]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono text-white">{item.wallet}</span>
                <span className="text-xs text-[#888888]"> {item.action} </span>
                <span className="text-xs text-[#00FF87] font-medium truncate">{item.indexName}</span>
              </div>
              {item.amount > 0 && (
                <span className="text-xs font-mono text-white shrink-0">{formatUSD(item.amount)}</span>
              )}
              <span className="text-[10px] text-[#555555] shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

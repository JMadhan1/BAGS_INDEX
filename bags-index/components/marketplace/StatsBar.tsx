'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { GlobalStats } from '@/types'
import { formatUSD } from '@/lib/utils'

interface StatsBarProps {
  stats: GlobalStats
}

function AnimatedNumber({ target, prefix = '' }: { target: number; prefix?: string }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const duration = 1500
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setVal(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(t => step(t, startTime))
      else setVal(target)
    }
    requestAnimationFrame(t => step(t, t))
  }, [target])

  if (prefix === '$') return <>{formatUSD(val)}</>
  return <>{prefix}{val.toLocaleString()}</>
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: 'Total Volume', value: stats.totalVolume, prefix: '$' },
    { label: 'Active Indexes', value: stats.activeCount, prefix: '' },
    { label: 'Creators Earning', value: stats.creatorCount, prefix: '' },
    { label: 'Fees Distributed', value: stats.feesDistributed, prefix: '$' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap items-center justify-center gap-8 mt-8"
    >
      {items.map((item, i) => (
        <div key={i} className="text-center">
          <div className="font-mono font-bold text-xl text-[#00FF87]">
            <AnimatedNumber target={item.value} prefix={item.prefix} />
          </div>
          <div className="text-xs text-[#888888] mt-0.5">{item.label}</div>
        </div>
      ))}
    </motion.div>
  )
}

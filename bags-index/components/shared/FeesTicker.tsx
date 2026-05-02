'use client'

import { useEffect, useRef, useState } from 'react'
import { Zap } from 'lucide-react'
import type { GlobalStats } from '@/types'

interface FeesTickerProps {
  stats: GlobalStats
}

export default function FeesTicker({ stats }: FeesTickerProps) {
  const [displayed, setDisplayed] = useState(stats.feesDistributed)
  const targetRef = useRef(stats.feesDistributed)

  useEffect(() => {
    targetRef.current = stats.feesDistributed
  }, [stats.feesDistributed])

  // Slowly count up to simulate live accrual
  useEffect(() => {
    const id = setInterval(() => {
      setDisplayed(prev => {
        const increment = (Math.random() * 0.08) + 0.01
        return parseFloat((prev + increment).toFixed(2))
      })
    }, 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full bg-[#0A0A0A] border-b border-[#1A1A1A] py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-[#888888] font-mono">
          <span className="w-1.5 h-1.5 bg-[#00FF87] rounded-full animate-pulse inline-block" />
          LIVE
        </div>
        <div className="text-[11px] text-[#888888]">
          💸 <span className="text-[#00FF87] font-mono font-bold">${displayed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          {' '}in curator fees distributed
        </div>
        <span className="text-[#333333] hidden md:block">·</span>
        <div className="text-[11px] text-[#888888] hidden md:flex items-center gap-1">
          <Zap size={10} className="text-[#00FF87]" />
          <span className="font-mono text-white">{stats.activeCount}</span> active indexes
        </div>
        <span className="text-[#333333] hidden md:block">·</span>
        <div className="text-[11px] text-[#888888] hidden md:block">
          <span className="font-mono text-white">{stats.creatorCount}</span> curators earning
        </div>
      </div>
    </div>
  )
}

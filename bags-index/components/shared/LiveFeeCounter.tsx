'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

interface LiveFeeCounterProps {
  totalFees: number
}

export default function LiveFeeCounter({ totalFees }: LiveFeeCounterProps) {
  const [displayed, setDisplayed] = useState(totalFees)
  const [flash, setFlash] = useState(false)
  const [lastIncrement, setLastIncrement] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setDisplayed(totalFees)
  }, [totalFees])

  useEffect(() => {
    // Simulate live fee accrual — small random ticks every 3-7 seconds
    function tick() {
      const delay = 3000 + Math.random() * 4000
      intervalRef.current = setTimeout(() => {
        const increment = parseFloat((Math.random() * 0.12 + 0.01).toFixed(4))
        setDisplayed(prev => parseFloat((prev + increment).toFixed(4)))
        setLastIncrement(`+$${increment.toFixed(4)}`)
        setFlash(true)
        setTimeout(() => setFlash(false), 800)
        setTimeout(() => setLastIncrement(null), 2000)
        tick()
      }, delay)
    }
    tick()
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current) }
  }, [])

  const formatted = displayed >= 1000
    ? `$${(displayed / 1000).toFixed(3)}K`
    : `$${displayed.toFixed(2)}`

  return (
    <div
      className={`bg-[#111111] border rounded-xl p-5 hover:border-[#333333] transition-all duration-300 relative overflow-hidden ${flash ? 'border-[#00FF87]/50 shadow-[0_0_20px_rgba(0,255,135,0.12)]' : 'border-[#222222]'}`}
    >
      {/* Subtle pulse bg on increment */}
      {flash && (
        <div className="absolute inset-0 bg-[#00FF87]/5 pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-[#888888] text-sm">Total Fees Earned</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#00FF87] rounded-full animate-pulse" />
          <span className="text-[10px] text-[#00FF87] font-mono">LIVE</span>
        </div>
      </div>

      <div className="flex items-end gap-3">
        <motion.div
          key={Math.floor(displayed * 100)}
          initial={{ scale: 1 }}
          animate={{ scale: flash ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className="font-mono font-bold text-2xl text-white"
        >
          {formatted}
        </motion.div>

        <AnimatePresence>
          {lastIncrement && (
            <motion.span
              key={lastIncrement + Date.now()}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-xs font-mono text-[#00FF87] mb-1"
            >
              {lastIncrement}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1 mt-1.5">
        <Zap size={10} className="text-[#00FF87]" />
        <span className="text-[10px] text-[#555555]">Accruing in real-time</span>
      </div>
    </div>
  )
}

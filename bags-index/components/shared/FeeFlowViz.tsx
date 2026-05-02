'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowRight, Zap } from 'lucide-react'

interface FeeFlowVizProps {
  totalFees: number
  totalVolume: number
  creatorWallet?: string
}

export default function FeeFlowViz({ totalFees, totalVolume, creatorWallet }: FeeFlowVizProps) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setPulse(p => !p), 2500)
    return () => clearInterval(id)
  }, [])

  const bagsFee = totalVolume * 0.01
  const curatorFee = totalVolume * 0.005
  const creatorFee = totalVolume * 0.005

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Zap size={16} className="text-[#00FF87]" />
        <h3 className="font-mono font-bold text-white">Fee Distribution</h3>
        <span className="ml-auto text-xs text-[#888888]">Per trade</span>
      </div>

      {/* Flow Diagram */}
      <div className="flex items-center justify-between gap-2 mb-6">
        {/* Trade Box */}
        <motion.div
          animate={{ scale: pulse ? 1.04 : 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-xl p-3 text-center"
        >
          <div className="text-xs text-[#888888] mb-1">Trade happens</div>
          <div className="font-mono font-bold text-white text-sm">Any amount</div>
          <div className="text-xs text-[#00FF87] mt-1">on Bags</div>
        </motion.div>

        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ x: pulse ? 4 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <ArrowRight size={16} className="text-[#00FF87]" />
          </motion.div>
          <span className="text-[9px] text-[#888888] font-mono">1% fee</span>
        </div>

        {/* Bags Protocol */}
        <div className="flex-1 bg-[#00FF87]/5 border border-[#00FF87]/20 rounded-xl p-3 text-center">
          <div className="text-xs text-[#888888] mb-1">Bags Protocol</div>
          <div className="font-mono font-bold text-[#00FF87] text-sm">1% total</div>
          <div className="text-xs text-[#888888] mt-1">splits 50/50</div>
        </div>
      </div>

      {/* Split Visualization */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <motion.div
          animate={{ borderColor: pulse ? 'rgba(0,255,135,0.4)' : 'rgba(0,212,255,0.2)' }}
          transition={{ duration: 0.5 }}
          className="bg-[#00D4FF]/5 border rounded-xl p-3 text-center"
        >
          <div className="text-xs text-[#888888] mb-1">Index Curator</div>
          <div className="font-mono font-bold text-[#00D4FF] text-lg">0.5%</div>
          <div className="text-xs text-[#888888] mt-1">passive income</div>
          <div className="text-xs font-mono text-white mt-2">
            ${curatorFee.toFixed(2)} earned
          </div>
        </motion.div>

        <motion.div
          animate={{ borderColor: pulse ? 'rgba(199,125,255,0.4)' : 'rgba(199,125,255,0.2)' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-purple-500/5 border rounded-xl p-3 text-center"
        >
          <div className="text-xs text-[#888888] mb-1">Token Creators</div>
          <div className="font-mono font-bold text-purple-400 text-lg">0.5%</div>
          <div className="text-xs text-[#888888] mt-1">creator royalty</div>
          <div className="text-xs font-mono text-white mt-2">
            ${creatorFee.toFixed(2)} shared
          </div>
        </motion.div>
      </div>

      {/* Live Totals */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-[#888888] mb-1">Total Volume</div>
            <div className="font-mono text-sm font-bold text-white">
              ${totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}K` : totalVolume.toFixed(0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#888888] mb-1">Total Fees</div>
            <div className="font-mono text-sm font-bold text-[#00FF87]">
              ${totalFees.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[#888888] mb-1">Your Cut</div>
            <div className="font-mono text-sm font-bold text-[#00D4FF]">
              ${(totalFees * 0.5).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {creatorWallet && (
        <p className="text-[10px] text-[#555555] text-center mt-3 font-mono">
          Paid to {creatorWallet.slice(0, 6)}...{creatorWallet.slice(-4)} · forever
        </p>
      )}
    </div>
  )
}

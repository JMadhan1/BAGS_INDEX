'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, RefreshCw, X, Check } from 'lucide-react'
import TokenIcon from '@/components/shared/TokenIcon'
import { toast } from 'sonner'
import type { Index, TokenInIndex } from '@/types'
import { TOKEN_COLORS } from '@/lib/utils'

interface RebalanceModalProps {
  index: Index
  onClose: () => void
  creatorWallet: string
}

function calcDrift(tokens: TokenInIndex[]): { token: TokenInIndex; currentWeight: number; drift: number }[] {
  // Simulate price drift: apply random drift to each token's target weight
  return tokens.map(t => {
    const priceDrift = (Math.random() - 0.5) * 20
    const currentWeight = Math.max(1, t.weight + priceDrift)
    const drift = currentWeight - t.weight
    return { token: t, currentWeight: parseFloat(currentWeight.toFixed(1)), drift: parseFloat(drift.toFixed(1)) }
  })
}

export default function RebalanceModal({ index, onClose }: RebalanceModalProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const driftData = useState(() => calcDrift(index.tokens))[0]
  const maxDrift = Math.max(...driftData.map(d => Math.abs(d.drift)))
  const needsRebalance = maxDrift > 5

  async function handlePropose() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setDone(true)
    toast.success('Rebalance proposal submitted to index holders.')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="bg-[#111111] border border-[#222222] rounded-2xl p-6 w-full max-w-lg"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="text-[#00FF87]" />
              <h2 className="font-mono font-bold text-white">Rebalance Index</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#1A1A1A] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Drift indicator */}
          <div className={`flex items-start gap-3 p-3 rounded-xl mb-5 ${needsRebalance ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-[#00FF87]/5 border border-[#00FF87]/15'}`}>
            <AlertTriangle size={16} className={needsRebalance ? 'text-orange-400 mt-0.5 shrink-0' : 'text-[#00FF87] mt-0.5 shrink-0'} />
            <div>
              <p className={`text-sm font-medium ${needsRebalance ? 'text-orange-400' : 'text-[#00FF87]'}`}>
                {needsRebalance ? `Max drift: ${maxDrift.toFixed(1)}% — Rebalance recommended` : 'Portfolio is balanced'}
              </p>
              <p className="text-xs text-[#888888] mt-0.5">
                {needsRebalance
                  ? 'Token prices have shifted. Proposing a rebalance will notify all holders.'
                  : 'All tokens are within 5% of their target allocations.'}
              </p>
            </div>
          </div>

          {/* Token weights */}
          <div className="space-y-3 mb-5">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 text-xs text-[#888888] px-1">
              <span>Token</span>
              <span className="text-right">Target</span>
              <span className="text-right">Current</span>
              <span className="text-right">Drift</span>
            </div>
            {driftData.map((d, i) => (
              <div key={d.token.mint} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: TOKEN_COLORS[i % TOKEN_COLORS.length] }} />
                  <TokenIcon src={d.token.icon_url} symbol={d.token.symbol} size={20} />
                  <span className="text-sm font-mono text-white">{d.token.symbol}</span>
                </div>
                <span className="text-xs font-mono text-[#888888] text-right">{d.token.weight}%</span>
                <span className="text-xs font-mono text-white text-right">{d.currentWeight}%</span>
                <span className={`text-xs font-mono text-right ${Math.abs(d.drift) > 5 ? 'text-orange-400' : 'text-[#888888]'}`}>
                  {d.drift >= 0 ? '+' : ''}{d.drift}%
                </span>
              </div>
            ))}
          </div>

          {done ? (
            <div className="flex items-center gap-2 justify-center py-3 text-[#00FF87]">
              <Check size={16} />
              <span className="font-medium">Proposal submitted to all holders!</span>
            </div>
          ) : (
            <button
              onClick={handlePropose}
              disabled={loading || !needsRebalance}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#00FF87] text-black hover:bg-[#00FF87]/90"
            >
              {loading ? (
                <><RefreshCw size={14} className="animate-spin" /> Proposing...</>
              ) : needsRebalance ? (
                <><RefreshCw size={14} /> Propose Rebalance to Holders</>
              ) : (
                'No Rebalance Needed'
              )}
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

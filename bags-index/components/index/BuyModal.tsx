'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, ExternalLink, Zap, PieChart } from 'lucide-react'
import TokenIcon from '@/components/shared/TokenIcon'
import type { Index } from '@/types'
import { formatUSD, formatSOL } from '@/lib/utils'
import { executeIndexBuy } from '@/lib/bags'

interface BuyModalProps {
  index: Index
  isDemo?: boolean
}

export default function BuyModal({ index, isDemo }: BuyModalProps) {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const router = useRouter()
  const [solAmount, setSolAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [txSigs, setTxSigs] = useState<string[]>([])
  const [solPrice, setSolPrice] = useState(180)

  useEffect(() => {
    fetch('/api/sol-price').then(r => r.json()).then(d => { if (d.price) setSolPrice(d.price) }).catch(() => {})
  }, [])

  const sol = parseFloat(solAmount) || 0
  const usd = sol * solPrice
  const fee = usd * 0.005

  async function handleBuy() {
    if (!sol || sol <= 0) return toast.error('Enter a SOL amount')
    setLoading(true)
    try {
      const { txSignatures } = isDemo
        ? await new Promise<{ txSignatures: string[] }>(r => setTimeout(() => r({ txSignatures: ['demo_tx_1', 'demo_tx_2'] }), 2000))
        : await executeIndexBuy(publicKey?.toBase58() || '', index.tokens, sol)

      await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index_id: index.id,
          buyer_wallet: publicKey?.toBase58(),
          amount_usd: usd,
          tx_signature: txSignatures[0],
          tokens_bought: index.tokens,
        }),
      })

      setTxSigs(txSignatures)
      toast.success('Index purchased successfully!')
    } catch {
      toast.error('Transaction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (txSigs.length > 0) {
    return (
      <div className="bg-[#111111] border border-[#00FF87]/30 rounded-2xl p-6 text-center">
        <CheckCircle2 size={40} className="text-[#00FF87] mx-auto mb-3" />
        <h3 className="font-mono font-bold text-white mb-2">Purchase Complete!</h3>
        <p className="text-[#888888] text-sm mb-4">Your index tokens are on their way.</p>
        <div className="space-y-2 mb-4">
          {txSigs.slice(0, 3).map((sig, i) => (
            <a key={i} href={`https://solscan.io/tx/${sig}`} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 text-xs text-[#00D4FF] hover:underline">
              <ExternalLink size={11} /> {sig.slice(0, 16)}...
            </a>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => router.push('/portfolio')} className="flex items-center gap-1.5 text-sm text-[#00FF87] hover:underline">
            <PieChart size={13} /> View Portfolio
          </button>
          <span className="text-[#333333]">·</span>
          <button onClick={() => setTxSigs([])} className="text-sm text-[#888888] hover:text-white transition-colors">
            Buy More
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-mono font-bold text-white text-lg">Buy This Index</h3>
        <div className="flex items-center gap-1 text-xs text-[#888888] bg-[#1A1A1A] px-2 py-1 rounded-lg">
          <Zap size={10} className="text-[#00FF87]" />
          <span className="font-mono">SOL ${solPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Quick select */}
      <div className="flex gap-2 mb-3">
        {[0.1, 0.5, 1, 5].map(v => (
          <button key={v} onClick={() => setSolAmount(String(v))}
            className={`flex-1 text-xs py-1.5 rounded-lg border transition-all ${
              solAmount === String(v) ? 'border-[#00FF87] text-[#00FF87] bg-[#00FF87]/10' : 'border-[#333333] text-[#888888] hover:border-[#444444]'
            }`}>
            {v} SOL
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="text-xs text-[#888888] mb-1.5 block">Amount (SOL)</label>
        <div className="relative">
          <input
            value={solAmount}
            onChange={e => setSolAmount(e.target.value)}
            placeholder="0.00"
            type="number"
            min="0"
            step="0.1"
            className="w-full bg-[#1A1A1A] border border-[#222222] rounded-xl px-4 py-3 font-mono text-white text-lg placeholder-[#888888] focus:outline-none focus:border-[#00FF87] transition-colors pr-16"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#888888] font-mono">SOL</span>
        </div>
        {sol > 0 && <p className="text-xs text-[#888888] mt-1">≈ {formatUSD(usd)}</p>}
      </div>

      {sol > 0 && (
        <div className="bg-[#1A1A1A] rounded-xl p-3 mb-4 space-y-1.5">
          {index.tokens.map(t => (
            <div key={t.mint} className="flex items-center gap-2 text-xs">
              <TokenIcon src={t.icon_url} symbol={t.symbol} size={16} />
              <span className="text-[#888888]">{t.symbol}</span>
              <span className="ml-auto text-white font-mono">{formatSOL(sol * t.weight / 100)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between text-xs text-[#888888] mb-4">
        <span>Creator fee (0.5%)</span>
        <span className="text-white">{sol > 0 ? formatUSD(fee) : '--'}</span>
      </div>
      <div className="flex justify-between text-xs text-[#888888] mb-5">
        <span>Platform fee</span>
        <span className="text-[#00FF87]">0% (waived)</span>
      </div>

      {!connected ? (
        <button onClick={() => setVisible(true)} className="w-full bg-[#00FF87] text-black font-bold py-3 rounded-xl hover:bg-[#00FF87]/90 transition-all">
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={handleBuy}
          disabled={loading || !sol}
          className="w-full flex items-center justify-center gap-2 bg-[#00FF87] text-black font-bold py-3 rounded-xl hover:bg-[#00FF87]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Executing {index.tokens.length} trades...</> : 'Buy Index'}
        </button>
      )}
    </div>
  )
}

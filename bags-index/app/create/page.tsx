'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import StepIndicator from '@/components/create/StepIndicator'
import TokenSelector from '@/components/create/TokenSelector'
import WeightSlider from '@/components/create/WeightSlider'
import CompositionChart from '@/components/create/CompositionChart'
import TrendingTokens from '@/components/create/TrendingTokens'
import { useCreateStore } from '@/store/createStore'
import type { IndexCategory } from '@/types'
import { ArrowRight, ArrowLeft, Loader2, Share2, ExternalLink } from 'lucide-react'

const CATEGORIES: IndexCategory[] = ['AI Creators', 'Dev Builders', 'Gaming', 'Art', 'Meme', 'Other']

const pageVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
}

function CreateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [launching, setLaunching] = useState(false)
  const [launched, setLaunched] = useState<string | null>(null)

  const {
    step, name, description, category, selectedTokens,
    setStep, setName, setDescription, setCategory,
    toggleToken, updateWeight, balanceEqually, prefillDemo,
  } = useCreateStore()

  // Demo pre-fill
  useState(() => {
    if (searchParams.get('demo') === 'true') prefillDemo()
  })

  if (!connected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-mono text-2xl font-bold mb-3">Connect Your Wallet</h2>
          <p className="text-[#888888] mb-6">You need a Solana wallet to create an index.</p>
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

  const totalWeight = selectedTokens.reduce((s, t) => s + t.weight, 0)
  const weightValid = Math.abs(totalWeight - 100) <= 1

  async function handleLaunch() {
    setLaunching(true)
    try {
      const res = await fetch('/api/indexes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, description, category, tokens: selectedTokens,
          creator_wallet: publicKey?.toBase58(),
        }),
      })
      if (!res.ok) throw new Error('Failed to create')
      const { index } = await res.json()
      confetti({ particleCount: 120, spread: 80, colors: ['#00FF87', '#00D4FF', '#ffffff'] })
      setLaunched(index.id)
    } catch {
      toast.error('Failed to launch index. Please try again.')
    } finally {
      setLaunching(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-mono text-3xl font-bold text-white text-center mb-2">Create Your Index</h1>
      <p className="text-[#888888] text-center mb-8">Build a curated token basket. Earn 0.5% fees forever.</p>
      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        {/* Step 1 */}
        {step === 1 && (
          <motion.div key="s1" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-white">Index Name</label>
                  <span className="text-xs text-[#888888]">{name.length}/30</span>
                </div>
                <input
                  value={name}
                  onChange={e => setName(e.target.value.slice(0, 30))}
                  placeholder="e.g. Top AI Builders"
                  className="w-full bg-[#1A1A1A] border border-[#222222] rounded-xl px-4 py-3 font-mono text-white placeholder-[#888888] focus:outline-none focus:border-[#00FF87] transition-colors caret-[#00FF87]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-white">Description</label>
                  <span className="text-xs text-[#888888]">{description.length}/200</span>
                </div>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 200))}
                  placeholder="What's special about this basket?"
                  rows={3}
                  className="w-full bg-[#1A1A1A] border border-[#222222] rounded-xl px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:border-[#00FF87] transition-colors resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        category === c ? 'bg-[#00FF87] text-black' : 'border border-[#222222] text-[#888888] hover:border-[#333333] hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!name || !category}
                className="w-full flex items-center justify-center gap-2 bg-[#00FF87] text-black font-bold py-3 rounded-xl hover:bg-[#00FF87]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next Step <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div key="s2" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
              <TrendingTokens
                selectedMints={selectedTokens.map(t => t.mint)}
                onSelect={t => toggleToken({ mint: t.mint, symbol: t.symbol, name: t.name, weight: 0, icon_url: t.icon_url })}
              />
              <TokenSelector selected={selectedTokens} onToggle={toggleToken} />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2.5 border border-[#222222] rounded-xl text-[#888888] hover:text-white transition-colors">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedTokens.length < 2}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#00FF87] text-black font-bold py-2.5 rounded-xl hover:bg-[#00FF87]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div key="s3" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <WeightSlider tokens={selectedTokens} onUpdate={updateWeight} onBalance={balanceEqually} />
                </div>
                <div className="lg:w-56 shrink-0">
                  <CompositionChart tokens={selectedTokens} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2.5 border border-[#222222] rounded-xl text-[#888888] hover:text-white transition-colors">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!weightValid}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#00FF87] text-black font-bold py-2.5 rounded-xl hover:bg-[#00FF87]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <motion.div key="s4" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
            {launched ? (
              <div className="bg-[#111111] border border-[#00FF87]/30 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="font-mono text-2xl font-bold text-[#00FF87] mb-2">Your index is live!</h2>
                <p className="text-[#888888] mb-6">Start sharing it to earn fees on every trade.</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => router.push(`/index/${launched}`)} className="flex items-center gap-2 bg-[#00FF87] text-black font-bold px-5 py-2.5 rounded-xl">
                    <ExternalLink size={15} /> View Index
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=I just created the "${name}" creator token index on Bags Index! Check it out: ${process.env.NEXT_PUBLIC_APP_URL}/index/${launched}&hashtags=BagsIndex,Solana`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 border border-[#222222] text-white px-5 py-2.5 rounded-xl hover:border-[#00D4FF] transition-colors"
                  >
                    <Share2 size={15} /> Share
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 space-y-5">
                <div className="bg-[#1A1A1A] rounded-xl p-4">
                  <div className="font-mono font-bold text-lg text-white mb-1">{name}</div>
                  <span className="text-xs text-[#888888]">{category}</span>
                  {description && <p className="text-sm text-[#888888] mt-2">{description}</p>}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#888888] mb-3">Composition</h3>
                  <CompositionChart tokens={selectedTokens} />
                </div>
                <div className="bg-[#00FF87]/5 border border-[#00FF87]/20 rounded-xl p-4">
                  <p className="text-sm text-[#00FF87] font-mono">💰 You earn <strong>0.5%</strong> of every trade on this index. Forever.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="flex items-center gap-2 px-4 py-2.5 border border-[#222222] rounded-xl text-[#888888] hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleLaunch}
                    disabled={launching}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#00FF87] text-black font-bold py-2.5 rounded-xl hover:bg-[#00FF87]/90 disabled:opacity-60 transition-all"
                  >
                    {launching ? <><Loader2 size={16} className="animate-spin" /> Deploying...</> : 'Launch Index 🚀'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CreatePage() {
  return <Suspense><CreateContent /></Suspense>
}

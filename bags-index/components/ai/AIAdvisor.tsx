'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CompositionChart from '@/components/create/CompositionChart'
import { useCreateStore } from '@/store/createStore'
import type { AIMessage, TokenInIndex, IndexCategory } from '@/types'
import { TOKEN_COLORS } from '@/lib/utils'
import { MOCK_TOKENS } from '@/lib/bags'

const SUGGESTED_PROMPTS = [
  'Build me an AI creators index',
  'I want low-risk diversified exposure',
  'What are the trending dev tokens?',
  'High-risk high-reward meme basket',
]

export default function AIAdvisor() {
  const router = useRouter()
  const { setName, setCategory, setStep } = useCreateStore()
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestedIndex, setSuggestedIndex] = useState<AIMessage['suggestedIndex'] | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return
    const userMsg: AIMessage = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      const aiMsg: AIMessage = {
        role: 'assistant',
        content: data.message || data.error || 'Sorry, something went wrong.',
        suggestedIndex: data.suggestedIndex,
      }
      setMessages(prev => [...prev, aiMsg])
      if (data.suggestedIndex) setSuggestedIndex(data.suggestedIndex)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  function buildThisIndex() {
    if (!suggestedIndex) return
    setName(suggestedIndex.name)
    if (suggestedIndex.category) setCategory(suggestedIndex.category as IndexCategory)
    setStep(2)
    router.push('/create')
  }

  // Build preview tokens from suggestion
  const previewTokens: TokenInIndex[] = suggestedIndex?.tokens.map(t => {
    const found = MOCK_TOKENS.find(m => m.symbol === t.symbol)
    return {
      mint: found?.mint ?? t.symbol,
      symbol: t.symbol,
      name: found?.name ?? t.symbol,
      weight: t.weight,
      icon_url: found?.icon_url ?? '',
    }
  }) ?? []

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden" style={{ minHeight: 500 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-[#00FF87]" />
            <h2 className="font-mono font-bold text-white">AI Index Advisor</h2>
          </div>
          <span className="text-xs bg-[#00FF87]/10 text-[#00FF87] border border-[#00FF87]/20 px-2.5 py-1 rounded-full">
            Powered by Groq
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot size={40} className="text-[#00FF87] mx-auto mb-3" />
              <p className="text-[#888888] text-sm mb-5">Ask me to build a creator token index tailored to your goals.</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="px-3 py-1.5 bg-[#1A1A1A] border border-[#222222] rounded-full text-sm text-[#888888] hover:border-[#00FF87]/50 hover:text-white transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#00FF87]/20' : 'bg-[#1A1A1A] border border-[#222222]'}`}>
                  {msg.role === 'user' ? <User size={14} className="text-[#00FF87]" /> : <Bot size={14} className="text-[#00FF87]" />}
                </div>
                <div className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#00FF87]/15 text-white ml-auto' : 'bg-[#1A1A1A] text-white'}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#222222] flex items-center justify-center">
                <Bot size={14} className="text-[#00FF87]" />
              </div>
              <div className="bg-[#1A1A1A] px-4 py-3 rounded-xl flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 bg-[#00FF87] rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-[#222222]">
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to build an index..."
              rows={1}
              disabled={loading}
              className="flex-1 bg-[#1A1A1A] border border-[#222222] rounded-xl px-4 py-3 text-sm text-white placeholder-[#888888] focus:outline-none focus:border-[#00FF87] resize-none transition-colors disabled:opacity-50"
              style={{ maxHeight: 120 }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="p-3 bg-[#00FF87] text-black rounded-xl hover:bg-[#00FF87]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <AnimatePresence>
        {suggestedIndex && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="lg:w-72 shrink-0"
          >
            <div className="bg-[#111111] border border-[#00FF87]/20 rounded-2xl p-5 sticky top-24">
              <div className="text-xs text-[#00FF87] font-medium mb-3 uppercase tracking-wider">Suggested Index</div>
              <h3 className="font-mono font-bold text-white mb-1">{suggestedIndex.name}</h3>
              {suggestedIndex.category && (
                <span className="text-xs text-[#888888] bg-[#1A1A1A] px-2 py-0.5 rounded-full">{suggestedIndex.category}</span>
              )}
              <div className="my-4">
                <CompositionChart tokens={previewTokens} />
              </div>
              <div className="space-y-2 mb-5">
                {suggestedIndex.tokens.map((t, i) => (
                  <div key={t.symbol} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: TOKEN_COLORS[i % TOKEN_COLORS.length] }} />
                    <span className="font-mono text-white">{t.symbol}</span>
                    <span className="ml-auto text-[#888888]">{t.weight}%</span>
                  </div>
                ))}
              </div>
              <button
                onClick={buildThisIndex}
                className="w-full flex items-center justify-center gap-2 bg-[#00FF87] text-black font-bold py-2.5 rounded-xl hover:bg-[#00FF87]/90 transition-all text-sm"
              >
                Build This Index <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

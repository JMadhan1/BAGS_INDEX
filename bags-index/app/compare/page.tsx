'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Suspense } from 'react'
import { BarChart2, Users, TrendingUp, TrendingDown, Plus, X, GitCompare } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import TokenIcon from '@/components/shared/TokenIcon'
import { formatUSD, truncateWallet, getCategoryColor, TOKEN_COLORS } from '@/lib/utils'
import type { Index } from '@/types'

async function fetchIndexes(): Promise<{ indexes: Index[] }> {
  const res = await fetch('/api/indexes?limit=20&sortBy=volume')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

function generateChartData(perf: number) {
  let v = 0
  return Array.from({ length: 8 }, (_, i) => {
    v += (Math.random() - 0.45) * (Math.abs(perf) / 7 + 1)
    return { d: `D${i + 1}`, v: parseFloat(v.toFixed(2)) }
  })
}

const COLORS = ['#00FF87', '#00D4FF', '#FF6B6B']

function CompareContent() {
  const [selected, setSelected] = useState<string[]>([])
  const { data, isLoading } = useQuery({ queryKey: ['compare-indexes'], queryFn: fetchIndexes })

  const indexes = data?.indexes ?? []
  const selectedIndexes = selected.map(id => indexes.find(i => i.id === id)).filter(Boolean) as Index[]

  function toggle(id: string) {
    if (selected.includes(id)) {
      setSelected(s => s.filter(x => x !== id))
    } else if (selected.length < 3) {
      setSelected(s => [...s, id])
    }
  }

  const chartData = useMemo(() => selectedIndexes.map(idx => ({
    id: idx.id,
    name: idx.name.length > 15 ? idx.name.slice(0, 15) + '…' : idx.name,
    data: generateChartData(idx.performance_7d),
  })), [selected.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  // Merge into single array for recharts
  const mergedChart = useMemo(() => Array.from({ length: 8 }, (_, i) => {
    const point: Record<string, number | string> = { d: `D${i + 1}` }
    chartData.forEach(cd => { point[cd.id] = cd.data[i]?.v ?? 0 })
    return point
  }), [chartData])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-sm px-4 py-1.5 rounded-full mb-4">
            <GitCompare size={14} /> Index Comparison
          </div>
          <h1 className="font-mono text-3xl font-bold text-white mb-2">Compare Indexes</h1>
          <p className="text-[#888888]">Select up to 3 indexes to compare performance, fees, and composition side by side.</p>
        </div>

        {/* Picker */}
        <div className="mb-6">
          <p className="text-xs text-[#888888] mb-3 font-medium">{selected.length}/3 selected · click to toggle</p>
          <div className="flex flex-wrap gap-2">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-9 w-32 bg-[#111111] rounded-full animate-pulse" />)
              : indexes.map(idx => {
                  const isOn = selected.includes(idx.id)
                  const colorIdx = selected.indexOf(idx.id)
                  return (
                    <button
                      key={idx.id}
                      onClick={() => toggle(idx.id)}
                      disabled={!isOn && selected.length >= 3}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all disabled:opacity-40 ${
                        isOn ? 'text-black font-bold' : 'border-[#333333] text-[#888888] hover:border-[#555] hover:text-white bg-[#111111]'
                      }`}
                      style={isOn ? { background: COLORS[colorIdx], borderColor: COLORS[colorIdx] } : {}}
                    >
                      {isOn && <X size={10} />}
                      {!isOn && <Plus size={10} />}
                      {idx.name.length > 18 ? idx.name.slice(0, 18) + '…' : idx.name}
                    </button>
                  )
                })}
          </div>
        </div>

        {selectedIndexes.length === 0 ? (
          <div className="text-center py-20 text-[#555555]">
            <GitCompare size={40} className="mx-auto mb-3 opacity-30" />
            Select at least one index above to start comparing.
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={selected.join()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Performance Chart */}
              <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
                <h3 className="font-mono font-bold text-white mb-4">7-Day Performance Comparison</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={mergedChart}>
                    <defs>
                      {selectedIndexes.map((idx, i) => (
                        <linearGradient key={idx.id} id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis dataKey="d" tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip contentStyle={{ background: '#111111', border: '1px solid #222222', borderRadius: 8, fontSize: 12 }} formatter={(v, name) => [`${Number(v).toFixed(2)}%`, String(name).slice(0, 20)]} />
                    {selectedIndexes.map((idx, i) => (
                      <Area key={idx.id} type="monotone" dataKey={idx.id} stroke={COLORS[i]} strokeWidth={2} fill={`url(#g${i})`} dot={false} name={idx.name} />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-6 mt-3">
                  {selectedIndexes.map((idx, i) => (
                    <span key={idx.id} className="flex items-center gap-1.5 text-xs text-[#888888]">
                      <span className="w-3 h-0.5 rounded inline-block" style={{ background: COLORS[i] }} />
                      {idx.name.slice(0, 18)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Side-by-side stats */}
              <div className={`grid gap-4 grid-cols-1 ${selectedIndexes.length === 2 ? 'sm:grid-cols-2' : ''} ${selectedIndexes.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
                {selectedIndexes.map((idx, colorIdx) => {
                  const isPositive = idx.performance_7d >= 0
                  return (
                    <motion.div key={idx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: colorIdx * 0.1 }}
                      className="bg-[#111111] border rounded-xl overflow-hidden"
                      style={{ borderColor: `${COLORS[colorIdx]}30` }}
                    >
                      {/* Color stripe */}
                      <div className="h-1" style={{ background: COLORS[colorIdx] }} />
                      <div className="p-5">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getCategoryColor(idx.category)}`}>{idx.category}</span>
                        <h3 className="font-mono font-bold text-white mt-2 mb-1">{idx.name}</h3>
                        <p className="text-xs text-[#888888] mb-4">by {truncateWallet(idx.creator_wallet)}</p>

                        {/* Metrics */}
                        <div className="space-y-2 mb-4">
                          {[
                            { label: '7d Performance', value: `${isPositive ? '+' : ''}${idx.performance_7d.toFixed(1)}%`, positive: isPositive, icon: isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} /> },
                            { label: 'Total Volume', value: formatUSD(idx.total_volume_usd), positive: null, icon: <BarChart2 size={11} /> },
                            { label: 'Fees Earned', value: formatUSD(idx.total_fees_earned), positive: true, icon: null },
                            { label: 'Holders', value: idx.holder_count.toString(), positive: null, icon: <Users size={11} /> },
                          ].map(m => (
                            <div key={m.label} className="flex items-center justify-between text-xs">
                              <span className="text-[#888888] flex items-center gap-1">{m.icon}{m.label}</span>
                              <span className={`font-mono font-medium ${m.positive === true ? 'text-[#00FF87]' : m.positive === false ? 'text-[#FF4444]' : 'text-white'}`}>
                                {m.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Composition donut */}
                        <div className="flex items-center gap-3">
                          <PieChart width={64} height={64}>
                            <Pie data={idx.tokens} dataKey="weight" cx="50%" cy="50%" innerRadius={18} outerRadius={30} isAnimationActive>
                              {idx.tokens.map((_, i) => <Cell key={i} fill={TOKEN_COLORS[i % TOKEN_COLORS.length]} strokeWidth={0} />)}
                            </Pie>
                          </PieChart>
                          <div className="flex-1 space-y-1">
                            {idx.tokens.slice(0, 3).map((t, i) => (
                              <div key={t.mint} className="flex items-center gap-1.5 text-[10px]">
                                <TokenIcon src={t.icon_url} symbol={t.symbol} size={14} />
                                <span className="text-[#888888]">{t.symbol}</span>
                                <span className="ml-auto font-mono text-white">{t.weight}%</span>
                              </div>
                            ))}
                            {idx.tokens.length > 3 && <div className="text-[10px] text-[#555555]">+{idx.tokens.length - 3} more</div>}
                          </div>
                        </div>

                        <Link href={`/index/${idx.id}`} className="mt-4 block w-full text-center py-2 rounded-lg border text-xs font-medium transition-all hover:bg-opacity-10"
                          style={{ borderColor: `${COLORS[colorIdx]}50`, color: COLORS[colorIdx] }}>
                          Buy This Index →
                        </Link>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  )
}

export default function ComparePage() {
  return <Suspense><CompareContent /></Suspense>
}

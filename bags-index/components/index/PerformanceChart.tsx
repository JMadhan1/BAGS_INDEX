'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

function generateComparisonData(days: number, indexPerf: number) {
  const data = []
  let indexVal = 0
  let solVal = 0
  const now = Date.now()
  const solDrift = indexPerf * 0.4
  for (let i = days; i >= 0; i--) {
    indexVal += (Math.random() - 0.45) * (Math.abs(indexPerf) / days + 1)
    solVal += (Math.random() - 0.47) * (Math.abs(solDrift) / days + 0.8)
    data.push({
      date: new Date(now - i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      index: parseFloat(indexVal.toFixed(2)),
      sol: parseFloat(solVal.toFixed(2)),
    })
  }
  // Normalize end values to match performance7d
  const endIndex = data[data.length - 1].index
  const scale = indexPerf / (endIndex || 1)
  return data.map(d => ({ ...d, index: parseFloat((d.index * scale).toFixed(2)) }))
}

const RANGES = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
]

export default function PerformanceChart({ performance7d }: { performance7d: number }) {
  const [range, setRange] = useState('7d')
  const [showSol, setShowSol] = useState(true)
  const [data, setData] = useState<{ date: string; index: number; sol: number }[]>([])
  const days = RANGES.find(r => r.label === range)?.days ?? 7

  useEffect(() => {
    setData(generateComparisonData(days, performance7d))
  }, [days, performance7d])

  const isPositive = performance7d >= 0
  const color = isPositive ? '#00FF87' : '#FF4444'
  const endIndex = data[data.length - 1]?.index ?? 0
  const endSol = data[data.length - 1]?.sol ?? 0
  const alpha = endIndex - endSol

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-mono font-bold text-white">Performance</h3>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button
              key={r.label}
              onClick={() => setRange(r.label)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${range === r.label ? 'bg-[#00FF87]/10 text-[#00FF87]' : 'text-[#888888] hover:text-white'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alpha Badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex items-center gap-1.5 text-sm font-mono font-bold ${isPositive ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
          <TrendingUp size={13} />
          {isPositive ? '+' : ''}{performance7d.toFixed(1)}% Index
        </div>
        <div className="text-xs text-[#888888]">vs SOL {endSol >= 0 ? '+' : ''}{endSol.toFixed(1)}%</div>
        <div className={`text-xs font-mono px-2 py-0.5 rounded-full border ${alpha >= 0 ? 'text-[#00FF87] bg-[#00FF87]/10 border-[#00FF87]/20' : 'text-[#FF4444] bg-[#FF4444]/10 border-[#FF4444]/20'}`}>
          {alpha >= 0 ? '+' : ''}{alpha.toFixed(1)}% alpha
        </div>
        <button
          onClick={() => setShowSol(s => !s)}
          className={`ml-auto text-xs px-2 py-0.5 rounded-full border transition-colors ${showSol ? 'text-[#888888] border-[#333333]' : 'text-[#555555] border-[#222222]'}`}
        >
          {showSol ? '− Hide SOL' : '+ vs SOL'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradIndex" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradSol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#888888" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#888888" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip
            contentStyle={{ background: '#111111', border: '1px solid #222222', borderRadius: 8, fontSize: 12 }}
            formatter={(v, name) => [`${Number(v).toFixed(2)}%`, name === 'index' ? 'This Index' : 'SOL']}
          />
          <Area type="monotone" dataKey="index" stroke={color} strokeWidth={2} fill="url(#gradIndex)" dot={false} name="index" />
          {showSol && <Area type="monotone" dataKey="sol" stroke="#555555" strokeWidth={1.5} fill="url(#gradSol)" dot={false} name="sol" strokeDasharray="4 2" />}
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-2 text-xs text-[#888888]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: color }} />This Index</span>
        {showSol && <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[#555555]" />SOL</span>}
      </div>
    </div>
  )
}

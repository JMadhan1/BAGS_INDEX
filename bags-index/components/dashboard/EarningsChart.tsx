'use client'

import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function generateData(days: number) {
  const data = []
  const now = Date.now()
  let base = 10
  for (let i = days; i >= 0; i--) {
    base += Math.random() * 8 - 1
    data.push({
      date: new Date(now - i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fees: parseFloat((Math.max(0, base)).toFixed(2)),
    })
  }
  return data
}

const RANGES = [{ label: '7d', days: 7 }, { label: '30d', days: 30 }, { label: 'All', days: 90 }]

export default function EarningsChart() {
  const [range, setRange] = useState('7d')
  const days = RANGES.find(r => r.label === range)?.days ?? 7
  const data = generateData(days)

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono font-bold text-white">Daily Earnings</h3>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button key={r.label} onClick={() => setRange(r.label)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${range === r.label ? 'bg-[#00FF87]/10 text-[#00FF87]' : 'text-[#888888] hover:text-white'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF87" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00FF87" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#888888', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
          <Tooltip contentStyle={{ background: '#111111', border: '1px solid #222222', borderRadius: 8, fontSize: 12 }}
            formatter={(v) => [`$${v}`, 'Fees']} />
          <Area type="monotone" dataKey="fees" stroke="#00FF87" strokeWidth={2} fill="url(#earningsGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

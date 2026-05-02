'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { TokenInIndex } from '@/types'
import { TOKEN_COLORS } from '@/lib/utils'

interface CompositionChartProps {
  tokens: TokenInIndex[]
}

export default function CompositionChart({ tokens }: CompositionChartProps) {
  const data = tokens.filter(t => t.weight > 0).map(t => ({ name: t.symbol, value: t.weight }))
  if (!data.length) return null

  return (
    <div className="bg-[#1A1A1A] border border-[#222222] rounded-xl p-5">
      <h3 className="text-sm font-medium text-[#888888] mb-4">Live Preview</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" isAnimationActive>
            {data.map((_, i) => (
              <Cell key={i} fill={TOKEN_COLORS[i % TOKEN_COLORS.length]} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#111111', border: '1px solid #222222', borderRadius: 8, fontSize: 12 }}
            formatter={(v) => [`${v}%`]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1 mt-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: TOKEN_COLORS[i % TOKEN_COLORS.length] }} />
              <span className="text-white font-mono">{item.name}</span>
            </div>
            <span className="text-[#888888]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

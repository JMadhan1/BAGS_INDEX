import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  change?: string
  icon?: ReactNode
}

export default function StatCard({ label, value, change, icon }: StatCardProps) {
  const isPositive = change?.startsWith('+')
  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 hover:border-[#333333] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#888888] text-sm">{label}</span>
        {icon && <span className="text-[#888888]">{icon}</span>}
      </div>
      <div className="font-mono font-bold text-2xl text-white">{value}</div>
      {change && (
        <div className={`text-sm mt-1 font-medium ${isPositive ? 'text-[#00FF87]' : 'text-[#FF4444]'}`}>
          {change}
        </div>
      )}
    </div>
  )
}

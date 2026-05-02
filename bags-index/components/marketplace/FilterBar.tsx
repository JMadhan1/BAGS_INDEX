'use client'

import { ChevronDown } from 'lucide-react'
import type { IndexCategory } from '@/types'

const CATEGORIES: Array<IndexCategory | 'All'> = ['All', 'AI Creators', 'Dev Builders', 'Gaming', 'Art', 'Meme', 'Other']
const SORTS = [
  { value: 'volume', label: 'Top Volume' },
  { value: 'newest', label: 'Newest' },
  { value: 'holders', label: 'Most Holders' },
]

interface FilterBarProps {
  category: string
  sortBy: string
  onCategory: (c: string) => void
  onSort: (s: string) => void
}

export default function FilterBar({ category, sortBy, onCategory, onSort }: FilterBarProps) {
  return (
    <div className="sticky top-16 z-40 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#222222] py-3">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => onCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === c
                  ? 'bg-[#00FF87] text-black'
                  : 'bg-[#111111] text-[#888888] border border-[#222222] hover:border-[#333333] hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => onSort(e.target.value)}
            className="appearance-none bg-[#111111] border border-[#222222] text-white text-sm rounded-lg px-4 py-1.5 pr-8 cursor-pointer focus:outline-none focus:border-[#00FF87] transition-colors"
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" />
        </div>
      </div>
    </div>
  )
}

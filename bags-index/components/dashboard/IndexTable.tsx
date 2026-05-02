'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Share2, ExternalLink, RefreshCw } from 'lucide-react'
import TokenIcon from '@/components/shared/TokenIcon'
import RebalanceModal from '@/components/shared/RebalanceModal'
import type { Index } from '@/types'
import { formatUSD } from '@/lib/utils'

export default function IndexTable({ indexes, creatorWallet }: { indexes: Index[]; creatorWallet?: string }) {
  const [rebalancing, setRebalancing] = useState<Index | null>(null)

  if (!indexes.length) {
    return (
      <div className="bg-[#111111] border border-[#222222] rounded-xl p-8 text-center">
        <p className="text-[#888888] mb-3">You have not created any indexes yet.</p>
        <Link href="/create" className="text-[#00FF87] font-medium hover:underline">Create your first index →</Link>
      </div>
    )
  }

  return (
    <>
    {rebalancing && (
      <RebalanceModal
        index={rebalancing}
        creatorWallet={creatorWallet ?? ''}
        onClose={() => setRebalancing(null)}
      />
    )}
    <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#222222] text-[#888888]">
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Tokens</th>
              <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Holders</th>
              <th className="text-right px-4 py-3 font-medium">Total Fees</th>
              <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Status</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {indexes.map(index => (
              <tr key={index.id} className="border-b border-[#1A1A1A] hover:bg-[#111111]/80 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-mono font-bold text-white">{index.name}</div>
                  <div className="text-xs text-[#888888]">{index.category}</div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-0.5">
                    {index.tokens.slice(0, 4).map((t, i) => (
                      <div key={t.mint} style={{ marginLeft: i > 0 ? -6 : 0, zIndex: 4 - i }}>
                        <TokenIcon src={t.icon_url} symbol={t.symbol} size={22} />
                      </div>
                    ))}
                    {index.tokens.length > 4 && (
                      <span className="text-xs text-[#888888] ml-1">+{index.tokens.length - 4}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-white hidden sm:table-cell">{index.holder_count}</td>
                <td className="px-4 py-3 text-right font-mono text-[#00FF87]">{formatUSD(index.total_fees_earned)}</td>
                <td className="px-4 py-3 text-right hidden sm:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${index.is_active ? 'bg-[#00FF87]/10 text-[#00FF87]' : 'bg-[#888888]/10 text-[#888888]'}`}>
                    {index.is_active ? 'Active' : 'Paused'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setRebalancing(index)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[#222222] text-xs text-[#888888] hover:text-orange-400 hover:border-orange-400/30 transition-colors"
                      title="Rebalance"
                    >
                      <RefreshCw size={11} /> Rebalance
                    </button>
                    <Link href={`/index/${index.id}`} className="p-1.5 rounded-lg border border-[#222222] text-[#888888] hover:text-white hover:border-[#333333] transition-colors">
                      <ExternalLink size={13} />
                    </Link>
                    <a
                      href={`https://twitter.com/intent/tweet?text=Check out my "${index.name}" creator token index on @bagsfm! ${process.env.NEXT_PUBLIC_APP_URL}/index/${index.id}`}
                      target="_blank" rel="noreferrer"
                      className="p-1.5 rounded-lg border border-[#222222] text-[#888888] hover:text-[#00D4FF] hover:border-[#00D4FF]/30 transition-colors"
                    >
                      <Share2 size={13} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>)
}

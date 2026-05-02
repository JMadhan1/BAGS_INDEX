import { truncateWallet, formatUSD } from '@/lib/utils'
import type { Holding } from '@/types'

export default function HoldersList({ holders }: { holders: Holding[] }) {
  if (!holders.length) return <p className="text-[#888888] text-sm">No holders yet. Be the first!</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[#888888] border-b border-[#222222]">
            <th className="text-left py-2 pr-4 font-medium">Wallet</th>
            <th className="text-right py-2 pr-4 font-medium">Invested</th>
            <th className="text-right py-2 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {holders.map((h) => (
            <tr key={h.id} className="border-b border-[#111111] hover:bg-[#111111]/50 transition-colors">
              <td className="py-2.5 pr-4 font-mono text-white">{truncateWallet(h.wallet)}</td>
              <td className="py-2.5 pr-4 text-right text-[#00FF87] font-mono">{formatUSD(h.amount_usd)}</td>
              <td className="py-2.5 text-right text-[#888888]">{new Date(h.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

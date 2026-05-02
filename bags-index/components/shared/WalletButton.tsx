'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useState, useRef, useEffect } from 'react'
import { Copy, LogOut, ChevronDown } from 'lucide-react'
import { truncateWallet } from '@/lib/utils'

export default function WalletButton() {
  const { connected, publicKey, disconnect, connecting } = useWallet()
  const { setVisible } = useWalletModal()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!connected) {
    return (
      <button
        onClick={() => setVisible(true)}
        disabled={connecting}
        className="px-4 py-2 rounded-lg border border-[#00FF87] text-[#00FF87] text-sm font-medium hover:bg-[#00FF87]/10 transition-all disabled:opacity-50"
      >
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#222222] text-sm font-medium hover:border-[#00FF87] transition-all"
      >
        <span className="w-2 h-2 bg-[#00FF87] rounded-full" />
        <span className="font-mono">{truncateWallet(publicKey?.toBase58() || '')}</span>
        <ChevronDown size={14} className="text-[#888888]" />
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#111111] border border-[#222222] rounded-xl p-2 shadow-xl z-50">
          <button
            onClick={() => { navigator.clipboard.writeText(publicKey?.toBase58() || ''); setDropdownOpen(false) }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#888888] hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <Copy size={14} />
            Copy Address
          </button>
          <button
            onClick={() => { disconnect(); setDropdownOpen(false) }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#FF4444] hover:bg-[#FF4444]/10 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}

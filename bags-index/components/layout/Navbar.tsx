'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import WalletButton from '@/components/shared/WalletButton'

const links = [
  { href: '/', label: 'Marketplace' },
  { href: '/create', label: 'Create Index' },
  { href: '/compare', label: 'Compare' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leaderboard', label: '🏆 Leaderboard' },
  { href: '/ai-advisor', label: 'AI Advisor' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-[#222222] bg-[#0A0A0A]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)} className="font-mono font-bold text-xl text-[#00FF87] tracking-tight hover:opacity-80 transition-opacity">
          BAGS INDEX
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href
                  ? 'text-[#00FF87] bg-[#00FF87]/10'
                  : 'text-[#888888] hover:text-white hover:bg-[#111111]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <WalletButton />
          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden p-2 rounded-lg text-[#888888] hover:text-white hover:bg-[#111111] transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[#1A1A1A] bg-[#0A0A0A] px-4 py-3 flex flex-col gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href
                  ? 'text-[#00FF87] bg-[#00FF87]/10'
                  : 'text-[#888888] hover:text-white hover:bg-[#111111]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

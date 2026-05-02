'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { X, Wallet } from 'lucide-react'

interface WalletModalProps {
  onClose: () => void
  onPick: (name: string) => void
}

export default function WalletModal({ onClose, onPick }: WalletModalProps) {
  const { wallets } = useWallet()

  const installedWallets = wallets.filter(w => w.readyState === 'Installed')

  function pickWallet(name: string) {
    onPick(name)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#111111] border border-[#222222] rounded-2xl p-6 w-80 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-base">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {installedWallets.length === 0 ? (
          <div className="text-center py-2">
            <Wallet size={36} className="mx-auto text-[#444444] mb-3" />
            <p className="text-[#888888] text-sm mb-4">No Solana wallet detected. Install one:</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://phantom.app"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white text-sm font-medium transition-colors"
              >
                👻 Phantom
              </a>
              <a
                href="https://trustwallet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white text-sm font-medium transition-colors"
              >
                🛡️ Trust Wallet
              </a>
              <a
                href="https://solflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-white text-sm font-medium transition-colors"
              >
                🔆 Solflare
              </a>
            </div>
            <p className="text-[#444444] text-xs mt-4">MetaMask is Ethereum only — not compatible with Solana.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {installedWallets.map(w => (
              <button
                key={w.adapter.name}
                onClick={() => pickWallet(w.adapter.name)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] transition-colors text-white text-sm font-medium w-full"
              >
                {w.adapter.icon
                  ? <img src={w.adapter.icon} alt={w.adapter.name} className="w-6 h-6 rounded-md" width={24} height={24} />
                  : <Wallet size={20} className="text-[#888888]" />
                }
                {w.adapter.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

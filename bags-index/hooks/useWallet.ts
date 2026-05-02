import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
import { truncateWallet } from '@/lib/utils'

export function useWallet() {
  const wallet = useSolanaWallet()
  return {
    ...wallet,
    address: wallet.publicKey?.toBase58(),
    shortAddress: wallet.publicKey ? truncateWallet(wallet.publicKey.toBase58()) : null,
  }
}

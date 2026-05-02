import { useMutation, useQueryClient } from '@tanstack/react-query'
import { executeIndexBuy } from '@/lib/bags'
import type { TokenInIndex } from '@/types'

interface TradeParams {
  indexId: string
  buyerWallet: string
  tokens: TokenInIndex[]
  totalSOL: number
  amountUSD: number
}

export function useTrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ indexId, buyerWallet, tokens, totalSOL, amountUSD }: TradeParams) => {
      const { txSignatures } = await executeIndexBuy(buyerWallet, tokens, totalSOL)
      await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index_id: indexId,
          buyer_wallet: buyerWallet,
          amount_usd: amountUSD,
          tx_signature: txSignatures[0],
          tokens_bought: tokens,
        }),
      })
      return txSignatures
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['index', vars.indexId] })
    },
  })
}

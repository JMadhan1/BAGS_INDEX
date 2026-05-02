import { useQuery } from '@tanstack/react-query'
import type { CreatorStats } from '@/types'

export function useFees(wallet: string | undefined) {
  return useQuery<CreatorStats>({
    queryKey: ['fees', wallet],
    queryFn: async () => {
      const res = await fetch(`/api/fees?wallet=${wallet}`)
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    enabled: !!wallet,
  })
}

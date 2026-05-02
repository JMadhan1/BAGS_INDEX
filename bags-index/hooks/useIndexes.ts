import { useQuery } from '@tanstack/react-query'
import type { Index, GlobalStats } from '@/types'

interface IndexesResponse {
  indexes: Index[]
  total: number
  stats: GlobalStats
}

export function useIndexes(category = 'All', sortBy = 'volume', limit = 20) {
  return useQuery<IndexesResponse>({
    queryKey: ['indexes', category, sortBy, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ sortBy, limit: String(limit) })
      if (category !== 'All') params.set('category', category)
      const res = await fetch(`/api/indexes?${params}`)
      if (!res.ok) throw new Error('Failed to fetch indexes')
      return res.json()
    },
  })
}

export function useIndex(id: string) {
  return useQuery({
    queryKey: ['index', id],
    queryFn: async () => {
      const res = await fetch(`/api/indexes/${id}`)
      if (!res.ok) throw new Error('Not found')
      return res.json()
    },
    enabled: !!id,
  })
}

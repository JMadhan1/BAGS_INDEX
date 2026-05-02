import { createClient } from '@supabase/supabase-js'
import type { Index, Trade, CreatorStats, GlobalStats } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder_key'

const isConfigured = !!(supabaseUrl && supabaseUrl.startsWith('https://') && !supabaseUrl.includes('your_supabase'))

// Only create real client when URL is valid; otherwise use a no-op proxy
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', supabaseAnonKey)

// Mock data for when Supabase is not configured
import { MOCK_INDEXES } from './mockData'

export async function createIndex(data: Partial<Index>): Promise<Index> {
  if (!isConfigured) {
    const mock = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Index
    return mock
  }
  const { data: result, error } = await supabase.from('indexes').insert(data).select().single()
  if (error) {
    console.error('[Supabase createIndex error]', error.message, error.details)
    const mock = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Index
    return mock
  }
  return result
}

export async function getIndexes(filters?: { category?: string; sortBy?: string; limit?: number }): Promise<Index[]> {
  if (!isConfigured) {
    let items = [...MOCK_INDEXES]
    if (filters?.category && filters.category !== 'All') {
      items = items.filter(i => i.category === filters.category)
    }
    if (filters?.sortBy === 'newest') items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (filters?.sortBy === 'holders') items.sort((a, b) => b.holder_count - a.holder_count)
    else if (filters?.sortBy === 'fees') items.sort((a, b) => b.total_fees_earned - a.total_fees_earned)
    else items.sort((a, b) => b.total_volume_usd - a.total_volume_usd)
    return items.slice(0, filters?.limit ?? 20)
  }

  let query = supabase.from('indexes').select('*').eq('is_active', true)
  if (filters?.category && filters.category !== 'All') query = query.eq('category', filters.category)
  if (filters?.sortBy === 'newest') query = query.order('created_at', { ascending: false })
  else if (filters?.sortBy === 'holders') query = query.order('holder_count', { ascending: false })
  else if (filters?.sortBy === 'fees') query = query.order('total_fees_earned', { ascending: false })
  else query = query.order('total_volume_usd', { ascending: false })
  query = query.limit(filters?.limit ?? 20)

  const { data, error } = await query
  if (error) {
    console.error('[Supabase getIndexes error]', error.message, error.details)
    let items = [...MOCK_INDEXES]
    if (filters?.category && filters.category !== 'All') items = items.filter(i => i.category === filters.category)
    if (filters?.sortBy === 'newest') items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (filters?.sortBy === 'holders') items.sort((a, b) => b.holder_count - a.holder_count)
    else if (filters?.sortBy === 'fees') items.sort((a, b) => b.total_fees_earned - a.total_fees_earned)
    else items.sort((a, b) => b.total_volume_usd - a.total_volume_usd)
    return items.slice(0, filters?.limit ?? 20)
  }
  return data || []
}

export async function getIndexById(id: string): Promise<Index | null> {
  if (!isConfigured) {
    return MOCK_INDEXES.find(i => i.id === id) || MOCK_INDEXES[0]
  }
  const { data, error } = await supabase.from('indexes').select('*').eq('id', id).single()
  if (error) {
    console.error('[Supabase getIndexById error]', error.message)
    return MOCK_INDEXES.find(i => i.id === id) || MOCK_INDEXES[0]
  }
  return data
}

export async function recordTrade(trade: Partial<Trade>): Promise<Trade> {
  if (!isConfigured) {
    return { ...trade, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Trade
  }
  const { data, error } = await supabase.from('trades').insert(trade).select().single()
  if (error) throw error
  return data
}

export async function getCreatorStats(wallet: string): Promise<CreatorStats> {
  if (!isConfigured) {
    const indexes = MOCK_INDEXES.filter(i => i.creator_wallet === wallet)
    return {
      total_fees_earned: indexes.reduce((s, i) => s + i.total_fees_earned, 0),
      total_volume: indexes.reduce((s, i) => s + i.total_volume_usd, 0),
      index_count: indexes.length,
      total_holders: indexes.reduce((s, i) => s + i.holder_count, 0),
      indexes,
      recent_trades: [],
    }
  }
  const { data: indexes } = await supabase.from('indexes').select('*').eq('creator_wallet', wallet)
  const indexIds = (indexes || []).map(i => i.id)
  const { data: trades } = indexIds.length
    ? await supabase.from('trades').select('*').in('index_id', indexIds).order('created_at', { ascending: false }).limit(20)
    : { data: [] }

  return {
    total_fees_earned: (indexes || []).reduce((s: number, i: Index) => s + Number(i.total_fees_earned), 0),
    total_volume: (indexes || []).reduce((s: number, i: Index) => s + Number(i.total_volume_usd), 0),
    index_count: (indexes || []).length,
    total_holders: (indexes || []).reduce((s: number, i: Index) => s + Number(i.holder_count), 0),
    indexes: indexes || [],
    recent_trades: trades || [],
  }
}

export async function getGlobalStats(): Promise<GlobalStats> {
  if (!isConfigured) {
    return {
      totalVolume: MOCK_INDEXES.reduce((s, i) => s + i.total_volume_usd, 0),
      activeCount: MOCK_INDEXES.length,
      creatorCount: new Set(MOCK_INDEXES.map(i => i.creator_wallet)).size,
      feesDistributed: MOCK_INDEXES.reduce((s, i) => s + i.total_fees_earned, 0),
    }
  }
  const { data, error: statsError } = await supabase.from('indexes').select('total_volume_usd, total_fees_earned, holder_count, creator_wallet').eq('is_active', true)
  if (!data || statsError) {
    console.error('[Supabase getGlobalStats error]', statsError?.message)
    return {
      totalVolume: MOCK_INDEXES.reduce((s, i) => s + i.total_volume_usd, 0),
      activeCount: MOCK_INDEXES.length,
      creatorCount: new Set(MOCK_INDEXES.map(i => i.creator_wallet)).size,
      feesDistributed: MOCK_INDEXES.reduce((s, i) => s + i.total_fees_earned, 0),
    }
  }
  return {
    totalVolume: data.reduce((s, i) => s + Number(i.total_volume_usd), 0),
    activeCount: data.length,
    creatorCount: new Set(data.map(i => i.creator_wallet)).size,
    feesDistributed: data.reduce((s, i) => s + Number(i.total_fees_earned), 0),
  }
}

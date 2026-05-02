import { create } from 'zustand'
import type { TokenInIndex, IndexCategory } from '@/types'

interface CreateState {
  step: number
  name: string
  description: string
  category: IndexCategory | ''
  selectedTokens: TokenInIndex[]
  setStep: (step: number) => void
  setName: (name: string) => void
  setDescription: (desc: string) => void
  setCategory: (cat: IndexCategory) => void
  toggleToken: (token: TokenInIndex) => void
  updateWeight: (mint: string, weight: number) => void
  balanceEqually: () => void
  prefillDemo: () => void
  forkIndex: (index: { name: string; description: string; category: IndexCategory; tokens: TokenInIndex[] }) => void
  reset: () => void
}

const DEMO_TOKENS: TokenInIndex[] = [
  { mint: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', weight: 40, icon_url: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', weight: 35, icon_url: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { mint: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', symbol: 'mSOL', name: 'Marinade SOL', weight: 25, icon_url: 'https://cryptologos.cc/logos/marinade-msol-logo.png' },
]

export const useCreateStore = create<CreateState>((set, get) => ({
  step: 1,
  name: '',
  description: '',
  category: '',
  selectedTokens: [],

  setStep: (step) => set({ step }),
  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setCategory: (category) => set({ category }),

  toggleToken: (token) => {
    const { selectedTokens } = get()
    const exists = selectedTokens.find(t => t.mint === token.mint)
    if (exists) {
      const filtered = selectedTokens.filter(t => t.mint !== token.mint)
      set({ selectedTokens: equalizeWeights(filtered) })
    } else if (selectedTokens.length < 10) {
      const newTokens = [...selectedTokens, { ...token, weight: 0 }]
      set({ selectedTokens: equalizeWeights(newTokens) })
    }
  },

  updateWeight: (mint, weight) => {
    const { selectedTokens } = get()
    set({ selectedTokens: selectedTokens.map(t => t.mint === mint ? { ...t, weight } : t) })
  },

  balanceEqually: () => {
    const { selectedTokens } = get()
    set({ selectedTokens: equalizeWeights(selectedTokens) })
  },

  prefillDemo: () => set({
    name: 'Top AI Builders Index',
    description: 'The most innovative AI and ML creator tokens on Bags. Curated for maximum upside.',
    category: 'AI Creators',
    selectedTokens: DEMO_TOKENS,
    step: 1,
  }),

  forkIndex: (index) => set({
    name: `Fork of ${index.name}`.slice(0, 30),
    description: index.description,
    category: index.category,
    selectedTokens: index.tokens,
    step: 3,
  }),

  reset: () => set({ step: 1, name: '', description: '', category: '', selectedTokens: [] }),
}))

function equalizeWeights(tokens: TokenInIndex[]): TokenInIndex[] {
  if (tokens.length === 0) return tokens
  const base = Math.floor(100 / tokens.length)
  const remainder = 100 - base * tokens.length
  return tokens.map((t, i) => ({ ...t, weight: base + (i === 0 ? remainder : 0) }))
}

export function formatUSD(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`
  return `$${amount.toFixed(2)}`
}

export function formatUSDFull(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatSOL(amount: number): string {
  return `${amount.toFixed(3)} SOL`
}

export function truncateWallet(wallet: string): string {
  if (!wallet || wallet.length < 8) return wallet
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'AI Creators': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'Dev Builders': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'Gaming': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'Art': 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    'Meme': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'Other': 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  }
  return colors[category] || colors['Other']
}

export function getCategoryBg(category: string): string {
  const colors: Record<string, string> = {
    'AI Creators': '#a855f7',
    'Dev Builders': '#3b82f6',
    'Gaming': '#eab308',
    'Art': '#ec4899',
    'Meme': '#f97316',
    'Other': '#6b7280',
  }
  return colors[category] || colors['Other']
}

export function generateGradient(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h1 = Math.abs(hash) % 360
  const h2 = (h1 + 120) % 360
  return `linear-gradient(135deg, hsl(${h1}, 70%, 50%), hsl(${h2}, 70%, 50%))`
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export const TOKEN_COLORS = [
  '#00FF87', '#00D4FF', '#FF6B6B', '#FFD93D', '#C77DFF',
  '#F72585', '#4CC9F0', '#F4A261', '#2EC4B6', '#E76F51',
]

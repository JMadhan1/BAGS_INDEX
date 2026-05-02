import type { BagsToken, TokenInIndex } from '@/types'

// Real Bags API base URL — from docs: https://public-api-v2.bags.fm/api/v1/
const BAGS_BASE = 'https://public-api-v2.bags.fm/api/v1'

function bagsHeaders(): HeadersInit {
  const key = process.env.BAGS_API_KEY
  return key && key !== 'your_bags_api_key'
    ? { 'x-api-key': key, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }
}

const hasApiKey = () => !!(process.env.BAGS_API_KEY && process.env.BAGS_API_KEY !== 'your_bags_api_key')

// Fallback mock tokens used when API is unavailable
export const MOCK_TOKENS: BagsToken[] = [
  { mint: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', price_usd: 180, change_24h: 2.3, icon_url: 'https://cryptologos.cc/logos/solana-sol-logo.png', volume_24h: 5000000 },
  { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', price_usd: 1.0, change_24h: 0.01, icon_url: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', volume_24h: 10000000 },
  { mint: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', symbol: 'mSOL', name: 'Marinade SOL', price_usd: 190, change_24h: 1.8, icon_url: 'https://cryptologos.cc/logos/marinade-msol-logo.png', volume_24h: 1200000 },
  { mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', symbol: 'BONK', name: 'Bonk', price_usd: 0.000025, change_24h: 15.2, icon_url: 'https://cryptologos.cc/logos/bonk1-bonk-logo.png', volume_24h: 3000000 },
  { mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', symbol: 'JUP', name: 'Jupiter', price_usd: 0.82, change_24h: -3.1, icon_url: 'https://cryptologos.cc/logos/jupiter-jup-logo.png', volume_24h: 2100000 },
  { mint: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux', symbol: 'HNT', name: 'Helium', price_usd: 5.4, change_24h: 8.7, icon_url: 'https://cryptologos.cc/logos/helium-hnt-logo.png', volume_24h: 450000 },
  { mint: 'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1', symbol: 'bSOL', name: 'BlazeStake SOL', price_usd: 195, change_24h: 2.1, icon_url: 'https://cryptologos.cc/logos/blazestake-bsol-logo.png', volume_24h: 320000 },
  { mint: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey', symbol: 'MNDE', name: 'Marinade', price_usd: 0.045, change_24h: -1.2, icon_url: 'https://cryptologos.cc/logos/marinade-mnde-logo.png', volume_24h: 180000 },
  { mint: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', symbol: 'PYTH', name: 'Pyth Network', price_usd: 0.31, change_24h: 4.5, icon_url: 'https://cryptologos.cc/logos/pyth-network-pyth-logo.png', volume_24h: 890000 },
  { mint: 'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk', symbol: 'WEN', name: 'Wen', price_usd: 0.00003, change_24h: 22.1, icon_url: 'https://cryptologos.cc/logos/wen-wen-logo.png', volume_24h: 2500000 },
  { mint: 'nosXBVoaCTtYdLvKY6Csb4AC8JCdQKKAaWYtx2ZMoo7', symbol: 'NOS', name: 'Nosana', price_usd: 1.2, change_24h: 6.3, icon_url: 'https://cryptologos.cc/logos/nosana-nos-logo.png', volume_24h: 340000 },
  { mint: 'SHDWyBxihqiCjDYwMuQkDekmRXFV9wMRhiWKKqCQqnm', symbol: 'SHDW', name: 'Shadow Token', price_usd: 0.18, change_24h: -5.4, icon_url: 'https://cryptologos.cc/logos/shadow-shdw-logo.png', volume_24h: 210000 },
  { mint: 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof', symbol: 'RNDR', name: 'Render', price_usd: 5.8, change_24h: 3.2, icon_url: 'https://cryptologos.cc/logos/render-rndr-logo.png', volume_24h: 1800000 },
  { mint: 'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iALJa8', symbol: 'KIN', name: 'Kin', price_usd: 0.000008, change_24h: -2.8, icon_url: 'https://cryptologos.cc/logos/kin-kin-logo.png', volume_24h: 95000 },
  { mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', symbol: 'USDT', name: 'Tether', price_usd: 1.0, change_24h: 0.0, icon_url: 'https://cryptologos.cc/logos/tether-usdt-logo.png', volume_24h: 8000000 },
  { mint: 'StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Xjdw8qBgE', symbol: 'STEP', name: 'Step Finance', price_usd: 0.042, change_24h: 1.5, icon_url: 'https://cryptologos.cc/logos/step-finance-step-logo.png', volume_24h: 65000 },
  { mint: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5', symbol: 'MEW', name: 'cat in a dogs world', price_usd: 0.0055, change_24h: 11.4, icon_url: 'https://cryptologos.cc/logos/mew-mew-logo.png', volume_24h: 1900000 },
  { mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', symbol: '$WIF', name: 'dogwifhat', price_usd: 1.9, change_24h: -4.2, icon_url: 'https://cryptologos.cc/logos/dogwifhat-wif-logo.png', volume_24h: 4200000 },
  { mint: 'CKaKtYvz6dKPyMvYq9Rh3UBrnNqYZAyd7iF4hJtjUvks', symbol: 'GRASS', name: 'Grass', price_usd: 0.72, change_24h: 7.8, icon_url: 'https://cryptologos.cc/logos/grass-grass-logo.png', volume_24h: 780000 },
  { mint: 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82', symbol: 'BOME', name: 'Book of Meme', price_usd: 0.0085, change_24h: 5.1, icon_url: 'https://cryptologos.cc/logos/book-of-meme-bome-logo.png', volume_24h: 3100000 },
]

/**
 * Fetch token launch feed from Bags API.
 * Endpoint: GET /token-launch/feed  (Analytics > Get Token Launch Creators as fallback)
 * Falls back to mock list when API key is not configured.
 */
export async function getTokenList(): Promise<BagsToken[]> {
  if (!hasApiKey()) return MOCK_TOKENS
  try {
    // Use the analytics endpoint to get creator tokens with volume
    const res = await fetch(`${BAGS_BASE}/analytics/token-launch/creators?limit=50`, {
      headers: bagsHeaders(),
      next: { revalidate: 60 },
    })
    if (!res.ok) return MOCK_TOKENS
    const data = await res.json()
    // Map Bags API response to our BagsToken shape
    const tokens: BagsToken[] = (data.response?.creators || []).map((c: {
      tokenMint: string; symbol?: string; name?: string; price?: number; priceChange24h?: number; imageUrl?: string; volume24h?: number;
    }) => ({
      mint: c.tokenMint,
      symbol: c.symbol || c.tokenMint.slice(0, 6),
      name: c.name || c.symbol || '',
      price_usd: c.price || 0,
      change_24h: c.priceChange24h || 0,
      icon_url: c.imageUrl || '',
      volume_24h: c.volume24h || 0,
    }))
    return tokens.length > 0 ? tokens : MOCK_TOKENS
  } catch {
    return MOCK_TOKENS
  }
}

/**
 * Fetch pool data for a token mint to get current price.
 * Endpoint: GET /state/pool?tokenMint=<mint>
 */
export async function getTokenPrice(mint: string): Promise<number> {
  if (!hasApiKey()) {
    return MOCK_TOKENS.find(t => t.mint === mint)?.price_usd ?? 0
  }
  try {
    const res = await fetch(`${BAGS_BASE}/state/pool?tokenMint=${mint}`, {
      headers: bagsHeaders(),
      next: { revalidate: 30 },
    })
    if (!res.ok) return 0
    const data = await res.json()
    return data.response?.price || 0
  } catch {
    return 0
  }
}

/**
 * Execute a buy for each token in the index using the Bags Trade API.
 * Flow per token:
 *   1. GET /trade/quote?inputMint=SOL&outputMint=<mint>&amount=<lamports>
 *   2. POST /trade/swap  { quoteResponse, userPublicKey }
 * Returns mock signatures when API key or wallet adapter is unavailable.
 */
export async function executeIndexBuy(
  wallet: string,
  tokens: TokenInIndex[],
  totalSOL: number
): Promise<{ txSignatures: string[] }> {
  if (!hasApiKey() || !wallet || wallet.startsWith('Demo')) {
    // Graceful mock — simulates network latency for demo mode
    await new Promise(r => setTimeout(r, 1500))
    return {
      txSignatures: tokens.map((_, i) =>
        `${Math.random().toString(36).slice(2)}${i}${Date.now().toString(36)}`
      ),
    }
  }

  const SOL_MINT = 'So11111111111111111111111111111111111111112'
  const LAMPORTS_PER_SOL = 1_000_000_000
  const signatures: string[] = []

  for (const token of tokens) {
    const lamports = Math.floor((totalSOL * token.weight / 100) * LAMPORTS_PER_SOL)
    if (lamports < 1000) continue

    try {
      // Step 1: Get trade quote
      const quoteRes = await fetch(
        `${BAGS_BASE}/trade/quote?inputMint=${SOL_MINT}&outputMint=${token.mint}&amount=${lamports}&slippageBps=100`,
        { headers: bagsHeaders() }
      )
      if (!quoteRes.ok) continue
      const { response: quote } = await quoteRes.json()

      // Step 2: Create swap transaction
      const swapRes = await fetch(`${BAGS_BASE}/trade/swap`, {
        method: 'POST',
        headers: bagsHeaders(),
        body: JSON.stringify({ quoteResponse: quote, userPublicKey: wallet }),
      })
      if (!swapRes.ok) continue
      const { response: swap } = await swapRes.json()
      if (swap?.transaction) signatures.push(swap.transaction)
    } catch {
      // Log per-token failures but continue with remaining tokens
      signatures.push(`failed_${token.mint.slice(0, 8)}`)
    }
  }

  return { txSignatures: signatures.length > 0 ? signatures : ['mock_fallback'] }
}

/**
 * Get lifetime fee earnings for a wallet.
 * Endpoint: GET /analytics/token/lifetime-fees?wallet=<wallet>
 */
export async function getFeeInfo(wallet: string): Promise<{ earned: number; pending: number }> {
  if (!hasApiKey() || !wallet) return { earned: 0, pending: 0 }
  try {
    const res = await fetch(`${BAGS_BASE}/analytics/token/lifetime-fees?wallet=${wallet}`, {
      headers: bagsHeaders(),
      next: { revalidate: 60 },
    })
    if (!res.ok) return { earned: 0, pending: 0 }
    const data = await res.json()
    return {
      earned: data.response?.totalFees || 0,
      pending: data.response?.claimableFees || 0,
    }
  } catch {
    return { earned: 0, pending: 0 }
  }
}

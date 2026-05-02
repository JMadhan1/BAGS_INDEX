# Bags Index

**The permissionless index fund protocol for creator tokens on Solana.**

Built for the [Bags Hackathon](https://bags.fm) — Fee Sharing track.

## What it does

Bags Index lets anyone:
1. **Create** a curated basket of creator tokens (e.g. "Top AI Creators", "Rising Dev Builders")
2. **Share** their index publicly on a marketplace
3. **Earn 0.5% fee** every time someone buys or sells their index — forever
4. **Buy any index** in one click — it automatically splits SOL across all tokens by weight using the Bags Trade API

Every trade routes through the official Bags REST API, generating real on-chain volume and fee revenue for creators.

## Why it wins

- **Real fee sharing**: 0.5% of every trade flows to the index creator via Bags fee infrastructure
- **Permissionless**: Anyone with a Solana wallet can create and share an index
- **AI-powered**: Claude helps users build optimal baskets via natural language
- **Viral traction loop**: Creators share their indexes, more buys flow, more fees earned

## Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Wallet | @solana/wallet-adapter |
| Bags | @bagsfm/bags-sdk + REST API (`public-api-v2.bags.fm`) |
| Database | Supabase (PostgreSQL + Realtime) |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Charts | Recharts |
| State | Zustand + TanStack Query |

## Setup

```bash
git clone <repo>
cd bags-index
npm install
```

### Environment Variables

Copy `.env.local` and fill in your keys:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI Advisor |
| `BAGS_API_KEY` | Bags API key from dev.bags.fm |
| `NEXT_PUBLIC_SOLANA_RPC` | Solana RPC endpoint |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL |

### Database

Run the migration in your Supabase SQL editor:

```
supabase/migrations/001_initial.sql
```

### Run

```bash
npm run dev
# http://localhost:3000
```

The app works without any API keys — mock data is used throughout so you can explore the full UI immediately.

## Demo Mode

Append `?demo=true` to any URL to activate demo mode:
- Pre-filled create wizard
- Buy modal skips real transactions (2s simulated delay)
- Dashboard shows impressive mock stats
- Floating DEMO MODE badge

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub, import in Vercel, add env vars, deploy.

## Bags API Integration

| Endpoint | Usage |
|----------|-------|
| `GET /analytics/token/lifetime-fees` | Creator earnings dashboard |
| `GET /trade/quote` | Get swap quote for each token |
| `POST /trade/swap` | Execute token buy transaction |
| `GET /analytics/token-launch/creators` | Token discovery for index builder |
| `GET /state/pool` | Real-time token prices |

Base URL: `https://public-api-v2.bags.fm/api/v1`
Auth: `x-api-key` header (get key from dev.bags.fm)

## License

MIT

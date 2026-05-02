---
name: Bags Index project context
description: Full-stack Solana creator token index fund app for the Bags hackathon
type: project
---

User is building "Bags Index" — a permissionless creator token index fund on Solana for the Bags hackathon (bags.fm). Full Next.js 14 app at `c:\Users\jmadh\OneDrive\Desktop\Hacks\bags index\bags-index`.

**Why:** Hackathon submission targeting the Fee Sharing track. Creators earn 0.5% of every trade on their index.

**Stack:** Next.js 14 App Router, TypeScript, Tailwind, Framer Motion, Supabase, Anthropic Claude AI, Recharts, Zustand, TanStack Query, @bagsfm/bags-sdk, @solana/wallet-adapter.

**Bags API:** Base URL `https://public-api-v2.bags.fm/api/v1`, auth via `x-api-key` header, key from dev.bags.fm.
Key endpoints used: `/trade/quote`, `/trade/swap`, `/analytics/token/lifetime-fees`, `/analytics/token-launch/creators`, `/state/pool`.

**How to apply:** App works fully with mock data when no API keys are set. Add BAGS_API_KEY, ANTHROPIC_API_KEY, and Supabase keys to `.env.local` for production.

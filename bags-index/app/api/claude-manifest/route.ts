import { NextResponse } from 'next/server'

/**
 * Claude Skills manifest — MCP-compatible skill discovery endpoint.
 * Accessible at /api/claude-manifest
 * Track: Claude Skills — portfolio management, trading insights, creator workflows
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bags-index.vercel.app'
  return NextResponse.json({
    schema_version: '1.0',
    name_for_human: 'Bags Index',
    name_for_model: 'bags_index',
    description_for_human: 'Research and invest in curated creator token index funds on Solana. Earn 0.5% fees as a curator.',
    description_for_model: 'Bags Index is a DeFi protocol on Solana for creator token index funds. Use this skill to list available indexes, get index composition and performance data, fetch protocol statistics, and help users make informed investment decisions about creator token baskets.',
    auth: { type: 'none' },
    tools: [
      {
        name: 'list_indexes',
        description: 'List creator token index funds. Returns name, category, 7d performance, volume, fees, holders.',
        url: `${baseUrl}/api/claude-skills?tool=list_indexes`,
        method: 'GET',
        parameters: [
          { name: 'category', in: 'query', required: false, description: 'Filter: AI Creators, Dev Builders, Gaming, Art, Meme, Other' },
          { name: 'sort', in: 'query', required: false, description: 'Sort: volume (default), newest, holders' },
        ],
      },
      {
        name: 'get_index',
        description: 'Get full details of an index including token composition and fee breakdown.',
        url: `${baseUrl}/api/claude-skills?tool=get_index&id={id}`,
        method: 'GET',
        parameters: [{ name: 'id', in: 'query', required: true, description: 'Index UUID' }],
      },
      {
        name: 'get_stats',
        description: 'Get global protocol stats: total volume, fees distributed, active indexes, total holders.',
        url: `${baseUrl}/api/claude-skills?tool=get_stats`,
        method: 'GET',
        parameters: [],
      },
    ],
  })
}

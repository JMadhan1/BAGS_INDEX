export interface TokenInIndex {
  mint: string;
  symbol: string;
  name: string;
  weight: number;
  icon_url: string;
  current_price_usd?: number;
  change_24h?: number;
}

export type IndexCategory = 'AI Creators' | 'Dev Builders' | 'Gaming' | 'Art' | 'Meme' | 'Other';

export interface Index {
  id: string;
  creator_wallet: string;
  name: string;
  description: string;
  category: IndexCategory;
  tokens: TokenInIndex[];
  fee_bps: number;
  total_volume_usd: number;
  total_fees_earned: number;
  holder_count: number;
  performance_7d: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  index_id: string;
  buyer_wallet: string;
  amount_usd: number;
  fee_amount: number;
  tx_signature: string;
  tokens_bought: TokenInIndex[];
  created_at: string;
}

export interface Holding {
  id: string;
  wallet: string;
  index_id: string;
  amount_usd: number;
  tokens_snapshot: TokenInIndex[];
  created_at: string;
}

export interface CreatorStats {
  total_fees_earned: number;
  total_volume: number;
  index_count: number;
  total_holders: number;
  indexes: Index[];
  recent_trades: Trade[];
}

export interface GlobalStats {
  totalVolume: number;
  activeCount: number;
  creatorCount: number;
  feesDistributed: number;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestedIndex?: {
    name: string;
    category?: string;
    tokens: { symbol: string; weight: number; reason: string }[];
    rationale: string;
  };
}

export interface BagsToken {
  mint: string;
  symbol: string;
  name: string;
  price_usd: number;
  change_24h: number;
  icon_url: string;
  volume_24h?: number;
}

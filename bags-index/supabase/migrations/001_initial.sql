CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE indexes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Other',
  tokens JSONB NOT NULL,
  fee_bps INTEGER DEFAULT 50,
  total_volume_usd DECIMAL DEFAULT 0,
  total_fees_earned DECIMAL DEFAULT 0,
  holder_count INTEGER DEFAULT 0,
  performance_7d DECIMAL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index_id UUID REFERENCES indexes(id) ON DELETE CASCADE,
  buyer_wallet TEXT NOT NULL,
  amount_usd DECIMAL NOT NULL,
  fee_amount DECIMAL NOT NULL,
  tx_signature TEXT UNIQUE NOT NULL,
  tokens_bought JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  index_id UUID REFERENCES indexes(id) ON DELETE CASCADE,
  amount_usd DECIMAL NOT NULL,
  tokens_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wallet, index_id)
);

CREATE INDEX idx_indexes_creator ON indexes(creator_wallet);
CREATE INDEX idx_indexes_category ON indexes(category);
CREATE INDEX idx_indexes_volume ON indexes(total_volume_usd DESC);
CREATE INDEX idx_trades_index ON trades(index_id);
CREATE INDEX idx_trades_buyer ON trades(buyer_wallet);
CREATE INDEX idx_trades_created ON trades(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER update_indexes_updated_at
  BEFORE UPDATE ON indexes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION increment_index_stats(p_id UUID, p_volume DECIMAL, p_fees DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE indexes
  SET total_volume_usd = total_volume_usd + p_volume,
      total_fees_earned = total_fees_earned + p_fees
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE indexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read indexes" ON indexes FOR SELECT USING (true);
CREATE POLICY "Public insert indexes" ON indexes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update indexes" ON indexes FOR UPDATE USING (true);

CREATE POLICY "Public read trades" ON trades FOR SELECT USING (true);
CREATE POLICY "Public insert trades" ON trades FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read holdings" ON holdings FOR SELECT USING (true);
CREATE POLICY "Public insert holdings" ON holdings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update holdings" ON holdings FOR UPDATE USING (true);

INSERT INTO indexes (creator_wallet, name, description, category, tokens, total_volume_usd, total_fees_earned, holder_count, performance_7d) VALUES
(
  'Demo1111111111111111111111111111111111111',
  'Top AI Builders',
  'The most innovative AI and ML creator tokens on Bags. Curated weekly based on trading activity and community growth.',
  'AI Creators',
  '[{"mint":"So11111111111111111111111111111111111111112","symbol":"SOL","name":"Solana","weight":30,"icon_url":"https://cryptologos.cc/logos/solana-sol-logo.png"},{"mint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","symbol":"USDC","name":"USD Coin","weight":40,"icon_url":"https://cryptologos.cc/logos/usd-coin-usdc-logo.png"},{"mint":"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","symbol":"mSOL","name":"Marinade SOL","weight":30,"icon_url":"https://cryptologos.cc/logos/marinade-msol-logo.png"}]',
  128450.00, 642.25, 89, 12.4
),
(
  'Demo2222222222222222222222222222222222222',
  'Rising Dev Builders',
  'Early-stage developer and open source creator tokens with high potential. High risk, high reward basket.',
  'Dev Builders',
  '[{"mint":"So11111111111111111111111111111111111111112","symbol":"SOL","name":"Solana","weight":50,"icon_url":"https://cryptologos.cc/logos/solana-sol-logo.png"},{"mint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","symbol":"USDC","name":"USD Coin","weight":50,"icon_url":"https://cryptologos.cc/logos/usd-coin-usdc-logo.png"}]',
  87200.00, 436.00, 54, 8.7
),
(
  'Demo3333333333333333333333333333333333333',
  'Gaming Creator Fund',
  'Top gaming streamers, speedrunners, and game dev creators. Ride the Web3 gaming wave.',
  'Gaming',
  '[{"mint":"So11111111111111111111111111111111111111112","symbol":"SOL","name":"Solana","weight":60,"icon_url":"https://cryptologos.cc/logos/solana-sol-logo.png"},{"mint":"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","symbol":"mSOL","name":"Marinade SOL","weight":40,"icon_url":"https://cryptologos.cc/logos/marinade-msol-logo.png"}]',
  45600.00, 228.00, 31, -2.1
),
(
  'Demo4444444444444444444444444444444444444',
  'Meme Lords Index',
  'The degen basket. Top meme creators and viral token launchers. Not financial advice.',
  'Meme',
  '[{"mint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","symbol":"USDC","name":"USD Coin","weight":70,"icon_url":"https://cryptologos.cc/logos/usd-coin-usdc-logo.png"},{"mint":"So11111111111111111111111111111111111111112","symbol":"SOL","name":"Solana","weight":30,"icon_url":"https://cryptologos.cc/logos/solana-sol-logo.png"}]',
  203100.00, 1015.50, 142, 34.8
),
(
  'Demo5555555555555555555555555555555555555',
  'Art & Music Creators',
  'Digital artists, musicians, and creative producers. The cultural capital index.',
  'Art',
  '[{"mint":"So11111111111111111111111111111111111111112","symbol":"SOL","name":"Solana","weight":40,"icon_url":"https://cryptologos.cc/logos/solana-sol-logo.png"},{"mint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","symbol":"USDC","name":"USD Coin","weight":30,"icon_url":"https://cryptologos.cc/logos/usd-coin-usdc-logo.png"},{"mint":"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","symbol":"mSOL","name":"Marinade SOL","weight":30,"icon_url":"https://cryptologos.cc/logos/marinade-msol-logo.png"}]',
  56800.00, 284.00, 47, 5.2
);

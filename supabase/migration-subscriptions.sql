-- Subscription and admin panel schema

-- Plans
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  bids_per_month INT NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  verified_badge BOOLEAN DEFAULT false,
  priority_support BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select_public" ON plans FOR SELECT USING (is_public = true);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_firm_or_admin" ON subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "subscriptions_insert_admin" ON subscriptions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "subscriptions_update_admin" ON subscriptions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Admin flag on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Default plans
INSERT INTO plans (name, slug, description, price_monthly, price_yearly, bids_per_month, featured, verified_badge, priority_support)
VALUES
  ('Besplatno', 'besplatno', 'Osnovni pristup. 5 ponuda mjesečno.', 0, 0, 5, false, false, false),
  ('Start', 'start', '10 ponuda mjesečno + verifikacija profila.', 29, 290, 10, false, true, false),
  ('Pro', 'pro', '30 ponuda mjesečno + istaknut profil + prioritetna podrška.', 79, 790, 30, true, true, true),
  ('Premium', 'premium', 'Neograničene ponude + premium istaknutost + 24/7 podrška.', 149, 1490, 9999, true, true, true)
ON CONFLICT (slug) DO NOTHING;

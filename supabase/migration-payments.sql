-- Payment integration schema
-- Adds Stripe/PayPal payment links to plans and records payments.

-- ---------------------------------------------------------------------------
-- Plans: add payment provider fields
-- ---------------------------------------------------------------------------
ALTER TABLE plans ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'manual';
ALTER TABLE plans ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS payment_link_url TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS paypal_plan_id TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- ---------------------------------------------------------------------------
-- Payments table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  provider TEXT NOT NULL DEFAULT 'manual',
  provider_session_id TEXT,
  provider_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BAM',
  interval TEXT NOT NULL DEFAULT 'monthly' CHECK (interval IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select_firm_or_admin" ON payments;
CREATE POLICY "payments_select_firm_or_admin" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
    OR is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS "payments_insert_firm_or_admin" ON payments;
CREATE POLICY "payments_insert_firm_or_admin" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
    OR is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS "payments_update_admin" ON payments;
CREATE POLICY "payments_update_admin" ON payments
  FOR UPDATE USING (is_admin_user(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_payments_firm ON payments(firm_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_provider_session ON payments(provider_session_id);

-- ---------------------------------------------------------------------------
-- Helper: total revenue
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_total_revenue()
RETURNS DECIMAL(10,2)
LANGUAGE sql
SECURITY DEFINER
SET row_security = off
AS $$
  SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed';
$$;

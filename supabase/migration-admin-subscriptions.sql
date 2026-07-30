-- Admin panel: roles (majstor), subscription management, promo tracking

-- ---------------------------------------------------------------------------
-- Profiles: add 'majstor' role
-- ---------------------------------------------------------------------------
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('client', 'firm', 'majstor'));

-- ---------------------------------------------------------------------------
-- Subscriptions: add promo/notes fields and paused status
-- ---------------------------------------------------------------------------
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS is_promo BOOLEAN DEFAULT false;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS notes TEXT;

-- Drop old check and recreate with 'paused' status
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'cancelled', 'expired', 'paused'));

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_subscriptions_firm_status ON subscriptions(firm_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_promo ON subscriptions(is_promo);

-- ---------------------------------------------------------------------------
-- Promo counter: track how many firms received free premium promo
-- We use a simple settings/key-value table for admin counters
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_settings_select_admin" ON admin_settings;
CREATE POLICY "admin_settings_select_admin" ON admin_settings
  FOR SELECT USING (is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "admin_settings_update_admin" ON admin_settings;
CREATE POLICY "admin_settings_update_admin" ON admin_settings
  FOR UPDATE USING (is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "admin_settings_insert_admin" ON admin_settings;
CREATE POLICY "admin_settings_insert_admin" ON admin_settings
  FOR INSERT WITH CHECK (is_admin_user(auth.uid()));

INSERT INTO admin_settings (key, value)
VALUES ('promo_free_premium_count', '0')
ON CONFLICT (key) DO NOTHING;

INSERT INTO admin_settings (key, value)
VALUES ('promo_free_premium_limit', '1000')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Function: count promo subscriptions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_promo_count()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET row_security = off
AS $$
  SELECT COALESCE(
    (SELECT value::int FROM admin_settings WHERE key = 'promo_free_premium_count'),
    0
  );
$$;

-- ---------------------------------------------------------------------------
-- Helper: increment promo counter
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_promo_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
BEGIN
  INSERT INTO admin_settings (key, value)
  VALUES ('promo_free_premium_count', '1')
  ON CONFLICT (key) DO UPDATE
  SET value = (admin_settings.value::int + 1)::text,
      updated_at = now();
END;
$$;

-- ---------------------------------------------------------------------------
-- Ensure admin RLS covers subscriptions update/delete (if not already)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "subscriptions_delete_admin" ON subscriptions;
CREATE POLICY "subscriptions_delete_admin" ON subscriptions
  FOR DELETE USING (is_admin_user(auth.uid()));

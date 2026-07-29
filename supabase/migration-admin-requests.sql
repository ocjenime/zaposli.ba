-- Admin requests table for subscription upgrades and other admin alerts
-- (separate from user-facing notifications to avoid schema conflicts)
CREATE TABLE IF NOT EXISTS admin_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('subscription_request', 'contact', 'report')),
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_requests_select_admin" ON admin_requests;
CREATE POLICY "admin_requests_select_admin" ON admin_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "admin_requests_insert_firm" ON admin_requests;
CREATE POLICY "admin_requests_insert_firm" ON admin_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
);

DROP POLICY IF EXISTS "admin_requests_update_admin" ON admin_requests;
CREATE POLICY "admin_requests_update_admin" ON admin_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Admin needs to read/update all profiles in admin panel
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Helper: promote a user to admin by email (run once for first admin)
-- UPDATE profiles SET is_admin = true WHERE email = 'admin@example.com';

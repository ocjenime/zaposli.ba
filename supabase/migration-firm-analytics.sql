-- Profile-visit analytics for Pro and Premium plans.

CREATE TABLE IF NOT EXISTS firm_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  referrer TEXT,
  path TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_firm_visits_firm_visited
  ON firm_visits (firm_id, visited_at DESC);

ALTER TABLE firm_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "firm_visits_select_owner" ON firm_visits;
CREATE POLICY "firm_visits_select_owner" ON firm_visits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
    OR is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS "firm_visits_insert_public" ON firm_visits;
CREATE POLICY "firm_visits_insert_public" ON firm_visits
  FOR INSERT WITH CHECK (true);

COMMENT ON TABLE firm_visits IS 'Anonymous profile page visits recorded for firm analytics.';

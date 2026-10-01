-- ============================================================================
-- SAMO KLIJENTI MOGU OBJAVLJIVATI POSLOVE (firme/majstori koriste oglase)
-- Pokrenuti jednom u Supabase Dashboard > SQL Editor > Run.
-- Idempotentno: slobodno pokrenuti više puta.
-- ============================================================================

-- 1. Pomoćne funkcije (ista definicija kao u migration-private-job-flow.sql)
CREATE OR REPLACE FUNCTION get_firm_owner(firm_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT owner_id FROM firms WHERE id = firm_id;
$$;

CREATE OR REPLACE FUNCTION is_app_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
END;
$$;

-- 2. INSERT: samo nalog sa role = 'client' smije kreirati posao
DROP POLICY IF EXISTS "jobs_insert_own" ON jobs;
CREATE POLICY "jobs_insert_own" ON jobs
  FOR INSERT WITH CHECK (
    auth.uid() = client_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role = 'client'
    )
    AND (
      is_private = false
      OR (is_private = true AND target_firm_id IS NOT NULL AND private_status = 'pending')
    )
  );

-- 3. UPDATE: klijent svoe poslove, firma svoje privatne, admin sve
DROP POLICY IF EXISTS "jobs_update_participants" ON jobs;
CREATE POLICY "jobs_update_participants" ON jobs
  FOR UPDATE USING (
    (auth.uid() = client_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client'))
    OR (is_private = true AND auth.uid() = get_firm_owner(target_firm_id))
    OR is_app_admin()
  )
  WITH CHECK (
    (auth.uid() = client_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client'))
    OR (is_private = true AND auth.uid() = get_firm_owner(target_firm_id))
    OR is_app_admin()
  );

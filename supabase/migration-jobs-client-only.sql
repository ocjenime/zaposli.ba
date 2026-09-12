-- ============================================================================
-- Restrict job posting to clients only
-- ============================================================================
-- Firms and individual workers (majstori) should not be able to publish jobs.
-- Only users with role = 'client' can insert into jobs.
-- ============================================================================

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

-- Update policies so client-side updates also require the user to be a client.
-- Firm owners can still update private jobs targeted at them.
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

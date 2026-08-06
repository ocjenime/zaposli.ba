-- Allow clients to delete their own jobs.
-- This enables the "Izbriši posao" feature in the client dashboard.

DROP POLICY IF EXISTS "jobs_delete_own" ON jobs;
CREATE POLICY "jobs_delete_own" ON jobs FOR DELETE USING (
  auth.uid() = client_id
);

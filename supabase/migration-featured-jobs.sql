-- Featured / promoted jobs support

-- Adds ability for admin to mark selected jobs as featured so they appear first
-- on the homepage, public projects list, and firm dashboard.

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ NULL;

-- Index to speed up the common "active featured jobs" query and sorting
CREATE INDEX IF NOT EXISTS idx_jobs_featured_active
  ON jobs (is_featured, featured_until, created_at);

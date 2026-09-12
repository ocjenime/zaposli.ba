-- Mediation / dispute resolution support for jobs
-- Allows clients and firms to request admin help when a deadline passes and a dispute arises.

ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS mediation_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS mediation_requested_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS mediation_requested_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS mediation_reason TEXT,
ADD COLUMN IF NOT EXISTS mediation_resolved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS mediation_resolved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS mediation_resolution TEXT,
ADD COLUMN IF NOT EXISTS mediation_admin_id UUID REFERENCES profiles(id);

-- Index for fast lookups of open mediation cases
CREATE INDEX IF NOT EXISTS idx_jobs_mediation_open
ON jobs(mediation_requested, mediation_resolved)
WHERE mediation_requested = true AND mediation_resolved = false;

COMMENT ON COLUMN jobs.mediation_requested IS 'True when a client or firm requests admin mediation for a dispute.';
COMMENT ON COLUMN jobs.mediation_reason IS 'Description of the dispute provided by the requesting party.';
COMMENT ON COLUMN jobs.mediation_resolved IS 'True once an admin marks the mediation case as resolved.';
COMMENT ON COLUMN jobs.mediation_resolution IS 'Admin notes describing how the dispute was resolved.';

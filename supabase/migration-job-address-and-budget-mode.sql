-- Job fields: address and budget preference
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS budget_mode TEXT;

-- Add comments to help future maintainers
COMMENT ON COLUMN jobs.address IS 'Client-provided street address or location for the job';
COMMENT ON COLUMN jobs.budget_mode IS 'open = client wants firms to propose a price; fixed = client has an estimated budget';

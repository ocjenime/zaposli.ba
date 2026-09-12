-- Paid job ads / featured listings as a separate product
-- Firms without subscription can pay per ad; premium plans include a number of ads.

ALTER TABLE plans
ADD COLUMN IF NOT EXISTS included_featured_ads INT DEFAULT 0;

-- Default included featured ads per plan
UPDATE plans SET included_featured_ads = 0 WHERE slug = 'besplatno';
UPDATE plans SET included_featured_ads = 0 WHERE slug = 'start';
UPDATE plans SET included_featured_ads = 1 WHERE slug = 'pro';
UPDATE plans SET included_featured_ads = 3 WHERE slug = 'premium';

CREATE TABLE IF NOT EXISTS job_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired')),
  source TEXT CHECK (source IN ('included', 'paid')),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_promotions_firm_status
ON job_promotions(firm_id, status);

CREATE INDEX IF NOT EXISTS idx_job_promotions_job
ON job_promotions(job_id);

COMMENT ON COLUMN plans.included_featured_ads IS 'Number of featured job ads included per month in this plan.';
COMMENT ON COLUMN job_promotions.source IS 'Whether the promotion used an included plan credit (included) or was paid separately (paid).';

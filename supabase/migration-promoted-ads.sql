-- Standalone promoted ads: firms/majstors can upload their own ads
-- (text + image) for worker recruitment or self-promotion.

CREATE TABLE IF NOT EXISTS promoted_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  cta_url TEXT,
  ad_type TEXT NOT NULL DEFAULT 'promotion' CHECK (ad_type IN ('promotion', 'worker_search')),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'rejected')),
  source TEXT CHECK (source IN ('included', 'paid')),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promoted_ads_firm_status
ON promoted_ads(firm_id, status);

CREATE INDEX IF NOT EXISTS idx_promoted_ads_active
ON promoted_ads(status, ends_at)
WHERE status = 'active';

COMMENT ON TABLE promoted_ads IS 'Standalone paid promotional ads created by firms/majstors.';
COMMENT ON COLUMN promoted_ads.ad_type IS 'promotion = promote the firm/services; worker_search = looking to hire workers.';
COMMENT ON COLUMN promoted_ads.source IS 'Whether the ad used an included plan credit (included) or was paid separately (paid).';

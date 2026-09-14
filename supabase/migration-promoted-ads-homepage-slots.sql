-- Homepage top-10 listings: top 5 positions are paid sticky slots.
-- Organic positions 6-10 come from firm ranking.

ALTER TABLE public.promoted_ads
  ADD COLUMN IF NOT EXISTS homepage_position INTEGER CHECK (homepage_position BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS homepage_sticky_until TIMESTAMPTZ;

COMMENT ON COLUMN public.promoted_ads.homepage_position IS 'Paid sticky position on the homepage top-10 list (1-5).';
COMMENT ON COLUMN public.promoted_ads.homepage_sticky_until IS 'Expiration timestamp for the paid homepage sticky position.';

CREATE INDEX IF NOT EXISTS idx_promoted_ads_homepage_sticky
  ON public.promoted_ads(homepage_position, homepage_sticky_until)
  WHERE status = 'active';

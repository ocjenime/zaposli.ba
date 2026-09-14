-- Add banner image support to promoted ads.
-- Firms upload a wide banner; the card shows banner, firm logo, name and description.

ALTER TABLE public.promoted_ads ADD COLUMN IF NOT EXISTS banner_url TEXT;

COMMENT ON COLUMN public.promoted_ads.banner_url IS 'Wide banner image (recommended 1200x400 px) shown at the top of the promoted ad card.';

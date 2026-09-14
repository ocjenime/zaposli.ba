-- Add placement destination to promoted ads so homepage and listing-page ads can have separate pricing.
-- Homepage mini ad: 19 KM or included in Pro/Premium.
-- Listing-page ad (/izdvojeni-oglasi/): 5 KM, always paid.

ALTER TABLE promoted_ads
  ADD COLUMN IF NOT EXISTS destination text NOT NULL DEFAULT 'homepage'
  CHECK (destination IN ('homepage', 'homepage_banner', 'listing'));

-- Existing rows keep 'homepage' so they continue to appear on the homepage.
UPDATE promoted_ads SET destination = 'homepage' WHERE destination IS NULL;

COMMENT ON COLUMN promoted_ads.destination IS 'Where the ad is primarily shown: homepage or /izdvojeni-oglasi/ listing page';

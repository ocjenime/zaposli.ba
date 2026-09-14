-- Allow homepage_banner destination and make only homepage mini ads consume included credits.
-- Listing-page ads are free for Start/Pro/Premium plans (handled in app via amount=0/source='paid'),
-- so they must NOT be counted by the included-ad limit trigger.

-- 1. Widen the destination check constraint to include homepage_banner.
ALTER TABLE promoted_ads
  DROP CONSTRAINT IF EXISTS promoted_ads_destination_check;

ALTER TABLE promoted_ads
  ADD CONSTRAINT promoted_ads_destination_check
  CHECK (destination IN ('homepage', 'homepage_banner', 'listing'));

-- 2. Update the included-ad limit trigger so it only counts homepage mini ads.
--    Listing ads and homepage banners do NOT consume the included_featured_ads quota.
CREATE OR REPLACE FUNCTION enforce_included_ad_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
DECLARE
  ad_limit INT;
  period_start TIMESTAMPTZ;
  used_count INT;
BEGIN
  IF NEW.source <> 'included' THEN
    RETURN NEW;
  END IF;

  -- Only homepage mini ads are allowed as "included" credits.
  IF NEW.destination IS NOT NULL AND NEW.destination <> 'homepage' THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(p.included_featured_ads, 0),
         get_subscription_period_start(s.starts_at)
  INTO ad_limit, period_start
  FROM subscriptions s
  JOIN plans p ON p.id = s.plan_id
  WHERE s.firm_id = NEW.firm_id
    AND s.status IN ('active', 'cancelled', 'paused')
    AND (s.ends_at IS NULL OR s.ends_at > now())
  ORDER BY s.created_at DESC
  LIMIT 1;

  IF ad_limit IS NULL THEN
    ad_limit := 0;
  END IF;

  IF period_start IS NULL THEN
    period_start := date_trunc('month', now());
  END IF;

  SELECT COUNT(*) INTO used_count
  FROM promoted_ads
  WHERE firm_id = NEW.firm_id
    AND source = 'included'
    AND (destination = 'homepage' OR destination IS NULL)
    AND created_at >= period_start;

  IF used_count >= ad_limit THEN
    RAISE EXCEPTION 'Iskorišten je mjesečni limit besplatnih homepage oglasa u paketu.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS included_ad_limit_trigger ON promoted_ads;
CREATE TRIGGER included_ad_limit_trigger
BEFORE INSERT ON promoted_ads
FOR EACH ROW
EXECUTE FUNCTION enforce_included_ad_limit();

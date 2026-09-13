-- Switch bid and included-ad counters from calendar-month to 30-day billing periods
-- based on each subscription's starts_at. Multi-month subscriptions reset every 30 days.

CREATE OR REPLACE FUNCTION get_subscription_period_start(starts_at TIMESTAMPTZ)
RETURNS TIMESTAMPTZ
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
  SELECT starts_at + (floor(extract(epoch from (now() - starts_at)) / 2592000) * interval '30 days');
$$;

-- Update bid-limit trigger to use the subscription billing period
CREATE OR REPLACE FUNCTION enforce_bid_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
DECLARE
  plan_limit INT;
  period_start TIMESTAMPTZ;
  used_count INT;
BEGIN
  SELECT COALESCE(p.bids_per_month, 5),
         get_subscription_period_start(s.starts_at)
  INTO plan_limit, period_start
  FROM subscriptions s
  JOIN plans p ON p.id = s.plan_id
  WHERE s.firm_id = NEW.firm_id
    AND s.status IN ('active', 'cancelled', 'paused')
    AND (s.ends_at IS NULL OR s.ends_at > now())
  ORDER BY s.created_at DESC
  LIMIT 1;

  IF plan_limit IS NULL THEN
    plan_limit := 5;
  END IF;

  IF period_start IS NULL THEN
    period_start := date_trunc('month', now());
  END IF;

  IF plan_limit = 9999 THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO used_count
  FROM bids
  WHERE firm_id = NEW.firm_id
    AND created_at >= period_start;

  IF used_count >= plan_limit THEN
    RAISE EXCEPTION 'Dostignut je mjesečni limit ponuda za vaš paket.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bids_limit_trigger ON bids;
CREATE TRIGGER bids_limit_trigger
BEFORE INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION enforce_bid_limit();

-- Update included-ad trigger to use the subscription billing period
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
    AND created_at >= period_start;

  IF used_count >= ad_limit THEN
    RAISE EXCEPTION 'Iskorišten je mjesečni limit besplatnih oglasa u paketu.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS included_ad_limit_trigger ON promoted_ads;
CREATE TRIGGER included_ad_limit_trigger
BEFORE INSERT ON promoted_ads
FOR EACH ROW
EXECUTE FUNCTION enforce_included_ad_limit();

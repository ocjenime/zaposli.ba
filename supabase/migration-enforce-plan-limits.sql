-- Enforce real plan limits and add ranking priority per active subscription.

-- 1. Ranking priority derived from active paid plan
ALTER TABLE firms ADD COLUMN IF NOT EXISTS plan_priority FLOAT DEFAULT 0;

CREATE OR REPLACE FUNCTION get_firm_plan_priority(firm_uuid UUID)
RETURNS FLOAT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
  SELECT COALESCE(
    (SELECT CASE p.slug
      WHEN 'start' THEN 0.1
      WHEN 'pro' THEN 0.2
      WHEN 'premium' THEN 0.4
      ELSE 0
    END::float
    FROM subscriptions s
    JOIN plans p ON p.id = s.plan_id
    WHERE s.firm_id = firm_uuid
      AND s.status IN ('active', 'cancelled', 'paused')
      AND (s.ends_at IS NULL OR s.ends_at > now())
    ORDER BY s.created_at DESC
    LIMIT 1),
    0
  );
$$;

-- Initialize priority for existing firms
UPDATE firms SET plan_priority = get_firm_plan_priority(id);

-- Keep priority in sync when subscriptions change
CREATE OR REPLACE FUNCTION update_firm_plan_priority()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE firms SET plan_priority = get_firm_plan_priority(OLD.firm_id) WHERE id = OLD.firm_id;
    RETURN OLD;
  ELSE
    UPDATE firms SET plan_priority = get_firm_plan_priority(NEW.firm_id) WHERE id = NEW.firm_id;
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS update_firm_priority_on_subscription ON subscriptions;
CREATE TRIGGER update_firm_priority_on_subscription
AFTER INSERT OR UPDATE OR DELETE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_firm_plan_priority();

-- 2. Hard bid limit per plan (free fallback = 5)
CREATE OR REPLACE FUNCTION enforce_bid_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
DECLARE
  plan_limit INT;
  used_count INT;
BEGIN
  SELECT COALESCE(p.bids_per_month, 5) INTO plan_limit
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

  IF plan_limit = 9999 THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO used_count
  FROM bids
  WHERE firm_id = NEW.firm_id
    AND created_at >= date_trunc('month', now());

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

-- 3. Included promoted-ads limit per plan
CREATE OR REPLACE FUNCTION enforce_included_ad_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
DECLARE
  ad_limit INT;
  used_count INT;
BEGIN
  IF NEW.source <> 'included' THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(p.included_featured_ads, 0) INTO ad_limit
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

  SELECT COUNT(*) INTO used_count
  FROM promoted_ads
  WHERE firm_id = NEW.firm_id
    AND source = 'included'
    AND created_at >= date_trunc('month', now());

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

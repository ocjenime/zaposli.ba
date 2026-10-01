-- ============================================================================
-- PONUDE: osiguraj sve triggere + admin obavijesti (in-app + email).
-- Pokrenuti jednom u Supabase Dashboard > SQL Editor > Run.
-- Idempotentno: slobodno pokrenuti više puta.
--
-- Rješava:
--  1. bids_count na poslovima se ne ažurira (homepage pokazuje 0)
--  2. admin ne dobija in-app notifikaciju za nove ponude
--  3. admin ne dobija email za nove ponude (preko notify-admin funkcije)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Brojač ponuda na poslu (INSERT / DELETE / UPDATE job_id)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_job_bids_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET bids_count = COALESCE(bids_count, 0) + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_job_bids_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET bids_count = GREATEST(COALESCE(bids_count, 0) - 1, 0) WHERE id = OLD.job_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_job_bids_count_on_job_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.job_id IS DISTINCT FROM NEW.job_id THEN
    UPDATE jobs SET bids_count = GREATEST(COALESCE(bids_count, 0) - 1, 0) WHERE id = OLD.job_id;
    UPDATE jobs SET bids_count = COALESCE(bids_count, 0) + 1 WHERE id = NEW.job_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_increment_job_bids_count ON bids;
CREATE TRIGGER trg_increment_job_bids_count
  AFTER INSERT ON bids
  FOR EACH ROW
  EXECUTE FUNCTION increment_job_bids_count();

DROP TRIGGER IF EXISTS trg_decrement_job_bids_count ON bids;
CREATE TRIGGER trg_decrement_job_bids_count
  AFTER DELETE ON bids
  FOR EACH ROW
  EXECUTE FUNCTION decrement_job_bids_count();

DROP TRIGGER IF EXISTS trg_update_job_bids_count_on_job_change ON bids;
CREATE TRIGGER trg_update_job_bids_count_on_job_change
  AFTER UPDATE OF job_id ON bids
  FOR EACH ROW
  EXECUTE FUNCTION update_job_bids_count_on_job_change();

-- ---------------------------------------------------------------------------
-- 2. Mjesečni limit ponuda po paketu (30-dnevni obračunski period)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 3. In-app notifikacija KLIJENTU za novu ponudu
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION notify_client_on_bid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_client_id UUID;
  v_firm_name TEXT;
  v_job_title TEXT;
BEGIN
  SELECT client_id, title INTO v_client_id, v_job_title
  FROM jobs WHERE id = NEW.job_id;

  SELECT name INTO v_firm_name
  FROM firms WHERE id = NEW.firm_id;

  IF v_client_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, job_id)
    VALUES (
      v_client_id,
      'bid_received',
      'Nova ponuda za posao',
      COALESCE(v_firm_name, 'Firma') || ' je poslala ponudu za "' || COALESCE(v_job_title, 'posao') || '"',
      NEW.job_id
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_client_on_bid_trigger ON bids;
CREATE TRIGGER notify_client_on_bid_trigger
AFTER INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION notify_client_on_bid();

-- ---------------------------------------------------------------------------
-- 4. In-app notifikacija FIRMI kad je ponuda prihvaćena
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION notify_firm_on_bid_accepted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_firm_owner_id UUID;
  v_job_title TEXT;
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
    SELECT owner_id INTO v_firm_owner_id
    FROM firms WHERE id = NEW.firm_id;

    SELECT title INTO v_job_title
    FROM jobs WHERE id = NEW.job_id;

    IF v_firm_owner_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, job_id)
      VALUES (
        v_firm_owner_id,
        'bid_accepted',
        'Ponuda prihvaćena',
        'Vaša ponuda za "' || COALESCE(v_job_title, 'posao') || '" je prihvaćena. Otvoren je razgovor.',
        NEW.job_id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_firm_on_bid_accepted_trigger ON bids;
CREATE TRIGGER notify_firm_on_bid_accepted_trigger
AFTER UPDATE ON bids
FOR EACH ROW
EXECUTE FUNCTION notify_firm_on_bid_accepted();

-- ---------------------------------------------------------------------------
-- 5. NOVO: in-app notifikacija ADMINIMA za svaku novu ponudu + email hook
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_bid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  admin_user RECORD;
  v_firm_name TEXT;
  v_job_title TEXT;
  payload jsonb;
BEGIN
  SELECT name INTO v_firm_name FROM public.firms WHERE id = NEW.firm_id;
  SELECT title INTO v_job_title FROM public.jobs WHERE id = NEW.job_id;

  FOR admin_user IN
    SELECT id FROM public.profiles WHERE is_admin = true
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, job_id)
    VALUES (
      admin_user.id,
      'new_bid_admin',
      'Nova ponuda',
      COALESCE(v_firm_name, 'Firma') || ' je poslala ponudu (' ||
        COALESCE(NEW.amount::TEXT, '?') || ' KM) za "' ||
        COALESCE(v_job_title, 'posao') || '".',
      NEW.job_id
    )
    ON CONFLICT DO NOTHING;
  END LOOP;

  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'bids',
    'schema', 'public',
    'record', row_to_json(NEW)
  );

  PERFORM net.http_post(
    url := 'https://nwgbrvpomjkzkofjknyi.supabase.co/functions/v1/notify-admin',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzk4MzcsImV4cCI6MjEwMDkxNTgzN30.DAocTT5b2tcds9dIGm_nVW6y9vIm7BnVecPcZqxVa8I',
      'X-Webhook-Secret', 'zaposli-webhook-2024-secure-key'
    ),
    body := payload
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_on_new_bid ON public.bids;
CREATE TRIGGER trg_notify_admins_on_new_bid
  AFTER INSERT ON public.bids
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_new_bid();

GRANT INSERT ON public.notifications TO postgres;

-- ---------------------------------------------------------------------------
-- 6. Backfill: ispravi postojeće brojače (npr. Arhitektura 0 -> 1)
-- ---------------------------------------------------------------------------
UPDATE jobs
SET bids_count = COALESCE(bid_counts.cnt, 0)
FROM (
  SELECT job_id, COUNT(*)::INTEGER AS cnt
  FROM bids
  GROUP BY job_id
) AS bid_counts
WHERE jobs.id = bid_counts.job_id;

UPDATE jobs
SET bids_count = 0
WHERE bids_count IS NULL;

-- Notifications triggers for bid events
-- These run as SECURITY DEFINER to bypass RLS and notify the correct user

-- Function: notify client when a firm bids on their job
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

-- Function: notify firm when their bid is accepted
CREATE OR REPLACE FUNCTION notify_firm_on_bid_accepted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_firm_owner_id UUID;
  v_firm_name TEXT;
  v_job_title TEXT;
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
    SELECT owner_id, name INTO v_firm_owner_id, v_firm_name
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

-- In-app and email notifications for admin_requests (subscription upgrades, etc.)

CREATE OR REPLACE FUNCTION public.handle_admin_request_notification()
RETURNS TRIGGER AS $$
DECLARE
  admin_user RECORD;
  requester_email TEXT;
  requester_name TEXT;
  firm_name TEXT;
  plan_name TEXT;
  payload jsonb;
BEGIN
  IF NEW.type <> 'subscription_request' THEN
    RETURN NEW;
  END IF;

  -- Fetch firm and requester info
  SELECT f.name, p.email, p.full_name
  INTO firm_name, requester_email, requester_name
  FROM firms f
  JOIN profiles p ON p.id = f.owner_id
  WHERE f.id = NEW.firm_id;

  -- Plan name is stored in the request metadata
  plan_name := COALESCE(NEW.metadata->>'plan_name', 'nepoznati paket');

  -- Insert in-app notification for every admin so the bell badge shows
  FOR admin_user IN
    SELECT id FROM profiles WHERE is_admin = true
  LOOP
    INSERT INTO notifications (user_id, type, title, message, job_id)
    VALUES (
      admin_user.id,
      'subscription_request',
      'Nova pretplata',
      COALESCE(firm_name, requester_name, 'Firma') || ' je zatražila nadogradnju na ' || plan_name || '.',
      NULL
    );
  END LOOP;

  -- Email payload for the notify-admin Edge Function
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'admin_requests',
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_admin_request_notification ON public.admin_requests;
CREATE TRIGGER trg_admin_request_notification
  AFTER INSERT ON public.admin_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_request_notification();

COMMENT ON FUNCTION public.handle_admin_request_notification() IS 'Notifies all admins in-app and emails info@zaposli.ba when a subscription upgrade request is created.';

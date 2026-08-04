-- Admin email notifications for platform activity
-- Sends summary emails to info@zaposli.ba for:
--   - new user registrations (profiles)
--   - new firm registrations (firms)
--   - new reviews (reviews)
-- Requires the notify-admin Edge Function to be deployed.

-- 1. New user registration
CREATE OR REPLACE FUNCTION public.handle_new_profile_admin()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'profiles',
    'schema', 'public',
    'record', row_to_json(NEW)
  );

  PERFORM net.http_post(
    url := 'https://nwgbrvpomjkzkofjknyi.supabase.co/functions/v1/notify-admin',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMzOTgzNywiZXhwIjoyMTAwOTE1ODM3fQ.kzmROcTZI03sR2aIgtwErUWcm022czTX-kNCxoSy7SE'
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_admin_new_profile ON public.profiles;
CREATE TRIGGER trg_notify_admin_new_profile
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_admin();

-- 2. New firm registration
CREATE OR REPLACE FUNCTION public.handle_new_firm_admin()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'firms',
    'schema', 'public',
    'record', row_to_json(NEW)
  );

  PERFORM net.http_post(
    url := 'https://nwgbrvpomjkzkofjknyi.supabase.co/functions/v1/notify-admin',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMzOTgzNywiZXhwIjoyMTAwOTE1ODM3fQ.kzmROcTZI03sR2aIgtwErUWcm022czTX-kNCxoSy7SE'
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_admin_new_firm ON public.firms;
CREATE TRIGGER trg_notify_admin_new_firm
  AFTER INSERT ON public.firms
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_firm_admin();

-- 3. New review
CREATE OR REPLACE FUNCTION public.handle_new_review_admin()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'reviews',
    'schema', 'public',
    'record', row_to_json(NEW)
  );

  PERFORM net.http_post(
    url := 'https://nwgbrvpomjkzkofjknyi.supabase.co/functions/v1/notify-admin',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMzOTgzNywiZXhwIjoyMTAwOTE1ODM3fQ.kzmROcTZI03sR2aIgtwErUWcm022czTX-kNCxoSy7SE'
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_admin_new_review ON public.reviews;
CREATE TRIGGER trg_notify_admin_new_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_review_admin();

COMMENT ON FUNCTION public.handle_new_profile_admin() IS 'Webhook trigger that calls the notify-admin Edge Function for new user registrations.';
COMMENT ON FUNCTION public.handle_new_firm_admin() IS 'Webhook trigger that calls the notify-admin Edge Function for new firm registrations.';
COMMENT ON FUNCTION public.handle_new_review_admin() IS 'Webhook trigger that calls the notify-admin Edge Function for new reviews.';

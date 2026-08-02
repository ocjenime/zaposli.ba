: Admin RLS fixes and webhook URL update
-- Run this in Supabase SQL Editor after the base migrations.

-- ---------------------------------------------------------------------------
-- 1. Fix messages admin SELECT policy
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin_user(uid UUID)
RETURNS BOOLEAN
SET row_security = off
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = uid AND is_admin = true);
END;
$$;

DROP POLICY IF EXISTS "messages_select_participant" ON public.messages;
CREATE POLICY "messages_select_participant" ON public.messages
  FOR SELECT USING (
    public.is_admin_user(auth.uid())
    OR auth.uid() IN (SELECT client_id FROM public.jobs WHERE id = job_id)
    OR auth.uid() IN (
      SELECT owner_id FROM public.firms
      WHERE id IN (
        SELECT b.firm_id FROM public.bids b WHERE b.job_id = public.messages.job_id
      )
    )
  );

GRANT EXECUTE ON FUNCTION public.is_admin_user(UUID) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Admin policies for jobs and bids
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "jobs_update_admin" ON public.jobs;
CREATE POLICY "jobs_update_admin" ON public.jobs
  FOR UPDATE USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "bids_select_admin" ON public.bids;
CREATE POLICY "bids_select_admin" ON public.bids
  FOR SELECT USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 3. Update webhook trigger with real Edge Function URL
-- IMPORTANT: replace <SERVICE_ROLE_KEY> with your Supabase service role key.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'messages',
    'schema', 'public',
    'record', row_to_json(NEW)
  );

  PERFORM net.http_post(
    url := 'https://nwgbrvpomjkzkofjknyi.supabase.co/functions/v1/notify-message',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_message ON public.messages;
CREATE TRIGGER trg_notify_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();

COMMENT ON FUNCTION public.handle_new_message() IS 'Webhook trigger that calls the notify-message Edge Function. Replace Bearer token with the service role key.';

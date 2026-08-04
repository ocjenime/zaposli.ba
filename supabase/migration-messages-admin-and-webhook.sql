-- Admin access to messages and webhook instructions for new-message notifications
-- 1. Ensure the admin helper function exists (checks profiles.is_admin boolean)
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

-- 2. Update messages RLS policies so admins can read (for support/arbitration)
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

DROP POLICY IF EXISTS "messages_update_participant_read" ON public.messages;
CREATE POLICY "messages_update_participant_read" ON public.messages
  FOR UPDATE USING (
    auth.uid() IN (SELECT client_id FROM public.jobs WHERE id = job_id)
    OR auth.uid() IN (
      SELECT owner_id FROM public.firms
      WHERE id IN (
        SELECT b.firm_id FROM public.bids b WHERE b.job_id = public.messages.job_id
      )
    )
  )
  WITH CHECK (
    auth.uid() IN (SELECT client_id FROM public.jobs WHERE id = job_id)
    OR auth.uid() IN (
      SELECT owner_id FROM public.firms
      WHERE id IN (
        SELECT b.firm_id FROM public.bids b WHERE b.job_id = public.messages.job_id
      )
    )
  );

-- 3. Webhook trigger for email notifications
-- IMPORTANT: replace <SERVICE_ROLE_KEY> with your Supabase service role key.
-- Project ref for this deployment: nwgbrvpomjkzkofjknyi
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
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMzOTgzNywiZXhwIjoyMTAwOTE1ODM3fQ.kzmROcTZI03sR2aIgtwErUWcm022czTX-kNCxoSy7SE'
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

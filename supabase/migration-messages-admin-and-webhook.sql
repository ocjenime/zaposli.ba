-- Admin access to messages and webhook instructions for new-message notifications
-- 1. Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Update messages RLS policies so admins can read (for support/arbitration)
DROP POLICY IF EXISTS "messages_select_participant" ON public.messages;
CREATE POLICY "messages_select_participant" ON public.messages
  FOR SELECT USING (
    public.is_admin()
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
-- IMPORTANT: replace <PROJECT_REF> and <SERVICE_ROLE_KEY> with your Supabase values.
-- You can also create the webhook in the Supabase Dashboard instead:
-- Database -> Webhooks -> Add new hook -> table: messages, event: AFTER INSERT, URL: https://<PROJECT_REF>.supabase.co/functions/v1/notify-message
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
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/notify-message',
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

COMMENT ON FUNCTION public.handle_new_message() IS 'Webhook trigger that calls the notify-message Edge Function. Replace placeholder URL/auth before enabling.';

: Webhook trigger to notify firms by email when a new job is posted
-- Replace <SERVICE_ROLE_KEY> with your Supabase service role key.
-- Requires the notify-firms-on-job Edge Function to be deployed.

CREATE OR REPLACE FUNCTION public.handle_new_job()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'jobs',
    'schema', 'public',
    'record', row_to_json(NEW)
  );

  PERFORM net.http_post(
    url := 'https://nwgbrvpomjkzkofjknyi.supabase.co/functions/v1/notify-firms-on-job',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_firms_on_job ON public.jobs;
CREATE TRIGGER trg_notify_firms_on_job
  AFTER INSERT ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_job();

COMMENT ON FUNCTION public.handle_new_job() IS 'Webhook trigger that calls the notify-firms-on-job Edge Function. Replace Bearer token with the service role key.';

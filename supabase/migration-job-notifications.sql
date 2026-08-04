-- Webhook trigger to notify firms by email when a new job is posted
-- Requires the WEBHOOK_SECRET env var on the notify-firms-on-job Edge Function.
-- The SQL and Edge Function must share the same WEBHOOK_SECRET value.

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
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzk4MzcsImV4cCI6MjEwMDkxNTgzN30.DAocTT5b2tcds9dIGm_nVW6y9vIm7BnVecPcZqxVa8I',
      'X-Webhook-Secret', 'zaposli-webhook-2024-secure-key'
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

COMMENT ON FUNCTION public.handle_new_job() IS 'Webhook trigger that calls the notify-firms-on-job Edge Function. Must match the WEBHOOK_SECRET env var.';

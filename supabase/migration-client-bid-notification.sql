-- Client email notification when a new bid is submitted
-- Sends an email to the job owner (client) with bid details.
-- Requires the notify-client-on-bid Edge Function to be deployed.
-- The SQL and Edge Function must share the same WEBHOOK_SECRET value.

CREATE OR REPLACE FUNCTION public.handle_new_bid_client()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'bids',
    'schema', 'public',
    'record', row_to_json(NEW)
  );

  PERFORM net.http_post(
    url := 'https://nwgbrvpomjkzkofjknyi.supabase.co/functions/v1/notify-client-on-bid',
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

DROP TRIGGER IF EXISTS trg_notify_client_on_bid ON public.bids;
CREATE TRIGGER trg_notify_client_on_bid
  AFTER INSERT ON public.bids
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_bid_client();

COMMENT ON FUNCTION public.handle_new_bid_client() IS 'Webhook trigger that calls the notify-client-on-bid Edge Function when a new bid is submitted.';

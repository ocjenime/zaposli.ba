-- Client email notification when a new bid is submitted
-- Sends an email to the job owner (client) with bid details.
-- Requires the notify-client-on-bid Edge Function to be deployed.

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
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMzOTgzNywiZXhwIjoyMTAwOTE1ODM3fQ.kzmROcTZI03sR2aIgtwErUWcm022czTX-kNCxoSy7SE'
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

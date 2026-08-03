-- Track when a firm owner was last active so public profiles can show online/last-seen status
ALTER TABLE public.firms
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

COMMENT ON COLUMN public.firms.last_active_at IS 'Timestamp of the firm owner last activity heartbeat.';

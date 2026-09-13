-- ============================================================================
-- Robust in-app notifications: DB triggers for messages and direct jobs
-- ============================================================================
-- Previously, several in-app notifications were created only inside Edge
-- Functions invoked by webhooks. If a webhook failed or was delayed, users
-- never saw the notification. These triggers run synchronously in the
-- database and cannot be skipped by a network failure, so notifications are
-- instant and reliable.
--
-- NOTE: The corresponding Edge Functions no longer insert notifications,
-- so these triggers are now the single source of truth for in-app alerts.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. New message -> notify the other conversation participant
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_job RECORD;
  v_firm_owner_id UUID;
  v_sender_label TEXT;
  v_recipient_id UUID;
BEGIN
  SELECT id, client_id, title INTO v_job
  FROM public.jobs
  WHERE id = NEW.job_id;

  IF v_job IS NULL THEN
    RETURN NEW;
  END IF;

  -- Find the accepted firm for this job (works for public and private jobs).
  SELECT f.owner_id INTO v_firm_owner_id
  FROM public.bids b
  JOIN public.firms f ON f.id = b.firm_id
  WHERE b.job_id = NEW.job_id
    AND b.status = 'accepted'
  LIMIT 1;

  -- Admin/mediator messages are handled by the notify-message Edge Function email path.
  -- In-app notifications here cover the normal client <-> firm flow.
  IF NEW.sender_id = v_job.client_id THEN
    v_recipient_id := v_firm_owner_id;
    v_sender_label := 'Klijent';
  ELSIF NEW.sender_id = v_firm_owner_id THEN
    v_recipient_id := v_job.client_id;
    v_sender_label := 'Firma';
  END IF;

  IF v_recipient_id IS NOT NULL AND v_recipient_id != NEW.sender_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, job_id)
    VALUES (
      v_recipient_id,
      'message',
      'Nova poruka',
      v_sender_label || ' vam je poslao poruku za posao "' || COALESCE(v_job.title, 'posao') || '".',
      NEW.job_id
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_new_message ON public.messages;
CREATE TRIGGER trg_notify_on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_new_message();

-- ---------------------------------------------------------------------------
-- 2. Direct/private job status changes -> notify the relevant party
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_on_direct_job_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_firm_owner_id UUID;
  v_firm_name TEXT;
  v_client_name TEXT;
  v_recipient_id UUID;
  v_title TEXT;
  v_message TEXT;
  v_type TEXT;
BEGIN
  -- Only run for private jobs where status or problem flag actually changed.
  IF NEW.is_private IS NOT TRUE OR (
    NEW.private_status IS NOT DISTINCT FROM OLD.private_status AND
    NEW.problem_reported IS NOT DISTINCT FROM OLD.problem_reported
  ) THEN
    RETURN NEW;
  END IF;

  -- Get accepted firm details.
  SELECT f.owner_id, f.name INTO v_firm_owner_id, v_firm_name
  FROM public.bids b
  JOIN public.firms f ON f.id = b.firm_id
  WHERE b.job_id = NEW.id AND b.status = 'accepted'
  LIMIT 1;

  -- Client display name.
  SELECT COALESCE(p.full_name, p.email) INTO v_client_name
  FROM public.profiles p
  WHERE p.id = NEW.client_id;

  -- Problem reported takes priority over status labels.
  IF NEW.problem_reported IS TRUE AND (OLD.problem_reported IS NOT TRUE OR OLD.problem_reported IS NULL) THEN
    v_recipient_id := v_firm_owner_id;
    v_type := 'direct_request_problem';
    v_title := 'Prijavljen problem';
    v_message := COALESCE(v_client_name, 'Klijent') || ' je prijavio problem za posao "' || COALESCE(NEW.title, 'posao') || '".';
  END IF;

  IF v_recipient_id IS NULL THEN
    CASE NEW.private_status
      WHEN 'accepted' THEN
        v_recipient_id := NEW.client_id;
        v_type := 'direct_request_accepted';
        v_title := 'Ponuda prihvaćena';
        v_message := COALESCE(v_firm_name, 'Firma') || ' je prihvatila vaš zahtjev za "' || COALESCE(NEW.title, 'posao') || '".';
      WHEN 'in_progress' THEN
      v_recipient_id := NEW.client_id;
      v_type := 'direct_request_in_progress';
      v_title := 'Rad u toku';
      v_message := COALESCE(v_firm_name, 'Firma') || ' je započela rad na "' || COALESCE(NEW.title, 'posao') || '".';
    WHEN 'done_pending' THEN
      v_recipient_id := NEW.client_id;
      v_type := 'direct_request_done';
      v_title := 'Posao gotov - potvrdite završetak';
      v_message := COALESCE(v_firm_name, 'Firma') || ' označila je "' || COALESCE(NEW.title, 'posao') || '" kao gotov. Potvrdite završetak.';
    WHEN 'completed' THEN
      v_recipient_id := v_firm_owner_id;
      v_type := 'direct_request_completed';
      v_title := 'Posao završen';
      v_message := COALESCE(v_client_name, 'Klijent') || ' je potvrdio završetak posla "' || COALESCE(NEW.title, 'posao') || '".';
    WHEN 'declined' THEN
      v_recipient_id := NEW.client_id;
      v_type := 'direct_request_declined';
      v_title := 'Zahtjev odbijen';
      v_message := COALESCE(v_firm_name, 'Firma') || ' je odbila vaš zahtjev za "' || COALESCE(NEW.title, 'posao') || '".';
    WHEN 'cancelled' THEN
      -- Notify both client and firm; the firm notification is handled in a second insert below.
      v_recipient_id := NEW.client_id;
      v_type := 'direct_request_cancelled';
      v_title := 'Zahtjev otkazan';
      v_message := 'Zahtjev "' || COALESCE(NEW.title, 'posao') || '" je otkazan.';
      ELSE
        RETURN NEW;
    END CASE;
  END IF;

  IF v_recipient_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, message, job_id)
    VALUES (v_recipient_id, v_type, v_title, v_message, NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- For cancelled, also notify the firm owner if different from client.
  IF NEW.private_status = 'cancelled' AND v_firm_owner_id IS NOT NULL AND v_firm_owner_id != NEW.client_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, job_id)
    VALUES (
      v_firm_owner_id,
      'direct_request_cancelled',
      'Zahtjev otkazan',
      'Zahtjev "' || COALESCE(NEW.title, 'posao') || '" je otkazan.',
      NEW.id
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_direct_job_change ON public.jobs;
CREATE TRIGGER trg_notify_on_direct_job_change
  AFTER UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_direct_job_change();

-- ---------------------------------------------------------------------------
-- 3. Direct/private job created -> notify the targeted firm owner
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_on_direct_job_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_owner_id UUID;
BEGIN
  IF NEW.is_private IS NOT TRUE OR NEW.target_firm_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT owner_id INTO v_owner_id
  FROM public.firms
  WHERE id = NEW.target_firm_id;

  IF v_owner_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, message, job_id)
    VALUES (
      v_owner_id,
      'direct_request',
      'Novi direktni zahtjev',
      'Dobili ste novi direktni zahtjev za ponudu: "' || COALESCE(NEW.title, 'posao') || '".',
      NEW.id
    )
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_direct_job_created ON public.jobs;
CREATE TRIGGER trg_notify_on_direct_job_created
  AFTER INSERT ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_direct_job_created();

-- Grant trigger functions permission to insert notifications.
GRANT INSERT ON public.notifications TO postgres;

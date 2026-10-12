-- ============================================================================
-- MODERACIJA POSLOVA: novi javni poslovi idu na odobrenje admina.
-- Pokrenuti u Supabase Dashboard > SQL Editor > Run.
--
-- Tok: objava (status pending_approval, admin dobija in-app + email)
--   -> admin Odobri (status open, firme dobijaju email/in-app)
--   -> admin Odbij (status rejected, klijent dobija in-app).
-- Privatni poslovi (zatraži ponudu) i dalje idu direktno kao open.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Firme se NE obavještavaju in-app za neodobrene poslove
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION notify_firms_on_new_job()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_category_name TEXT;
  v_firm RECORD;
BEGIN
  -- Moderacija: neodobreni poslovi su nevidljivi, pa nema obavijesti firmama.
  IF NEW.status = 'pending_approval' THEN
    RETURN NEW;
  END IF;

  -- Try to get category display name from a lookup table if it exists.
  BEGIN
    SELECT name INTO v_category_name
    FROM categories
    WHERE slug = NEW.category_slug;
  EXCEPTION
    WHEN undefined_table THEN
      v_category_name := NULL;
  END;

  IF v_category_name IS NULL THEN
    v_category_name := NEW.category_slug;
  END IF;

  -- Create in-app notifications for every firm covering this category
  -- that has notifications enabled.
  FOR v_firm IN
    SELECT f.id, f.owner_id, f.name
    FROM firms f
    JOIN firm_categories fc ON fc.firm_id = f.id
    WHERE fc.category_slug = NEW.category_slug
      AND fc.notify_enabled = true
  LOOP
    INSERT INTO notifications (user_id, type, title, message, job_id)
    VALUES (
      v_firm.owner_id,
      'new_job',
      'Novi posao u kategoriji: ' || v_category_name,
      'Objavljen je posao "' || COALESCE(NEW.title, 'bez naziva') || '" u gradu ' || COALESCE(NEW.city, 'nepoznato') || '. Pošaljite ponudu.',
      NEW.id
    )
    ON CONFLICT DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Admin in-app notifikacija za svaki novi posao na čekanju
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_job()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  admin_user RECORD;
BEGIN
  IF NEW.status IS DISTINCT FROM 'pending_approval' THEN
    RETURN NEW;
  END IF;

  FOR admin_user IN
    SELECT id FROM public.profiles WHERE is_admin = true
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, job_id)
    VALUES (
      admin_user.id,
      'new_job_pending',
      'Posao čeka odobrenje',
      'Novi posao "' || COALESCE(NEW.title, 'bez naziva') || '" (' ||
        COALESCE(NEW.city, 'nepoznat grad') || ') čeka vaše odobrenje.',
      NEW.id
    )
    ON CONFLICT DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_on_new_job ON public.jobs;
CREATE TRIGGER trg_notify_admins_on_new_job
  AFTER INSERT ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_new_job();

-- ---------------------------------------------------------------------------
-- 3. Webhook za email firmama TEK na odobrenje (UPDATE -> open)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_job_approved()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'UPDATE',
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

DROP TRIGGER IF EXISTS trg_notify_firms_on_approve ON public.jobs;
CREATE TRIGGER trg_notify_firms_on_approve
  AFTER UPDATE OF status ON public.jobs
  FOR EACH ROW
  WHEN (
    OLD.status IS DISTINCT FROM NEW.status
    AND NEW.status = 'open'
    AND OLD.status = 'pending_approval'
    AND NEW.is_private IS DISTINCT FROM true
  )
  EXECUTE FUNCTION public.handle_job_approved();

-- ---------------------------------------------------------------------------
-- 4. Klijent in-app notifikacija za odobren / odbijen posao
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_job_moderation_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status
     AND OLD.status = 'pending_approval'
     AND NEW.client_id IS NOT NULL THEN
    IF NEW.status = 'open' THEN
      INSERT INTO public.notifications (user_id, type, title, message, job_id)
      VALUES (
        NEW.client_id,
        'job_approved',
        'Posao odobren',
        'Vaš posao "' || COALESCE(NEW.title, 'bez naziva') || '" je odobren i vidljiv firmama. Ponude stižu uskoro.',
        NEW.id
      )
      ON CONFLICT DO NOTHING;
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (user_id, type, title, message, job_id)
      VALUES (
        NEW.client_id,
        'job_rejected',
        'Posao nije odobren',
        'Vaš posao "' || COALESCE(NEW.title, 'bez naziva') || '" nije odobren za objavu. Provjerite sadržaj i objavite ponovo.',
        NEW.id
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_job_moderation_notify ON public.jobs;
CREATE TRIGGER trg_job_moderation_notify
  AFTER UPDATE OF status ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_job_moderation_notify();

GRANT INSERT ON public.notifications TO postgres;

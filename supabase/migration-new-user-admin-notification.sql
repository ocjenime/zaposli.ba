-- ============================================================================
-- In-app obavijest adminima kad se registruje novi korisnik.
-- Pokrenuti jednom u Supabase Dashboard > SQL Editor > Run.
-- Radi synchrono u bazi (kao ostali notification triggeri), pa zvono i
-- toast kod admina reaguju istog trena preko realtime kanala.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.notify_admins_on_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  admin_user RECORD;
  v_label TEXT;
  v_role TEXT;
BEGIN
  v_label := COALESCE(NULLIF(TRIM(NEW.full_name), ''), NEW.email, 'Nepoznat korisnik');

  v_role := CASE NEW.role
    WHEN 'client' THEN 'klijent'
    WHEN 'firm' THEN 'firma'
    WHEN 'majstor' THEN 'majstor'
    ELSE COALESCE(NEW.role, 'nepoznata uloga')
  END;

  FOR admin_user IN
    SELECT id FROM public.profiles WHERE is_admin = true AND id IS DISTINCT FROM NEW.id
  LOOP
    INSERT INTO public.notifications (user_id, type, title, message, job_id)
    VALUES (
      admin_user.id,
      'new_user',
      'Novi korisnik',
      v_label || ' se registrovao kao ' || v_role || '.',
      NULL
    )
    ON CONFLICT DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_on_new_user ON public.profiles;
CREATE TRIGGER trg_notify_admins_on_new_user
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_new_user();

GRANT INSERT ON public.notifications TO postgres;

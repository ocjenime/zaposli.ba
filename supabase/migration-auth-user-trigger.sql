: Auto-create profile and firm from auth metadata
-- Ensures registration works even when email confirmation is enabled.
-- The registration form sends role/full_name/phone in user_metadata.

-- Helper for transliteration (simple)
CREATE OR REPLACE FUNCTION public.transliterate(input TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT translate(
    input,
    'ćčđšžĆČĐŠŽäöüßåøéèêëáàâãíìîïóòôõúùûñç',
    'ccdszCCDSZaouBaoAeeeeaaaaiiiiiooooouuuunc'
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
  v_full_name TEXT;
  v_phone TEXT;
  v_firm_name TEXT;
  v_slug TEXT;
  v_slug_base TEXT;
  v_suffix INTEGER := 0;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  v_phone := NEW.raw_user_meta_data->>'phone';

  -- Insert profile if not exists
  INSERT INTO public.profiles (id, email, full_name, phone, role, is_admin)
  VALUES (NEW.id, NEW.email, v_full_name, v_phone, v_role, false)
  ON CONFLICT (id) DO NOTHING;

  -- Insert firm/majstor profile if needed
  IF v_role IN ('firm', 'majstor') THEN
    v_firm_name := COALESCE(v_full_name, NEW.email);
    v_slug_base := lower(regexp_replace(transliterate(v_firm_name), '[^a-z0-9]+', '-', 'g'));
    v_slug_base := regexp_replace(v_slug_base, '^-|-$', '', 'g');
    IF v_slug_base = '' THEN
      v_slug_base := 'firma';
    END IF;
    v_slug := v_slug_base;

    -- Ensure unique slug
    WHILE EXISTS (SELECT 1 FROM public.firms WHERE slug = v_slug) LOOP
      v_suffix := v_suffix + 1;
      v_slug := v_slug_base || '-' || v_suffix;
    END LOOP;

    -- Insert firm only if user doesn't already have one
    IF NOT EXISTS (SELECT 1 FROM public.firms WHERE owner_id = NEW.id) THEN
      INSERT INTO public.firms (owner_id, name, slug, email, phone, verified, verification_status)
      VALUES (NEW.id, v_firm_name, v_slug, NEW.email, v_phone, false, 'unverified');
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also ensure notification settings (idempotent)
CREATE OR REPLACE FUNCTION public.insert_default_notification_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS insert_default_notification_settings_trigger ON auth.users;
CREATE TRIGGER insert_default_notification_settings_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.insert_default_notification_settings();

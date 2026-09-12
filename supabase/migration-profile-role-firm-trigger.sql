-- ============================================================================
-- Auto-create firm record when profile role changes to firm/majstor
-- ============================================================================
-- Admins can change a user's role in the admin panel, but the existing
-- handle_new_user() trigger only runs on auth.users INSERT. This trigger
-- ensures that whenever a profile's role is updated to 'firm' or 'majstor'
-- and the user does not already have a firm record, one is created.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_role_change_to_firm()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_firm_name TEXT;
  v_slug TEXT;
  v_slug_base TEXT;
  v_suffix INTEGER := 0;
BEGIN
  IF NEW.role IN ('firm', 'majstor') THEN
    -- Only create a firm if one does not already exist for this user
    IF NOT EXISTS (SELECT 1 FROM public.firms WHERE owner_id = NEW.id) THEN
      v_firm_name := COALESCE(NULLIF(TRIM(NEW.full_name), ''), NEW.email);
      v_slug_base := lower(regexp_replace(public.transliterate(v_firm_name), '[^a-z0-9]+', '-', 'g'));
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

      INSERT INTO public.firms (owner_id, name, slug, email, phone, verified, verification_status)
      VALUES (NEW.id, v_firm_name, v_slug, NEW.email, NEW.phone, false, 'unverified');
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_role_changed ON public.profiles;
CREATE TRIGGER on_profile_role_changed
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION public.handle_role_change_to_firm();

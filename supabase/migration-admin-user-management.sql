-- Admin user management helpers:
-- 1. Ensure firm record is created when an admin changes a profile role to firm/majstor.
-- 2. Add blocked flag so admins can disable accounts.

-- ============================================================================
-- 1. Auto-create firm on role change to firm/majstor
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_role_change_to_firm()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
DECLARE
  v_firm_name TEXT;
  v_slug TEXT;
  v_slug_base TEXT;
  v_suffix INTEGER := 0;
BEGIN
  IF NEW.role IN ('firm', 'majstor') THEN
    IF NOT EXISTS (SELECT 1 FROM public.firms WHERE owner_id = NEW.id) THEN
      v_firm_name := COALESCE(NULLIF(TRIM(NEW.full_name), ''), NEW.email);
      v_slug_base := lower(regexp_replace(public.transliterate(v_firm_name), '[^a-z0-9]+', '-', 'g'));
      v_slug_base := regexp_replace(v_slug_base, '^-|-$', '', 'g');
      IF v_slug_base = '' THEN
        v_slug_base := 'firma';
      END IF;
      v_slug := v_slug_base;

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

COMMENT ON FUNCTION public.handle_role_change_to_firm() IS 'Creates a firms row when an admin (or app) changes a profile role to firm or majstor, if none exists.';

-- ============================================================================
-- 2. Blocked flag for admin account management
-- ============================================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT false;

-- Update existing admin update policy to cover blocked (it already allows all columns)
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE USING (
  is_admin_user(auth.uid())
);

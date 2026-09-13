-- ============================================================================
-- Prevent duplicate firm profiles and remove firm creation from auth trigger
-- ============================================================================
-- Problem: the registration form and the auth-user trigger both tried to create
-- a firms row for firm/majstor registrations. Because firms only had a UNIQUE
-- constraint on slug, the same owner_id could end up with two firm rows if the
-- registration form generated a different slug than the trigger.
--
-- Fix:
-- 1. Add a UNIQUE constraint on firms.owner_id so one user can only own one firm.
-- 2. Remove the firm-insert block from handle_new_user(); the registration form
--    (direct signup) and the email-confirmation callback are now the only places
--    that create the firm, and they include city/category data collected at signup.
-- 3. Keep the profile insert and default notification settings in the trigger.
-- ============================================================================

-- Remove any duplicate firm rows that already exist (keep the oldest one per owner).
DELETE FROM public.firms
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY owner_id ORDER BY created_at ASC, id ASC) AS rn
    FROM public.firms
  ) sub
  WHERE rn > 1
);

-- Make sure one auth user can own exactly one firm.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'firms_owner_id_key'
      AND conrelid = 'public.firms'::regclass
  ) THEN
    ALTER TABLE public.firms
      ADD CONSTRAINT firms_owner_id_key UNIQUE (owner_id);
  END IF;
END
$$;

-- Re-create handle_new_user so it only inserts the profile and default
-- notification settings, not a firms row. Firm creation is handled by the app.
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
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  v_phone := NEW.raw_user_meta_data->>'phone';

  -- Insert profile if not exists
  INSERT INTO public.profiles (id, email, full_name, phone, role, is_admin)
  VALUES (NEW.id, NEW.email, v_full_name, v_phone, v_role, false)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Ensure the trigger is attached.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Default notification settings trigger is kept as-is.
CREATE OR REPLACE FUNCTION public.insert_default_notification_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS insert_default_notification_settings_trigger ON auth.users;
CREATE TRIGGER insert_default_notification_settings_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.insert_default_notification_settings();

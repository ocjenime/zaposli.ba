-- ============================================================================
-- Zaposli.ba - ADMIN ALL-IN-ONE
-- Jedan fajl koji osigurava SVE što admin panel treba u bazi.
-- Pokrenuti jednom u Supabase Dashboard > SQL Editor > Run.
-- Idempotentno: slobodno pokrenuti više puta.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Admin helper funkcija
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin_user(uid UUID)
RETURNS BOOLEAN
SET row_security = off
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = uid AND is_admin = true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_user(UUID) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 1. profiles (lista korisnika, edit, admin/block flag)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 2. firms (edit, verify toggle, delete)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "firms_update_admin" ON firms;
CREATE POLICY "firms_update_admin" ON firms
  FOR UPDATE USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "firms_delete_admin" ON firms;
CREATE POLICY "firms_delete_admin" ON firms
  FOR DELETE USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 3. firm_categories (edit kategorija firme)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "fc_insert_admin" ON firm_categories;
CREATE POLICY "fc_insert_admin" ON firm_categories
  FOR INSERT WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "fc_delete_admin" ON firm_categories;
CREATE POLICY "fc_delete_admin" ON firm_categories
  FOR DELETE USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 4. jobs (featured toggle, mediation resolve, delete)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "jobs_update_admin" ON public.jobs;
CREATE POLICY "jobs_update_admin" ON public.jobs
  FOR UPDATE USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "jobs_delete_admin" ON public.jobs;
CREATE POLICY "jobs_delete_admin" ON public.jobs
  FOR DELETE USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 5. bids (statistika, razgovori)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "bids_select_admin" ON public.bids;
CREATE POLICY "bids_select_admin" ON public.bids
  FOR SELECT USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 6. reviews (moderacija: odobri/odbij)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "reviews_select_admin" ON public.reviews;
CREATE POLICY "reviews_select_admin" ON public.reviews
  FOR SELECT USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "reviews_update_admin_moderate" ON reviews;
CREATE POLICY "reviews_update_admin_moderate" ON reviews
  FOR UPDATE USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 7. promoted_ads / plaćene objave (odobri/odbij)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "promoted_ads_admin" ON public.promoted_ads;
CREATE POLICY "promoted_ads_admin" ON public.promoted_ads
  FOR ALL USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 8. admin_requests (zahtjevi, prijave, pretplate - čitanje i obrada)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "admin_requests_select_admin" ON admin_requests;
CREATE POLICY "admin_requests_select_admin" ON admin_requests
  FOR SELECT USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "admin_requests_update_admin" ON admin_requests;
CREATE POLICY "admin_requests_update_admin" ON admin_requests
  FOR UPDATE USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 9. subscriptions (dodijeli/produži/zaustavi/obriši pretplatu)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "subscriptions_select_admin" ON subscriptions;
CREATE POLICY "subscriptions_select_admin" ON subscriptions
  FOR SELECT USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "subscriptions_insert_admin" ON subscriptions;
CREATE POLICY "subscriptions_insert_admin" ON subscriptions
  FOR INSERT WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "subscriptions_update_admin" ON subscriptions;
CREATE POLICY "subscriptions_update_admin" ON subscriptions
  FOR UPDATE USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "subscriptions_delete_admin" ON subscriptions;
CREATE POLICY "subscriptions_delete_admin" ON subscriptions
  FOR DELETE USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 10. plans (čitanje paketa)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "plans_select_admin" ON plans;
CREATE POLICY "plans_select_admin" ON plans
  FOR SELECT USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 11. payments (pregled uplata)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "payments_select_admin" ON payments;
CREATE POLICY "payments_select_admin" ON payments
  FOR SELECT USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "payments_update_admin" ON payments;
CREATE POLICY "payments_update_admin" ON payments
  FOR UPDATE USING (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 12. admin_settings (promo brojač)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "admin_settings_select_admin" ON admin_settings;
CREATE POLICY "admin_settings_select_admin" ON admin_settings
  FOR SELECT USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "admin_settings_update_admin" ON admin_settings;
CREATE POLICY "admin_settings_update_admin" ON admin_settings
  FOR UPDATE USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "admin_settings_insert_admin" ON admin_settings;
CREATE POLICY "admin_settings_insert_admin" ON admin_settings
  FOR INSERT WITH CHECK (public.is_admin_user(auth.uid()));

INSERT INTO admin_settings (key, value)
VALUES ('promo_free_premium_count', '0')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 13. messages (admin uvid + slanje u razgovorima)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "messages_insert_admin" ON public.messages;
CREATE POLICY "messages_insert_admin" ON public.messages
  FOR INSERT WITH CHECK (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- 14. verify_firm RPC (verifikacija firmi bez RLS konflikta)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.verify_firm(
  firm_id UUID,
  action TEXT,
  notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  target_status TEXT;
  is_verified BOOLEAN;
BEGIN
  IF NOT is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'Samo administrator može verifikovati firmu. uid=%, is_admin=%', auth.uid(), is_admin_user(auth.uid());
  END IF;

  IF action = 'approve' THEN
    target_status := 'verified';
    is_verified := true;
  ELSIF action = 'reject' THEN
    target_status := 'rejected';
    is_verified := false;
  ELSIF action = 'revoke' THEN
    target_status := 'unverified';
    is_verified := false;
  ELSE
    RAISE EXCEPTION 'Nepoznata akcija: %', action;
  END IF;

  UPDATE public.firms
  SET
    verification_status = target_status,
    verified = is_verified,
    verification_notes = notes
  WHERE id = firm_id;

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_firm(UUID, TEXT, TEXT) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 15. get_firm_project_counts RPC (top-firme tab "Najviše projekata")
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_firm_project_counts()
RETURNS TABLE (firm_id UUID, project_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.firm_id, COUNT(*)::BIGINT AS project_count
  FROM public.bids AS b
  JOIN public.jobs AS j ON j.id = b.job_id
  WHERE b.status = 'accepted'
    AND j.status = 'completed'
  GROUP BY b.firm_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_firm_project_counts() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 16. FIX: mediation FK kolone bez ON DELETE pravila blokiraju brisanje
--     korisnika (npr. test naloga koji je tražio medijaciju).
--     Postavi ih na SET NULL.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  conname TEXT;
BEGIN
  SELECT con.conname INTO conname
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = con.conkey[1]
  WHERE rel.relname = 'jobs'
    AND con.contype = 'f'
    AND att.attname = 'mediation_requested_by';
  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.jobs DROP CONSTRAINT %I', conname);
    ALTER TABLE public.jobs
      ADD CONSTRAINT jobs_mediation_requested_by_fkey
      FOREIGN KEY (mediation_requested_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;

  SELECT con.conname INTO conname
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = con.conkey[1]
  WHERE rel.relname = 'jobs'
    AND con.contype = 'f'
    AND att.attname = 'mediation_admin_id';
  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.jobs DROP CONSTRAINT %I', conname);
    ALTER TABLE public.jobs
      ADD CONSTRAINT jobs_mediation_admin_id_fkey
      FOREIGN KEY (mediation_admin_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

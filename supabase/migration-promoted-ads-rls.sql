-- Allow public read of active promoted ads and owner/admin management.
-- Run this after migration-promoted-ads.sql.

ALTER TABLE IF EXISTS public.promoted_ads ENABLE ROW LEVEL SECURITY;

-- Public can read only active, non-expired ads
DROP POLICY IF EXISTS "promoted_ads_select_public" ON public.promoted_ads;
CREATE POLICY "promoted_ads_select_public" ON public.promoted_ads
  FOR SELECT USING (
    status = 'active'
    AND (ends_at IS NULL OR ends_at > now())
  );

-- Firm/majstor owners can manage ads belonging to their firm
DROP POLICY IF EXISTS "promoted_ads_owner" ON public.promoted_ads;
CREATE POLICY "promoted_ads_owner" ON public.promoted_ads
  FOR ALL USING (
    firm_id IN (SELECT id FROM public.firms WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    firm_id IN (SELECT id FROM public.firms WHERE owner_id = auth.uid())
  );

-- Admins can do anything
DROP POLICY IF EXISTS "promoted_ads_admin" ON public.promoted_ads;
CREATE POLICY "promoted_ads_admin" ON public.promoted_ads
  FOR ALL USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

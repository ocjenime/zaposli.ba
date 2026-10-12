-- ============================================================================
-- BESPLATNI OGLASI: ukida se naplata - svi (firme/majstori) objavljuju besplatno.
-- Pokrenuti u Supabase Dashboard > SQL Editor > Run.
-- ============================================================================

-- 1. Ukloni limit uključenih oglasa (svi oglasi su sada besplatni i neograničeni)
DROP TRIGGER IF EXISTS included_ad_limit_trigger ON public.promoted_ads;

-- 2. Javna funkcija: firme sa aktivnim Premium paketom (za sticky vrh liste)
CREATE OR REPLACE FUNCTION public.get_premium_firm_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
SET row_security = off
AS $$
  SELECT DISTINCT s.firm_id
  FROM public.subscriptions s
  JOIN public.plans p ON p.id = s.plan_id
  WHERE p.slug = 'premium'
    AND s.status = 'active'
    AND (s.ends_at IS NULL OR s.ends_at > now());
$$;

GRANT EXECUTE ON FUNCTION public.get_premium_firm_ids() TO anon, authenticated;

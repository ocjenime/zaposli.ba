-- ============================================================================
-- Firme se više ne mogu kreirati bez grada - nijednim putem.
-- Pokrenuti jednom u Supabase Dashboard > SQL Editor > Run.
-- Postojeći redovi bez grada ostaju netaknuti (samo INSERT se kontroliše);
-- admin ih dopunjava kroz admin panel (Firme -> Uredi).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.require_firm_city()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.city IS NULL OR TRIM(NEW.city) = '' THEN
    RAISE EXCEPTION 'Grad je obavezan za profil firme. Odaberite grad u kojem radite.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_require_firm_city ON public.firms;
CREATE TRIGGER trg_require_firm_city
  BEFORE INSERT ON public.firms
  FOR EACH ROW EXECUTE FUNCTION public.require_firm_city();

COMMENT ON FUNCTION public.require_firm_city() IS 'Blokira kreiranje firme bez grada (registracija, callback, admin role-change).';

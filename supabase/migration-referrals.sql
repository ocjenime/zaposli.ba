-- Referral program + marketing attribution.
-- Pokrenuti jednom u Supabase Dashboard > SQL Editor.

-- Ko je koga doveo (postavlja aplikacija iz ?ref=<firm_slug> linka)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);

-- Izvor posjete (utm_source sa prvog dolaska, npr. facebook, viber, flajer)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS utm_source TEXT;

-- Brojač dovedenih korisnika za ulogovanu firmu (zaobilaženje RLS-a, vidi samo svoj broj)
CREATE OR REPLACE FUNCTION public.get_referral_count()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM profiles WHERE referred_by = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_referral_count() TO authenticated;

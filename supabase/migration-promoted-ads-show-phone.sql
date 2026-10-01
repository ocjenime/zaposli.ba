-- Opcija vidljivosti broja telefona na oglasu.
-- Pokrenuti jednom u Supabase Dashboard > SQL Editor > Run.

ALTER TABLE public.promoted_ads
  ADD COLUMN IF NOT EXISTS show_phone BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.promoted_ads.show_phone IS 'Da li se na oglasu prikazuje Pozovi button sa brojem firme.';

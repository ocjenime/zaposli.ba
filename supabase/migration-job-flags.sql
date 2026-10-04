-- Dodatne opcije posla sa nove objavi-projekat stranice (korak 3).
-- Pokrenuti u Supabase Dashboard > SQL Editor > Run PRIJE testiranja objave.

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS show_phone BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.jobs.is_urgent IS 'Oglas označen kao hitan.';
COMMENT ON COLUMN public.jobs.show_phone IS 'Majstori mogu direktno kontaktirati klijenta.';
COMMENT ON COLUMN public.jobs.is_anonymous IS 'Prikazuje se samo grad, bez imena klijenta.';

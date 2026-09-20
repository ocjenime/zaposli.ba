-- Seed lookup rows for the two new categories.
-- Apply in Supabase SQL Editor (the static site reads these from lib/categories.ts,
-- the lookup table is used for display names in emails/notifications).

INSERT INTO categories (slug, name, group_name) VALUES
  ('masinsko-nabacivanje', 'Mašinsko nabacivanje zidova', 'Boje, zidovi i podovi'),
  ('tlakovi-estrih', 'Tlakovi i estrih', 'Boje, zidovi i podovi')
ON CONFLICT (slug) DO NOTHING;

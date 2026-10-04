-- Seed lookup rows za Krojenje i šivanje + Tekstilne usluge.
-- Pokrenuti u Supabase Dashboard > SQL Editor > Run.

INSERT INTO categories (slug, name, group_name) VALUES
  ('krojenje-sivenje', 'Krojenje i šivanje', 'Ostalo'),
  ('tekstilne-usluge', 'Tekstilne usluge', 'Ostalo')
ON CONFLICT (slug) DO NOTHING;

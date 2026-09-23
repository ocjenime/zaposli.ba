-- Seed lookup row for the new "Zemljani radovi i iskopi" category.
-- Apply in Supabase SQL Editor (the static site reads these from lib/categories.ts,
-- the lookup table is used for display names in emails/notifications).

INSERT INTO categories (slug, name, group_name) VALUES
  ('zemljani-radovi', 'Zemljani radovi i iskopi', 'Građevina i zidarski radovi')
ON CONFLICT (slug) DO NOTHING;

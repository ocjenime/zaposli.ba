-- Job alert notifications for firms
-- Notifies firms when a new job is posted in a category they cover.
-- Email delivery is handled by Supabase Edge Function invoked via Database Webhook.

-- Add notification preference columns to firm_categories
ALTER TABLE firm_categories
  ADD COLUMN IF NOT EXISTS notify_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_enabled BOOLEAN DEFAULT true;

-- Function: notify firms when a new job is posted
CREATE OR REPLACE FUNCTION notify_firms_on_new_job()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_category_name TEXT;
  v_firm RECORD;
BEGIN
  -- Try to get category display name from a lookup table if it exists.
  BEGIN
    SELECT name INTO v_category_name
    FROM categories
    WHERE slug = NEW.category_slug;
  EXCEPTION
    WHEN undefined_table THEN
      v_category_name := NULL;
  END;

  IF v_category_name IS NULL THEN
    v_category_name := NEW.category_slug;
  END IF;

  -- Create in-app notifications for every firm covering this category
  -- that has notifications enabled.
  FOR v_firm IN
    SELECT f.id, f.owner_id, f.name
    FROM firms f
    JOIN firm_categories fc ON fc.firm_id = f.id
    WHERE fc.category_slug = NEW.category_slug
      AND fc.notify_enabled = true
  LOOP
    INSERT INTO notifications (user_id, type, title, message, job_id)
    VALUES (
      v_firm.owner_id,
      'new_job',
      'Novi posao u kategoriji: ' || v_category_name,
      'Objavljen je posao "' || COALESCE(NEW.title, 'bez naziva') || '" u gradu ' || COALESCE(NEW.city, 'nepoznato') || '. Pošaljite ponudu.',
      NEW.id
    )
    ON CONFLICT DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_firms_on_new_job_trigger ON jobs;
CREATE TRIGGER notify_firms_on_new_job_trigger
AFTER INSERT ON jobs
FOR EACH ROW
EXECUTE FUNCTION notify_firms_on_new_job();

-- Grant the trigger function permission to insert notifications
GRANT INSERT ON notifications TO postgres;
GRANT USAGE ON SEQUENCE notifications_id_seq TO postgres;

-- Optional: create a categories lookup table so emails/notifications use
-- display names. If you keep categories in lib/data.ts, you can populate this
-- table with the same values once.
CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  group_name TEXT
);

-- Example seed (run the full INSERT below or replace with your complete list):
INSERT INTO categories (slug, name, group_name) VALUES
  ('hitne-intervencije', 'Hitne intervencije', 'Hitno 24/7'),
  ('gradjevinarstvo', 'Građevinarstvo', 'Građevina i zidarski radovi'),
  ('zidarski-radovi', 'Zidarski radovi', 'Građevina i zidarski radovi'),
  ('tesarski-radovi', 'Tesarski radovi', 'Građevina i zidarski radovi'),
  ('betoniranje-i-armatura', 'Betoniranje i armatura', 'Građevina i zidarski radovi'),
  ('rusenje', 'Rušenje i odvoz šuta', 'Građevina i zidarski radovi'),
  ('krovopokrivanje', 'Krovopokrivanje', 'Krov, fasada i izolacija'),
  ('limarski-radovi', 'Limarski radovi', 'Krov, fasada i izolacija'),
  ('izolacija', 'Fasade i termoizolacija', 'Krov, fasada i izolacija'),
  ('hidroizolacija', 'Hidroizolacija', 'Krov, fasada i izolacija'),
  ('molerski-radovi', 'Molerski radovi', 'Boje, zidovi i podovi'),
  ('gipsarski-radovi', 'Gipsarski radovi', 'Boje, zidovi i podovi'),
  ('zavrsni-radovi', 'Dekorativni zidovi i mikrocement', 'Boje, zidovi i podovi'),
  ('tapetarski-radovi', 'Tapetarski radovi', 'Boje, zidovi i podovi'),
  ('keramicarski-radovi', 'Keramičarski radovi', 'Boje, zidovi i podovi'),
  ('podovi', 'Postavljanje podova', 'Boje, zidovi i podovi'),
  ('staklar', 'Staklarski radovi', 'Boje, zidovi i podovi'),
  ('kamen-i-poplocavanje', 'Kamen i popločavanje', 'Boje, zidovi i podovi'),
  ('adaptacije', 'Adaptacije stanova i kuća', 'Kupatila, kuhinje i adaptacije'),
  ('kupatila-kljuc-u-ruke', 'Kupatila ključ u ruke', 'Kupatila, kuhinje i adaptacije'),
  ('kuhinje-po-mjeri', 'Kuhinje po mjeri', 'Kupatila, kuhinje i adaptacije'),
  ('stolarija', 'Stolarija i namještaj', 'Stolarija i namještaj'),
  ('vodoinstalacije', 'Vodoinstalacije', 'Instalacije'),
  ('elektroinstalacije', 'Elektroinstalacije', 'Instalacije'),
  ('grijanje-i-hladjenje', 'Grijanje, klimatizacija i ventilacija', 'Instalacije'),
  ('plinske-instalacije', 'Plinske instalacije', 'Instalacije'),
  ('solarne-instalacije', 'Solarne instalacije', 'Instalacije'),
  ('servis-aparata', 'Servis kućanskih aparata', 'Instalacije'),
  ('kamin-i-peci', 'Kamin i peći', 'Instalacije'),
  ('sigurnost', 'Bravarstvo i sigurnosni sistemi', 'Pametni dom i sigurnost'),
  ('tehnologija', 'IT, računari i Smart Home', 'Pametni dom i sigurnost'),
  ('ciscenje', 'Čišćenje prostora', 'Čišćenje i održavanje'),
  ('pranje-fasada-i-krovova', 'Pranje fasada i krovova', 'Čišćenje i održavanje'),
  ('dimnjacar', 'Dimnjačarske usluge', 'Čišćenje i održavanje'),
  ('odrzavanje-zgrada', 'Održavanje zgrada', 'Čišćenje i održavanje'),
  ('vrtlarstvo', 'Bašta, dvorište i ozelenjavanje', 'Dvorište, bašta i okolica'),
  ('pergole-nadstresnice-tende', 'Pergole, nadstrešnice i tende', 'Dvorište, bašta i okolica'),
  ('bazeni-i-fontane', 'Bazeni i fontane', 'Dvorište, bašta i okolica'),
  ('poplocavanje-dvorista-i-terasa', 'Popločavanje dvorišta i terasa', 'Dvorište, bašta i okolica'),
  ('rusenje-stabala-drvoreda', 'Rušenje stabala i drvoreda', 'Dvorište, bašta i okolica'),
  ('ograde', 'Ograde i ograde', 'Dvorište, bašta i okolica'),
  ('varilac', 'Varilački radovi', 'Metalne konstrukcije i zavarivanje'),
  ('selidbe', 'Selidbe i kombi prevoz', 'Selidbe i prevoz'),
  ('auto-usluge', 'Auto usluge', 'Auto usluge'),
  ('projektovanje-i-arhitektura', 'Arhitektura i projektovanje', 'Projektovanje i dizajn'),
  ('dizajn-enterijera', 'Dizajn interijera', 'Projektovanje i dizajn'),
  ('dizajn-eksterijera', 'Dizajn eksterijera i pejzažna arhitektura', 'Projektovanje i dizajn'),
  ('statika-i-nadzor', 'Statika i stručni nadzor', 'Projektovanje i dizajn'),
  ('energetska-obnova', 'Energetska obnova i certifikacija', 'Projektovanje i dizajn'),
  ('ostale-usluge', 'Ostale usluge', 'Ostalo')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, group_name = EXCLUDED.group_name;

-- Allow the trigger function to read category names
GRANT SELECT ON categories TO postgres;

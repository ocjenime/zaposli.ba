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
  ('gradjevinarstvo', 'Građevinarstvo', 'Građevina i završni radovi'),
  ('adaptacije', 'Adaptacije', 'Građevina i završni radovi'),
  ('zavrsni-radovi', 'Završni radovi', 'Građevina i završni radovi'),
  ('molerski-radovi', 'Molerski radovi', 'Građevina i završni radovi'),
  ('keramicarski-radovi', 'Keramičarski radovi', 'Građevina i završni radovi'),
  ('krovopokrivanje', 'Krovopokrivanje', 'Građevina i završni radovi'),
  ('izolacija', 'Izolacija', 'Građevina i završni radovi'),
  ('rusenje', 'Rušenje i odvoz', 'Građevina i završni radovi'),
  ('vodoinstalacije', 'Vodoinstalacije', 'Instalacije'),
  ('elektroinstalacije', 'Elektroinstalacije', 'Instalacije'),
  ('grijanje-i-hladjenje', 'Grijanje i hlađenje', 'Instalacije'),
  ('ciscenje-i-odrzavanje', 'Čišćenje i održavanje', 'Održavanje i okućnica'),
  ('selidbe', 'Selidbe', 'Održavanje i okućnica'),
  ('vrt-i-okucnica', 'Vrt i okućnica', 'Održavanje i okućnica'),
  ('bravar-i-kljucar', 'Bravar i ključar', 'Održavanje i okućnica'),
  ('stolarija', 'Stolarija', 'Održavanje i okućnica'),
  ('sigurnosni-sistemi', 'Sigurnosni sistemi', 'Održavanje i okućnica'),
  ('kamini', 'Kamini', 'Održavanje i okućnica'),
  ('antikviteti', 'Antikviteti i restauracija', 'Održavanje i okućnica'),
  ('jacuzzi', 'Jacuzzi / bazeni', 'Održavanje i okućnica')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, group_name = EXCLUDED.group_name;

-- Allow the trigger function to read category names
GRANT SELECT ON categories TO postgres;

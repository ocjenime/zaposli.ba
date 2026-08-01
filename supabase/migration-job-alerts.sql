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
  -- Get category display name
  SELECT name INTO v_category_name
  FROM categories
  WHERE slug = NEW.category_slug;

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

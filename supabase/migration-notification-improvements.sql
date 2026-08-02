-- Notification system improvements
-- Adds per-user notification settings and a cleanup routine for old notifications.
-- Existing notification triggers in migration-notifications.sql remain untouched.

-- User notification preferences
CREATE TABLE IF NOT EXISTS user_notification_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT TRUE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE user_notification_settings IS 'Stores user preferences for email and in-app notifications.';

-- Ensure new users get default settings
CREATE OR REPLACE FUNCTION insert_default_notification_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS insert_default_notification_settings_trigger ON auth.users;
CREATE TRIGGER insert_default_notification_settings_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION insert_default_notification_settings();

-- Cleanup function: remove notifications older than 90 days
CREATE OR REPLACE FUNCTION delete_old_notifications()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE created_at < now() - INTERVAL '90 days';

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

COMMENT ON FUNCTION delete_old_notifications() IS 'Deletes notifications older than 90 days. Returns the number of deleted rows.';

-- Schedule cleanup via pg_cron if available, otherwise the function can be called manually.
-- Example manual run: SELECT delete_old_notifications();
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_extension
    WHERE extname = 'pg_cron'
  ) THEN
    PERFORM cron.schedule(
      'cleanup-old-notifications',
      '0 3 * * *',
      'SELECT public.delete_old_notifications();'
    );
  END IF;
END
$$;

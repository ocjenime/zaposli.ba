-- Zaposli.ba Supabase schema completion
-- Runs on top of the existing migration.sql. Idempotent: IF NOT EXISTS / ADD COLUMN IF NOT EXISTS / DROP+CREATE POLICY.
-- Note: PostgreSQL does not support "CREATE OR REPLACE POLICY", so each policy is dropped before creation.

-- ---------------------------------------------------------------------------
-- Profiles: ensure is_admin column exists and role accepts 'majstor'
-- ---------------------------------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

DO $$
DECLARE
  conname text;
BEGIN
  SELECT con.conname INTO conname
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  WHERE rel.relname = 'profiles'
    AND con.contype = 'c'
    AND pg_get_constraintdef(con.oid) LIKE '%role%';
  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE profiles DROP CONSTRAINT %I', conname);
  END IF;
END $$;

ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('client', 'firm', 'majstor'));


-- ---------------------------------------------------------------------------
-- Profiles (extends Supabase Auth)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('client', 'firm', 'majstor')),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_self" ON profiles;
CREATE POLICY "profiles_insert_self" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Firms
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  logo_url TEXT,
  verified BOOLEAN DEFAULT false,
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  registration_number TEXT,
  founded_at DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE firms ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE firms ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;
ALTER TABLE firms ADD COLUMN IF NOT EXISTS registration_number TEXT;
ALTER TABLE firms ADD COLUMN IF NOT EXISTS founded_at DATE;
ALTER TABLE firms ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

ALTER TABLE firms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "firms_select_public" ON firms;
CREATE POLICY "firms_select_public" ON firms
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "firms_insert_own" ON firms;
CREATE POLICY "firms_insert_own" ON firms
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "firms_update_own" ON firms;
CREATE POLICY "firms_update_own" ON firms
  FOR UPDATE USING (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Firm categories (many-to-many)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS firm_categories (
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL,
  PRIMARY KEY (firm_id, category_slug)
);

ALTER TABLE firm_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fc_select_public" ON firm_categories;
CREATE POLICY "fc_select_public" ON firm_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "fc_insert_own" ON firm_categories;
CREATE POLICY "fc_insert_own" ON firm_categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "fc_delete_own" ON firm_categories;
CREATE POLICY "fc_delete_own" ON firm_categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Jobs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'bidding', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs_select_public" ON jobs;
CREATE POLICY "jobs_select_public" ON jobs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "jobs_insert_own" ON jobs;
CREATE POLICY "jobs_insert_own" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "jobs_update_own" ON jobs;
CREATE POLICY "jobs_update_own" ON jobs
  FOR UPDATE USING (auth.uid() = client_id);

-- ---------------------------------------------------------------------------
-- Bids
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bids_select_job_owner" ON bids;
CREATE POLICY "bids_select_job_owner" ON bids
  FOR SELECT USING (
    auth.uid() IN (
      SELECT client_id FROM jobs WHERE id = job_id
      UNION
      SELECT owner_id FROM firms WHERE id = firm_id
    )
  );

DROP POLICY IF EXISTS "bids_insert_own" ON bids;
CREATE POLICY "bids_insert_own" ON bids
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "bids_update_job_owner" ON bids;
CREATE POLICY "bids_update_job_owner" ON bids
  FOR UPDATE USING (
    auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
  );

-- ---------------------------------------------------------------------------
-- Messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select_participant" ON messages;
CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT USING (
    auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
    OR auth.uid() IN (
      SELECT owner_id FROM firms
      WHERE id IN (
        SELECT b.firm_id FROM bids b WHERE b.job_id = messages.job_id
      )
    )
  );

DROP POLICY IF EXISTS "messages_insert_participant" ON messages;
CREATE POLICY "messages_insert_participant" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
    OR auth.uid() IN (
      SELECT owner_id FROM firms
      WHERE id IN (
        SELECT b.firm_id FROM bids b WHERE b.job_id = messages.job_id
      )
    )
  );

DROP POLICY IF EXISTS "messages_update_participant_read" ON messages;
CREATE POLICY "messages_update_participant_read" ON messages
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
    OR auth.uid() IN (
      SELECT owner_id FROM firms
      WHERE id IN (
        SELECT b.firm_id FROM bids b WHERE b.job_id = messages.job_id
      )
    )
  )
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_public" ON reviews;
CREATE POLICY "reviews_select_public" ON reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = client_id
    AND EXISTS (
      SELECT 1 FROM jobs
      WHERE id = job_id AND client_id = auth.uid() AND status = 'completed'
    )
  );

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications (user_id, read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage: review-images bucket
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('review-images', 'review-images', true, 2097152)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Storage: firm-logos bucket
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('firm-logos', 'firm-logos', true, 2097152)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "review_images_public_select" ON storage.objects;
CREATE POLICY "review_images_public_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'review-images');

DROP POLICY IF EXISTS "review_images_authenticated_insert" ON storage.objects;
CREATE POLICY "review_images_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-images');

DROP POLICY IF EXISTS "review_images_authenticated_delete_own" ON storage.objects;
CREATE POLICY "review_images_authenticated_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'review-images' AND auth.uid() = owner);

DROP POLICY IF EXISTS "firm_logos_public_select" ON storage.objects;
CREATE POLICY "firm_logos_public_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'firm-logos');

DROP POLICY IF EXISTS "firm_logos_authenticated_insert" ON storage.objects;
CREATE POLICY "firm_logos_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'firm-logos');

DROP POLICY IF EXISTS "firm_logos_authenticated_delete_own" ON storage.objects;
CREATE POLICY "firm_logos_authenticated_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'firm-logos' AND auth.uid() = owner);

-- ---------------------------------------------------------------------------
-- Trigger: keep firms.average_rating and firms.review_count in sync
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_firm_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  target_firm_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_firm_id := OLD.firm_id;
  ELSE
    target_firm_id := NEW.firm_id;
  END IF;

  UPDATE firms
  SET
    review_count = COALESCE((SELECT COUNT(*) FROM reviews WHERE firm_id = target_firm_id), 0),
    average_rating = COALESCE((SELECT AVG(rating)::DECIMAL(10,2) FROM reviews WHERE firm_id = target_firm_id), 0)
  WHERE id = target_firm_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS reviews_update_firm_rating ON reviews;
CREATE TRIGGER reviews_update_firm_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_firm_rating();
-- Notifications triggers for bid events
-- These run as SECURITY DEFINER to bypass RLS and notify the correct user

-- Function: notify client when a firm bids on their job
CREATE OR REPLACE FUNCTION notify_client_on_bid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_client_id UUID;
  v_firm_name TEXT;
  v_job_title TEXT;
BEGIN
  SELECT client_id, title INTO v_client_id, v_job_title
  FROM jobs WHERE id = NEW.job_id;

  SELECT name INTO v_firm_name
  FROM firms WHERE id = NEW.firm_id;

  IF v_client_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, job_id)
    VALUES (
      v_client_id,
      'bid_received',
      'Nova ponuda za posao',
      COALESCE(v_firm_name, 'Firma') || ' je poslala ponudu za "' || COALESCE(v_job_title, 'posao') || '"',
      NEW.job_id
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_client_on_bid_trigger ON bids;
CREATE TRIGGER notify_client_on_bid_trigger
AFTER INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION notify_client_on_bid();

-- Function: notify firm when their bid is accepted
CREATE OR REPLACE FUNCTION notify_firm_on_bid_accepted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_firm_owner_id UUID;
  v_firm_name TEXT;
  v_job_title TEXT;
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
    SELECT owner_id, name INTO v_firm_owner_id, v_firm_name
    FROM firms WHERE id = NEW.firm_id;

    SELECT title INTO v_job_title
    FROM jobs WHERE id = NEW.job_id;

    IF v_firm_owner_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, job_id)
      VALUES (
        v_firm_owner_id,
        'bid_accepted',
        'Ponuda prihvaćena',
        'Vaša ponuda za "' || COALESCE(v_job_title, 'posao') || '" je prihvaćena. Otvoren je razgovor.',
        NEW.job_id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_firm_on_bid_accepted_trigger ON bids;
CREATE TRIGGER notify_firm_on_bid_accepted_trigger
AFTER UPDATE ON bids
FOR EACH ROW
EXECUTE FUNCTION notify_firm_on_bid_accepted();

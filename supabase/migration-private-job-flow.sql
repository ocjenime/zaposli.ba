-- =============================================================================
-- Private/direct job request flow for zaposli.ba
-- =============================================================================
-- Adds support for clients sending private job requests directly to one firm,
-- tracking progress through statuses, and leaving public reviews with images.
-- Public job posting remains unchanged.
-- =============================================================================

-- =============================================================================
-- 1. Extend jobs table
-- =============================================================================
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS target_firm_id UUID REFERENCES firms(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS private_status TEXT,
  ADD COLUMN IF NOT EXISTS client_question TEXT,
  ADD COLUMN IF NOT EXISTS problem_reported BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS problem_description TEXT,
  ADD COLUMN IF NOT EXISTS disputed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS dispute_resolution TEXT,
  ADD COLUMN IF NOT EXISTS pending_deadline TIMESTAMPTZ;

-- Private jobs must have a valid status and a target firm.
ALTER TABLE jobs
  DROP CONSTRAINT IF EXISTS chk_private_job_status;
ALTER TABLE jobs
  ADD CONSTRAINT chk_private_job_status
  CHECK (is_private = false OR private_status IN ('pending','accepted','in_progress','done_pending','completed','cancelled','declined'));

ALTER TABLE jobs
  DROP CONSTRAINT IF EXISTS chk_private_job_target;
ALTER TABLE jobs
  ADD CONSTRAINT chk_private_job_target
  CHECK (is_private = false OR target_firm_id IS NOT NULL);

-- =============================================================================
-- 2. Review images table (max 3 per review)
-- =============================================================================
CREATE TABLE IF NOT EXISTS review_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION enforce_review_image_limit()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT COUNT(*) FROM review_images WHERE review_id = NEW.review_id) >= 3 THEN
    RAISE EXCEPTION 'Maksimalno 3 fotografije po recenziji';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_review_image_limit ON review_images;
CREATE TRIGGER trg_enforce_review_image_limit
BEFORE INSERT ON review_images
FOR EACH ROW EXECUTE FUNCTION enforce_review_image_limit();

-- =============================================================================
-- 3. Helper functions
-- =============================================================================
CREATE OR REPLACE FUNCTION get_firm_owner(firm_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT owner_id FROM firms WHERE id = firm_id;
$$;

CREATE OR REPLACE FUNCTION is_app_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
END;
$$;

-- =============================================================================
-- 4. Status transition validation for private jobs
-- =============================================================================
CREATE OR REPLACE FUNCTION validate_private_job_status()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  status_changed BOOLEAN := false;
  status_allowed BOOLEAN := false;
BEGIN
  IF NEW.is_private = true THEN
    status_changed := NEW.private_status IS DISTINCT FROM OLD.private_status;

    IF status_changed THEN
      -- Admin can override (dispute resolution)
      IF is_app_admin() THEN
        status_allowed := true;
      ELSIF auth.uid() = NEW.client_id THEN
        IF NEW.private_status = 'cancelled' AND OLD.private_status IN ('pending','accepted','in_progress','done_pending') THEN
          status_allowed := true;
        ELSIF NEW.private_status = 'completed' AND OLD.private_status = 'done_pending' THEN
          status_allowed := true;
        END IF;
      ELSIF auth.uid() = get_firm_owner(NEW.target_firm_id) THEN
        IF NEW.private_status = 'accepted' AND OLD.private_status = 'pending' THEN
          status_allowed := true;
        ELSIF NEW.private_status = 'declined' AND OLD.private_status = 'pending' THEN
          status_allowed := true;
        ELSIF NEW.private_status = 'in_progress' AND OLD.private_status = 'accepted' THEN
          status_allowed := true;
        ELSIF NEW.private_status = 'done_pending' AND OLD.private_status = 'in_progress' THEN
          status_allowed := true;
        ELSIF NEW.private_status = 'cancelled' AND OLD.private_status IN ('pending','accepted','in_progress') THEN
          status_allowed := true;
        END IF;
      END IF;

      IF NOT status_allowed THEN
        RAISE EXCEPTION 'Nedozvoljen prelaz statusa % -> %', OLD.private_status, NEW.private_status;
      END IF;
    END IF;

    -- Only the client can report problems
    IF NEW.problem_reported IS DISTINCT FROM OLD.problem_reported
       OR NEW.problem_description IS DISTINCT FROM OLD.problem_description THEN
      IF auth.uid() != NEW.client_id THEN
        RAISE EXCEPTION 'Samo klijent moze prijaviti problem';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_private_job_status ON jobs;
CREATE TRIGGER trg_validate_private_job_status
BEFORE UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION validate_private_job_status();

-- =============================================================================
-- 5. RLS policies for jobs (support both public and private jobs)
-- =============================================================================
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs_select_public" ON jobs;
CREATE POLICY "jobs_select_public_and_private" ON jobs
  FOR SELECT USING (
    is_private = false
    OR auth.uid() = client_id
    OR (is_private = true AND auth.uid() = get_firm_owner(target_firm_id))
    OR is_app_admin()
  );

DROP POLICY IF EXISTS "jobs_insert_own" ON jobs;
CREATE POLICY "jobs_insert_own" ON jobs
  FOR INSERT WITH CHECK (
    auth.uid() = client_id
    AND (
      is_private = false
      OR (is_private = true AND target_firm_id IS NOT NULL AND private_status = 'pending')
    )
  );

DROP POLICY IF EXISTS "jobs_update_own" ON jobs;
CREATE POLICY "jobs_update_participants" ON jobs
  FOR UPDATE USING (
    auth.uid() = client_id
    OR (is_private = true AND auth.uid() = get_firm_owner(target_firm_id))
    OR is_app_admin()
  )
  WITH CHECK (
    auth.uid() = client_id
    OR (is_private = true AND auth.uid() = get_firm_owner(target_firm_id))
    OR is_app_admin()
  );

-- =============================================================================
-- 6. RLS policies for review images
-- =============================================================================
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "review_images_public_read" ON review_images;
CREATE POLICY "review_images_public_read" ON review_images
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "review_images_client_insert" ON review_images;
CREATE POLICY "review_images_client_insert" ON review_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM reviews
      WHERE id = review_id
        AND client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "review_images_client_delete" ON review_images;
CREATE POLICY "review_images_client_delete" ON review_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM reviews
      WHERE id = review_id
        AND client_id = auth.uid()
    )
  );

-- =============================================================================
-- 7. Update reviews RLS to allow private completed jobs
-- =============================================================================
DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = client_id
    AND EXISTS (
      SELECT 1 FROM jobs
      WHERE id = job_id
        AND client_id = auth.uid()
        AND status = 'completed'
    )
  );

-- =============================================================================
-- 8. RLS policies for messages on private jobs
-- =============================================================================
DROP POLICY IF EXISTS "messages_select_participant" ON messages;
CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT USING (
    public.is_admin_user(auth.uid())
    OR auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
    OR auth.uid() IN (
      SELECT owner_id FROM firms
      WHERE id IN (
        SELECT b.firm_id FROM bids b WHERE b.job_id = messages.job_id
      )
    )
    OR auth.uid() IN (
      SELECT get_firm_owner(target_firm_id) FROM jobs
      WHERE id = job_id AND is_private = true
    )
  );

DROP POLICY IF EXISTS "messages_insert_participant" ON messages;
CREATE POLICY "messages_insert_participant" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND (
      auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
      OR auth.uid() IN (
        SELECT owner_id FROM firms
        WHERE id IN (
          SELECT b.firm_id FROM bids b WHERE b.job_id = messages.job_id
        )
      )
      OR auth.uid() IN (
        SELECT get_firm_owner(target_firm_id) FROM jobs
        WHERE id = job_id AND is_private = true
      )
    )
  );

DROP POLICY IF EXISTS "messages_update_participant_read" ON messages;
CREATE POLICY "messages_update_participant_read" ON messages
  FOR UPDATE USING (
    public.is_admin_user(auth.uid())
    OR auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id)
    OR auth.uid() IN (
      SELECT owner_id FROM firms
      WHERE id IN (
        SELECT b.firm_id FROM bids b WHERE b.job_id = messages.job_id
      )
    )
    OR auth.uid() IN (
      SELECT get_firm_owner(target_firm_id) FROM jobs
      WHERE id = job_id AND is_private = true
      )
  )
  WITH CHECK (true);

-- =============================================================================
-- 9. Storage bucket for review images
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "review-images-public-read" ON storage.objects;
CREATE POLICY "review-images-public-read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-images');

DROP POLICY IF EXISTS "review-images-authenticated-upload" ON storage.objects;
CREATE POLICY "review-images-authenticated-upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'review-images'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "review-images-owner-delete" ON storage.objects;
CREATE POLICY "review-images-owner-delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'review-images'
    AND auth.uid() = owner
  );

-- =============================================================================
-- 10. Function to auto-cancel overdue pending private jobs
-- Call this from a scheduled Edge Function or pg_cron.
-- =============================================================================
CREATE OR REPLACE FUNCTION cancel_overdue_private_jobs()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  count INTEGER;
BEGIN
  UPDATE jobs
  SET private_status = 'cancelled',
      dispute_resolution = 'Automatski otkazano nakon isteka roka'
  WHERE is_private = true
    AND private_status = 'pending'
    AND pending_deadline IS NOT NULL
    AND pending_deadline < now();

  GET DIAGNOSTICS count = ROW_COUNT;
  RETURN count;
END;
$$;

-- =============================================================================
-- 11. Webhook trigger to notify on private job status changes
-- Calls the notify-private-job Edge Function.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_private_job_change()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', 'jobs',
    'schema', 'public',
    'record', row_to_json(NEW),
    'old_record', row_to_json(OLD)
  );

  PERFORM net.http_post(
    url := 'https://nwgbrvpomjkzkofjknyi.supabase.co/functions/v1/notify-private-job',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzk4MzcsImV4cCI6MjEwMDkxNTgzN30.DAocTT5b2tcds9dIGm_nVW6y9vIm7BnVecPcZqxVa8I',
      'X-Webhook-Secret', 'zaposli-webhook-2024-secure-key'
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_private_job_change ON public.jobs;
CREATE TRIGGER trg_notify_private_job_change
  AFTER INSERT OR UPDATE ON public.jobs
  FOR EACH ROW
  WHEN (NEW.is_private = true)
  EXECUTE FUNCTION public.handle_private_job_change();

-- =============================================================================
-- 12. Allow job participants to see each other's basic profiles
-- Keeps the existing "profiles_select_own" policy while also letting clients
-- and firm owners see the names of the people they are working with.
-- =============================================================================
DROP POLICY IF EXISTS "profiles_select_participants" ON profiles;
CREATE POLICY "profiles_select_participants" ON profiles
  FOR SELECT USING (
    -- Private jobs: client can see the target firm owner, firm owner can see the client
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.is_private = true
        AND jobs.target_firm_id IS NOT NULL
        AND (
          (jobs.client_id = auth.uid() AND profiles.id = (SELECT owner_id FROM firms WHERE id = jobs.target_firm_id))
          OR
          (auth.uid() = (SELECT owner_id FROM firms WHERE id = jobs.target_firm_id) AND profiles.id = jobs.client_id)
        )
    )
    OR
    -- Public jobs with an accepted bid: the same bidirectional access
    EXISTS (
      SELECT 1 FROM bids
      JOIN jobs ON bids.job_id = jobs.id
      JOIN firms ON bids.firm_id = firms.id
      WHERE bids.status = 'accepted'
        AND (
          (jobs.client_id = auth.uid() AND profiles.id = firms.owner_id)
          OR
          (firms.owner_id = auth.uid() AND profiles.id = jobs.client_id)
        )
    )
  );

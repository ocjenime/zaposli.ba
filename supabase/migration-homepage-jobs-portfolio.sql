-- Job fields for budget, deadline, and public bid count
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS budget_min DECIMAL(10,2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS budget_max DECIMAL(10,2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS deadline DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS bids_count INTEGER DEFAULT 0;

-- Trigger: maintain bids_count on jobs when bids are inserted
CREATE OR REPLACE FUNCTION increment_job_bids_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET bids_count = bids_count + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_increment_job_bids_count ON bids;
CREATE TRIGGER trg_increment_job_bids_count
  AFTER INSERT ON bids
  FOR EACH ROW
  EXECUTE FUNCTION increment_job_bids_count();

-- Job images (multiple per job)
CREATE TABLE IF NOT EXISTS job_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE job_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "job_images_select_public" ON job_images FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "job_images_insert_own" ON job_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM jobs WHERE id = job_id AND client_id = auth.uid())
);
CREATE POLICY IF NOT EXISTS "job_images_delete_own" ON job_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM jobs WHERE id = job_id AND client_id = auth.uid())
);

-- Firm portfolio images
CREATE TABLE IF NOT EXISTS portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "portfolio_images_select_public" ON portfolio_images FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "portfolio_images_insert_own" ON portfolio_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
);
CREATE POLICY IF NOT EXISTS "portfolio_images_delete_own" ON portfolio_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('job-images', 'job-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio-images', 'portfolio-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for job-images
CREATE POLICY IF NOT EXISTS "job_images_storage_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'job-images');

CREATE POLICY IF NOT EXISTS "job_images_storage_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'job-images'
    AND EXISTS (
      SELECT 1 FROM jobs WHERE id::text = (storage.foldername(name))[1] AND client_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "job_images_storage_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'job-images'
    AND EXISTS (
      SELECT 1 FROM jobs WHERE id::text = (storage.foldername(name))[1] AND client_id = auth.uid()
    )
  );

-- Storage policies for portfolio-images
CREATE POLICY IF NOT EXISTS "portfolio_images_storage_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

CREATE POLICY IF NOT EXISTS "portfolio_images_storage_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-images'
    AND EXISTS (
      SELECT 1 FROM firms WHERE id::text = (storage.foldername(name))[1] AND owner_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "portfolio_images_storage_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-images'
    AND EXISTS (
      SELECT 1 FROM firms WHERE id::text = (storage.foldername(name))[1] AND owner_id = auth.uid()
    )
  );

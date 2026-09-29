-- ============================================================================
-- FIX: dozvoli firmama upload bannera za oglase (free trial fix)
-- ============================================================================
-- Problem: FirmAdsTab šalje banner na putanju
--   job-images / promoted-ads-banners / <firm_id> / <file>
-- ali je postojeća storage policy dozvoljavala upload samo kad je prvi
-- segment putanje ID posla čiji je vlasnik ulogovani klijent.
-- Rezultat: SVAKI pokušaj objave oglasa padao je sa RLS greškom.
--
-- Pokrenuti jednom u Supabase Dashboard > SQL Editor > Run.
-- Idempotentno: slobodno pokrenuti više puta.
-- ============================================================================

-- Osiguraj da job-images bucket postoji (bez mijenjanja postojećeg)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('job-images', 'job-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Upload: firma smije dodavati samo u svoj folder promoted-ads-banners/<firm_id>/
DROP POLICY IF EXISTS "job_images_storage_insert_ads" ON storage.objects;
CREATE POLICY "job_images_storage_insert_ads"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'job-images'
    AND split_part(name, '/', 1) = 'promoted-ads-banners'
    AND EXISTS (
      SELECT 1 FROM public.firms
      WHERE id::text = split_part(name, '/', 2)
        AND owner_id = auth.uid()
    )
  );

-- Delete: firma smije brisati samo svoje ad bannere (npr. zamjena vizuala)
DROP POLICY IF EXISTS "job_images_storage_delete_ads" ON storage.objects;
CREATE POLICY "job_images_storage_delete_ads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'job-images'
    AND split_part(name, '/', 1) = 'promoted-ads-banners'
    AND EXISTS (
      SELECT 1 FROM public.firms
      WHERE id::text = split_part(name, '/', 2)
        AND owner_id = auth.uid()
    )
  );

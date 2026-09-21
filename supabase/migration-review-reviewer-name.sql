-- Store a public display name snapshot on each review ("Firstname L.").
-- Needed because RLS only lets users read their OWN profiles row, so public
-- pages (firm profiles, homepage testimonials) cannot resolve reviewer names
-- through the profiles join. Apply in Supabase SQL Editor. Safe to re-run.

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reviewer_name TEXT;

-- Backfill existing reviews from the author's profile full name.
UPDATE reviews AS r
SET reviewer_name = (
  SELECT
    CASE
      WHEN p.full_name IS NULL OR btrim(p.full_name) = '' THEN NULL
      WHEN position(' ' IN btrim(p.full_name)) = 0 THEN btrim(p.full_name)
      ELSE
        split_part(btrim(p.full_name), ' ', 1) || ' ' ||
        upper(left(split_part(btrim(p.full_name), ' ', 2), 1)) || '.'
    END
  FROM profiles AS p
  WHERE p.id = r.client_id
)
WHERE r.reviewer_name IS NULL;

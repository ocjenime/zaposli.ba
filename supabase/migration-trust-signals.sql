-- Zaposli.ba trust signals migration
-- Adds firm verification workflow, review moderation/reply fields, and updates
-- rating aggregation to only count approved reviews.
-- Run this after migration-complete.sql.
-- Idempotent: uses IF NOT EXISTS / DROP IF EXISTS.

-- ---------------------------------------------------------------------------
-- Firms: verification workflow
-- ---------------------------------------------------------------------------
ALTER TABLE firms
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Keep the legacy `verified` boolean in sync with the new status.
UPDATE firms
SET verified = true
WHERE verification_status = 'verified' AND verified IS DISTINCT FROM true;

-- ---------------------------------------------------------------------------
-- Reviews: moderation + firm reply
-- ---------------------------------------------------------------------------
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS reply TEXT,
  ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

-- Update existing reviews to approved so the public profile stays unchanged.
UPDATE reviews SET status = 'approved' WHERE status IS NULL;

-- ---------------------------------------------------------------------------
-- Public view: premium partner status
-- Use a SECURITY DEFINER helper function for the cross-RLS lookup, but keep
-- the view itself SECURITY INVOKER so it does not trip security lint rules.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_premium_firm_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
SET row_security = off
AS $$
  SELECT DISTINCT s.firm_id
  FROM public.subscriptions s
  JOIN public.plans p ON p.id = s.plan_id
  WHERE s.status = 'active'
    AND (s.ends_at IS NULL OR s.ends_at > now())
    AND p.featured = true;
$$;

DROP VIEW IF EXISTS public_firm_premium;
CREATE VIEW public_firm_premium
WITH (security_invoker = true)
AS
SELECT get_premium_firm_ids AS firm_id
FROM public.get_premium_firm_ids();

-- ---------------------------------------------------------------------------
-- Trigger: keep firms.average_rating / review_count in sync (approved only)
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
    review_count = COALESCE((SELECT COUNT(*) FROM reviews WHERE firm_id = target_firm_id AND status = 'approved'), 0),
    average_rating = COALESCE((SELECT AVG(rating)::DECIMAL(10,2) FROM reviews WHERE firm_id = target_firm_id AND status = 'approved'), 0)
  WHERE id = target_firm_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS reviews_update_firm_rating ON reviews;
CREATE TRIGGER reviews_update_firm_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_firm_rating();

-- ---------------------------------------------------------------------------
-- Trigger: auto-set replied_at when a reply is added or removed
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_review_replied_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.reply IS DISTINCT FROM OLD.reply THEN
    IF NEW.reply IS NOT NULL AND NEW.reply <> '' THEN
      NEW.replied_at := now();
    ELSE
      NEW.replied_at := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_set_replied_at ON reviews;
CREATE TRIGGER reviews_set_replied_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION set_review_replied_at();

-- ---------------------------------------------------------------------------
-- Trigger: keep firms.verified in sync with verification_status
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION sync_firm_verified_flag()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.verified := (NEW.verification_status = 'verified');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS firms_sync_verified_flag ON firms;
CREATE TRIGGER firms_sync_verified_flag
  BEFORE INSERT OR UPDATE ON firms
  FOR EACH ROW EXECUTE FUNCTION sync_firm_verified_flag();

-- ---------------------------------------------------------------------------
-- RLS: firm owners can request verification (set status to pending only)
-- ---------------------------------------------------------------------------
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "firms_update_verification_request" ON firms;
CREATE POLICY "firms_update_verification_request" ON firms
FOR UPDATE
-- Exclude admins from this owner policy so that admin approval/rejection
-- of their own firms is not blocked by the owner-only WITH CHECK below.
USING (auth.uid() = owner_id AND NOT is_admin_user(auth.uid()))
WITH CHECK (
  auth.uid() = owner_id
  AND verification_status IN ('unverified', 'pending', 'rejected')
  AND verification_status != 'verified'
);

-- ---------------------------------------------------------------------------
-- RLS: admins can update firm verification status and notes
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "firms_update_admin_verification" ON firms;
CREATE POLICY "firms_update_admin_verification" ON firms
FOR UPDATE
USING (is_admin_user(auth.uid()))
WITH CHECK (is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- Admin RPC: bypass RLS for firm verification (avoids policy conflicts when
-- admin is also the firm owner).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.verify_firm(
  firm_id UUID,
  action TEXT,
  notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  target_status TEXT;
  is_verified BOOLEAN;
BEGIN
  IF NOT is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'Samo administrator može verifikovati firmu. uid=%, is_admin=%', auth.uid(), is_admin_user(auth.uid());
  END IF;

  IF action = 'approve' THEN
    target_status := 'verified';
    is_verified := true;
  ELSIF action = 'reject' THEN
    target_status := 'rejected';
    is_verified := false;
  ELSIF action = 'revoke' THEN
    target_status := 'unverified';
    is_verified := false;
  ELSE
    RAISE EXCEPTION 'Nepoznata akcija: %', action;
  END IF;

  UPDATE public.firms
  SET
    verification_status = target_status,
    verified = is_verified,
    verification_notes = notes
  WHERE id = firm_id;

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_user(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_firm(UUID, TEXT, TEXT) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS: firm owners can reply to reviews on their firms
-- ---------------------------------------------------------------------------
-- RLS: firm owners can reply to reviews on their firms
-- ---------------------------------------------------------------------------
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_update_firm_owner_reply" ON reviews;
CREATE POLICY "reviews_update_firm_owner_reply" ON reviews
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM firms WHERE id = firm_id AND owner_id = auth.uid())
);

-- ---------------------------------------------------------------------------
-- RLS: admins can moderate reviews
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "reviews_update_admin_moderate" ON reviews;
CREATE POLICY "reviews_update_admin_moderate" ON reviews
FOR UPDATE
USING (is_admin_user(auth.uid()))
WITH CHECK (is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- RLS: public view is public
-- ---------------------------------------------------------------------------
GRANT SELECT ON public_firm_premium TO anon, authenticated;

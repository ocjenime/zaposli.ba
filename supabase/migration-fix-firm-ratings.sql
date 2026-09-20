-- Ensure the firm rating trigger exists and backfill aggregates for all firms.
-- Apply in Supabase SQL Editor. Safe to re-run (idempotent).
-- Fixes profiles showing 0 rating / 0 reviews even when approved reviews exist.

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
-- Backfill: recompute aggregates for every firm from existing approved reviews
-- ---------------------------------------------------------------------------
UPDATE firms AS f
SET
  review_count = COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.firm_id = f.id AND r.status = 'approved'), 0),
  average_rating = COALESCE((SELECT AVG(r.rating)::DECIMAL(10,2) FROM reviews r WHERE r.firm_id = f.id AND r.status = 'approved'), 0);

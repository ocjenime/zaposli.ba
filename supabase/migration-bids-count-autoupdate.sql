-- Ensure jobs.bids_count stays accurate automatically on INSERT, DELETE, and UPDATE of bids.
-- Also correct any existing drift by recalculating from the bids table.

-- Trigger function: increment count on a new bid
CREATE OR REPLACE FUNCTION increment_job_bids_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET bids_count = COALESCE(bids_count, 0) + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function: decrement count when a bid is removed
CREATE OR REPLACE FUNCTION decrement_job_bids_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET bids_count = GREATEST(COALESCE(bids_count, 0) - 1, 0) WHERE id = OLD.job_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger function: handle job_id changes (rare, but keeps denormalized count correct)
CREATE OR REPLACE FUNCTION update_job_bids_count_on_job_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.job_id IS DISTINCT FROM NEW.job_id THEN
    UPDATE jobs SET bids_count = GREATEST(COALESCE(bids_count, 0) - 1, 0) WHERE id = OLD.job_id;
    UPDATE jobs SET bids_count = COALESCE(bids_count, 0) + 1 WHERE id = NEW.job_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers (idempotent)
DROP TRIGGER IF EXISTS trg_increment_job_bids_count ON bids;
CREATE TRIGGER trg_increment_job_bids_count
  AFTER INSERT ON bids
  FOR EACH ROW
  EXECUTE FUNCTION increment_job_bids_count();

DROP TRIGGER IF EXISTS trg_decrement_job_bids_count ON bids;
CREATE TRIGGER trg_decrement_job_bids_count
  AFTER DELETE ON bids
  FOR EACH ROW
  EXECUTE FUNCTION decrement_job_bids_count();

DROP TRIGGER IF EXISTS trg_update_job_bids_count_on_job_change ON bids;
CREATE TRIGGER trg_update_job_bids_count_on_job_change
  AFTER UPDATE OF job_id ON bids
  FOR EACH ROW
  EXECUTE FUNCTION update_job_bids_count_on_job_change();

-- Recalculate existing counts to fix any drift from previous manual edits
UPDATE jobs
SET bids_count = COALESCE(bid_counts.cnt, 0)
FROM (
  SELECT job_id, COUNT(*)::INTEGER AS cnt
  FROM bids
  GROUP BY job_id
) AS bid_counts
WHERE jobs.id = bid_counts.job_id;

-- Ensure any jobs without bids have a clean 0 count
UPDATE jobs
SET bids_count = 0
WHERE bids_count IS NULL;

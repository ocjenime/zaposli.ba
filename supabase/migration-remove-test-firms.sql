-- Remove test/demo firms from Zaposli.ba
-- Run this in the Supabase SQL Editor (requires service_role or admin privileges).
-- It deletes all firms whose slug starts with "test-" or whose name starts with "Test".

BEGIN;

-- Collect IDs of test/demo firms
WITH test_firm_ids AS (
  SELECT id
  FROM public.firms
  WHERE slug LIKE 'test-%'
     OR name ILIKE 'test%'
)

-- Explicitly clean up dependent rows first (safer even when FKs have CASCADE)
DELETE FROM public.firm_categories WHERE firm_id IN (SELECT id FROM test_firm_ids);
DELETE FROM public.portfolio_images WHERE firm_id IN (SELECT id FROM test_firm_ids);
DELETE FROM public.reviews WHERE firm_id IN (SELECT id FROM test_firm_ids);
DELETE FROM public.subscriptions WHERE firm_id IN (SELECT id FROM test_firm_ids);
DELETE FROM public.payments WHERE firm_id IN (SELECT id FROM test_firm_ids);
DELETE FROM public.bids WHERE firm_id IN (SELECT id FROM test_firm_ids);

-- Delete the firms themselves; remaining references (e.g. jobs.target_firm_id) are SET NULL
DELETE FROM public.firms WHERE id IN (SELECT id FROM test_firm_ids);

COMMIT;

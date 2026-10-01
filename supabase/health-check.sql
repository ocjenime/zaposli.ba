-- ============================================================================
-- ZAPOSLI.BA HEALTH CHECK - samo čitanje, ništa ne mijenja.
-- Pokrenuti u Supabase Dashboard > SQL Editor > Run, pa zalijepiti rezultate.
-- Svaki SELECT treba vratiti 0 redova (osim zadnja dva koja su informativna).
-- ============================================================================

-- 1. Poslovi sa pogrešnim brojačem ponuda (očekivano: 0 redova)
SELECT j.id, j.title, j.bids_count AS pise, COUNT(b.id)::INT AS stvarno
FROM jobs j
LEFT JOIN bids b ON b.job_id = j.id
GROUP BY j.id
HAVING COALESCE(j.bids_count, 0) <> COUNT(b.id)::INT;

-- 2. Firme sa pogrešnim brojem recenzija (očekivano: 0 redova)
SELECT f.id, f.name, f.review_count AS pise, COUNT(r.id)::INT AS stvarno
FROM firms f
LEFT JOIN reviews r ON r.firm_id = f.id AND r.status = 'approved'
GROUP BY f.id
HAVING COALESCE(f.review_count, 0) <> COUNT(r.id)::INT;

-- 3. Firme sa pogrešnom prosječnom ocjenom (očekivano: 0 redova)
SELECT f.id, f.name, f.average_rating AS pise, ROUND(AVG(r.rating)::NUMERIC, 2) AS stvarno
FROM firms f
JOIN reviews r ON r.firm_id = f.id AND r.status = 'approved'
GROUP BY f.id
HAVING COALESCE(f.average_rating, 0) <> ROUND(AVG(r.rating)::NUMERIC, 2);

-- 4. Nedostajući triggeri na bids (očekivano: 0 redova = svi postoje)
SELECT t AS nedostaje_trigger
FROM (VALUES
  ('trg_increment_job_bids_count'),
  ('trg_decrement_job_bids_count'),
  ('trg_update_job_bids_count_on_job_change'),
  ('bids_limit_trigger'),
  ('notify_client_on_bid_trigger'),
  ('notify_firm_on_bid_accepted_trigger'),
  ('trg_notify_admins_on_new_bid'),
  ('trg_notify_client_on_bid')
) AS need(t)
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.triggers
  WHERE event_object_table = 'bids' AND trigger_name = need.t
);

-- 5. Nedostajući triggeri na reviews (očekivano: 0 redova)
SELECT t AS nedostaje_trigger
FROM (VALUES ('reviews_update_firm_rating')) AS need(t)
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.triggers
  WHERE event_object_table = 'reviews' AND trigger_name = need.t
);

-- 6. Nedostajuće RPC funkcije (očekivano: 0 redova)
SELECT f AS nedostaje_funkcija
FROM (VALUES
  ('get_firm_project_counts'),
  ('verify_firm'),
  ('toggle_job_featured'),
  ('delete_job_admin'),
  ('get_referral_count')
) AS need(f)
WHERE NOT EXISTS (
  SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public' AND p.proname = need.f
);

-- 7. Firme bez grada ili bez kategorija = nevidljive u pretragama (očekivano: 0 redova)
SELECT f.id, f.name,
  CASE WHEN f.city IS NULL OR f.city = '' THEN 'nema grad' ELSE 'ok' END AS grad,
  CASE WHEN NOT EXISTS (SELECT 1 FROM firm_categories fc WHERE fc.firm_id = f.id) THEN 'nema kategorije' ELSE 'ok' END AS kategorije
FROM firms f
WHERE (f.city IS NULL OR f.city = '')
   OR NOT EXISTS (SELECT 1 FROM firm_categories fc WHERE fc.firm_id = f.id);

-- 8. INFORMATIVNO: broj redova po ključnim tabelama
SELECT 'jobs' AS tabela, COUNT(*) AS redova FROM jobs
UNION ALL SELECT 'bids', COUNT(*) FROM bids
UNION ALL SELECT 'firms', COUNT(*) FROM firms
UNION ALL SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL SELECT 'promoted_ads', COUNT(*) FROM promoted_ads
UNION ALL SELECT 'subscriptions', COUNT(*) FROM subscriptions;

-- 9. INFORMATIVNO: zadnjih 5 ponuda (da se vidi da sistem živi)
SELECT b.created_at, j.title AS posao, f.name AS firma, b.amount, b.status
FROM bids b
JOIN jobs j ON j.id = b.job_id
JOIN firms f ON f.id = b.firm_id
ORDER BY b.created_at DESC
LIMIT 5;

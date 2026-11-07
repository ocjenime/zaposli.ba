-- ============================================================================
-- BESPLATNI SISTEM - kompletno uklanjanje plaćanja.
-- Pokrenuti u Supabase Dashboard > SQL Editor > Run.
--
-- Sve je besplatno. Verifikacija (ID broj -> companywall) je jedini uvjet
-- za reagovanje (ponude, oglasi, poruke).
-- ============================================================================

-- 1. Ukloni SVE trigger-e vezane za pakete/limite
DROP TRIGGER IF EXISTS bids_limit_trigger ON public.bids;
DROP TRIGGER IF EXISTS included_ad_limit_trigger ON public.promoted_ads;
DROP TRIGGER IF EXISTS update_firm_priority_on_subscription ON public.subscriptions;

-- 2. Ukloni funkcije za limite i plan priority
DROP FUNCTION IF EXISTS public.enforce_bid_limit();
DROP FUNCTION IF EXISTS public.enforce_included_ad_limit();
DROP FUNCTION IF EXISTS public.get_firm_plan_priority(uuid);
DROP FUNCTION IF EXISTS public.update_firm_plan_priority();
DROP FUNCTION IF EXISTS public.get_subscription_period_start(timestamptz);

-- 3. Ukloni admin notification trigger za subscription_request
--    (više nema pretplata pa nema ni zahtjeva)
DROP TRIGGER IF EXISTS trg_admin_request_notification ON public.admin_requests;

-- 4. Sve postojeće firme: plan_priority = 0 (nema više prednosti po paketu)
UPDATE public.firms SET plan_priority = 0 WHERE plan_priority IS NOT NULL AND plan_priority <> 0;

-- 5. Sve postojeće aktivne pretplati označi kao istekle (besplatni sistem)
UPDATE public.subscriptions SET status = 'expired', ends_at = now() WHERE status = 'active';

-- 6. Informativno: stanje
SELECT 'triggers' AS tip, COUNT(*) AS broj
FROM information_schema.triggers
WHERE event_object_table IN ('bids', 'promoted_ads', 'subscriptions')
  AND trigger_name IN (
    'bids_limit_trigger',
    'included_ad_limit_trigger',
    'update_firm_priority_on_subscription',
    'trg_admin_request_notification'
  )
UNION ALL
SELECT 'active_subscriptions', COUNT(*) FROM subscriptions WHERE status = 'active'
UNION ALL
SELECT 'verified_firms', COUNT(*) FROM firms WHERE verified = true AND slug NOT LIKE 'test-%'
UNION ALL
SELECT 'unverified_firms', COUNT(*) FROM firms WHERE verified = false AND slug NOT LIKE 'test-%';

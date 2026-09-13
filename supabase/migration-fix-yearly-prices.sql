-- Fix yearly prices to match the advertised 10% discount and correct launch-yearly totals.
-- Regular yearly = 12 * monthly * 0.9
-- Launch yearly = launch_months * launch_monthly + (12 - launch_months) * regular_monthly

UPDATE plans
SET
  price_yearly = ROUND(price_monthly * 12 * 0.9, 2),
  launch_price_yearly = CASE
    WHEN launch_offer_months > 0 AND launch_price_monthly IS NOT NULL
    THEN ROUND(
      launch_offer_months * launch_price_monthly +
      (12 - launch_offer_months) * price_monthly,
      2
    )
    ELSE launch_price_yearly
  END
WHERE slug IN ('start', 'pro', 'premium');

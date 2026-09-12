-- Launch offer pricing: discounted first 3 months for paid plans

ALTER TABLE plans
ADD COLUMN IF NOT EXISTS launch_price_monthly DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS launch_price_yearly DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS launch_offer_months INT DEFAULT 3;

ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS discount_ends_at TIMESTAMPTZ;

-- Set launch prices (first 3 months discounted, regular price stays unchanged)
UPDATE plans
SET
  launch_price_monthly = CASE slug
    WHEN 'start' THEN 19
    WHEN 'pro' THEN 49
    WHEN 'premium' THEN 99
    ELSE launch_price_monthly
  END,
  launch_price_yearly = CASE slug
    WHEN 'start' THEN 190
    WHEN 'pro' THEN 490
    WHEN 'premium' THEN 990
    ELSE launch_price_yearly
  END,
  launch_offer_months = 3
WHERE slug IN ('start', 'pro', 'premium');

COMMENT ON COLUMN plans.launch_price_monthly IS 'Discounted monthly price during the launch offer period.';
COMMENT ON COLUMN plans.launch_offer_months IS 'Number of first months that launch pricing applies.';
COMMENT ON COLUMN subscriptions.discount_ends_at IS 'When the launch/introductory discount period ends.';

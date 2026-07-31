-- Apply 10% discount to yearly subscription prices
-- Yearly price = monthly price * 12 * 0.9

UPDATE plans
SET price_yearly = ROUND(price_monthly * 12 * 0.9, 2)
WHERE slug IN ('start', 'pro', 'premium');

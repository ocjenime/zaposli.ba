-- Ensure notification preference columns exist on firm_categories
ALTER TABLE public.firm_categories
ADD COLUMN IF NOT EXISTS notify_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_enabled BOOLEAN DEFAULT true;

COMMENT ON COLUMN public.firm_categories.notify_enabled IS 'Whether the firm receives in-app notifications for this category.';
COMMENT ON COLUMN public.firm_categories.email_enabled IS 'Whether the firm receives email notifications for this category.';

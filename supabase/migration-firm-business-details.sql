-- Add business registration and founding date fields to firm profiles
ALTER TABLE public.firms
ADD COLUMN IF NOT EXISTS registration_number TEXT,
ADD COLUMN IF NOT EXISTS founded_at DATE;

-- Add a helpful comment describing the columns
COMMENT ON COLUMN public.firms.registration_number IS 'Company registration number (e.g. court/ID number).';
COMMENT ON COLUMN public.firms.founded_at IS 'Date when the company was founded.';

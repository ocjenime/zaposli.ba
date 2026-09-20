-- Secure RPC returning completed-project counts per firm (accepted bids on
-- completed jobs). Exposes only aggregate counts, no bid amounts or details.
-- Apply in Supabase SQL Editor. Used by the /top-firme/ "Najviše projekata" tab.

CREATE OR REPLACE FUNCTION public.get_firm_project_counts()
RETURNS TABLE (firm_id UUID, project_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.firm_id, COUNT(*)::BIGINT AS project_count
  FROM public.bids AS b
  JOIN public.jobs AS j ON j.id = b.job_id
  WHERE b.status = 'accepted'
    AND j.status = 'completed'
  GROUP BY b.firm_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_firm_project_counts() TO anon, authenticated;

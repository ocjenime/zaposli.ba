-- Public RPC function to return accepted-bid price statistics per category.
-- Uses SECURITY DEFINER so anonymous users can read aggregates without seeing individual bids.
create or replace function public.get_category_price_stats(p_category_slug text)
returns table (
  min_amount numeric,
  avg_amount numeric,
  max_amount numeric,
  bid_count bigint
)
language sql
security definer
stable
as $$
  select
    min(b.amount)::numeric as min_amount,
    round(avg(b.amount))::numeric as avg_amount,
    max(b.amount)::numeric as max_amount,
    count(*)::bigint as bid_count
  from public.bids b
  join public.jobs j on j.id = b.job_id
  where j.category_slug = p_category_slug
    and b.status = 'accepted'
    and b.amount is not null
    and b.amount > 0;
$$;

grant execute on function public.get_category_price_stats(text) to anon, authenticated;

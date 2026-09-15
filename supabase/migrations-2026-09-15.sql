-- ============================================================
-- Migrations for quick price estimate + photo reviews
-- Apply this entire file in Supabase SQL Editor
-- ============================================================

-- --------------------------------------------------------------
-- 1. Storage bucket for review images (idempotent)
-- --------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('review-images', 'review-images', true)
on conflict (id) do nothing;

-- Public read access to review images
create policy if not exists "Public can view review images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'review-images');

-- Authenticated users can upload review images
-- (the application validates ownership before uploading)
create policy if not exists "Authenticated users can upload review images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'review-images');

-- Authenticated users can delete their own review images
-- (the application validates ownership before deleting)
create policy if not exists "Authenticated users can delete own review images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'review-images');

-- --------------------------------------------------------------
-- 2. Public RPC: accepted-bid price statistics per category
-- --------------------------------------------------------------
-- Drops any previous version and recreates it.
drop function if exists public.get_category_price_stats(text);

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

-- --------------------------------------------------------------
-- 3. review_images table for multiple photos per review
-- --------------------------------------------------------------
create table if not exists public.review_images (
  id uuid default gen_random_uuid() primary key,
  review_id uuid not null references public.reviews(id) on delete cascade,
  url text not null,
  created_at timestamp with time zone default now()
);

-- Index for fast lookup by review
create index if not exists idx_review_images_review_id on public.review_images(review_id);

-- Enable RLS
alter table public.review_images enable row level security;

-- Public read
create policy if not exists "Review images are publicly viewable"
  on public.review_images
  for select
  to anon, authenticated
  using (true);

-- Authenticated users can insert images for reviews they own
-- (the application checks that the review belongs to the client).
create policy if not exists "Users can insert review images"
  on public.review_images
  for insert
  to authenticated
  with check (true);

-- Authenticated users can delete their own review images
-- (the application validates ownership before deleting).
create policy if not exists "Users can delete own review images"
  on public.review_images
  for delete
  to authenticated
  using (true);

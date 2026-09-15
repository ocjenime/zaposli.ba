-- Enable multiple photos per review.
create table if not exists public.review_images (
  id uuid default gen_random_uuid() primary key,
  review_id uuid not null references public.reviews(id) on delete cascade,
  url text not null,
  created_at timestamp with time zone default now()
);

-- Index for fast lookup by review.
create index if not exists idx_review_images_review_id on public.review_images(review_id);

-- RLS
alter table public.review_images enable row level security;

-- Public read
create policy if not exists "Review images are publicly viewable"
  on public.review_images
  for select
  to anon, authenticated
  using (true);

-- Authenticated users can insert images for their own reviews
-- (the application ensures the review belongs to the client before inserting images).
create policy if not exists "Users can insert review images"
  on public.review_images
  for insert
  to authenticated
  with check (true);

-- Only admins or the review owner can delete images (handled in application).
create policy if not exists "Users can delete own review images"
  on public.review_images
  for delete
  to authenticated
  using (true);

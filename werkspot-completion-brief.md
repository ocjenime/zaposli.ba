# Zaposli.ba ÔÇö Werkspot-Style Feature Completion

## Project Context
- Repo: `C:\Users\Lenovo\Documents\Default Project\zaposli.ba`
- Stack: Next.js 15 (App Router, static export), TypeScript, Tailwind CSS, Supabase
- Auth: Supabase Auth with profiles/firms/jobs/bids/messages/reviews tables
- Host: GitHub Pages + GitHub Actions (static export)
- GitHub secrets already set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Current state: basic auth works, minimal dashboards, job posting saves to Supabase, firm bidding is temporarily removed
- Designer standard: "Collins" ÔÇö senior web designer, 10 years, Pentagram-level detail, no em-dashes, compact spacing

## Goal
Make the platform fully functional like werkspot.nl: client posts jobs, firms bid, clients accept bids, real-time messaging, job completion, reviews with photos and 1-5 star ratings, firm profiles, notifications, and polished responsive UI.

## Shared Rules for ALL Agents
1. **Static export only**: `next.config.js` stays `output: 'export'`. No API routes. Use Supabase client directly from `'use client'` components.
2. **No em-dashes / en-dashes / spaced hyphens in copy**. Use colons, periods, or commas. Already enforced; don't reintroduce.
3. **Minimal, compact, professional UI** (Tailwind). Avoid giant gaps; current section spacing is `py-10 md:py-14`.
4. **All new pages must build with `npm run build`**. Fix TypeScript errors.
5. **RLS policies must be correct** before frontend relies on them.
6. **Commit in small, logical chunks** with Bosnian/Croatian/Serbian commit messages. Push to `main` only when explicitly asked by the user or the lead agent.
7. **Never expose Supabase `service_role` key**. Only use the public `anon` key.
8. **Prefer existing patterns**: Header, Footer, `lib/supabase.ts`, `lib/auth-context.tsx`, `lib/data.ts` for categories/cities.

## Agent 1: Backend & Database (Supabase SQL + policies)

### Deliverables
1. **SQL migration file** in `supabase/migration-complete.sql` with all fixes and new tables.
2. **Fix existing RLS policies** in the database (run via SQL Editor).
3. **Add missing tables/columns**:
   - `notifications`: id, user_id, type, title, message, read, job_id, created_at
   - `conversations` (optional, but preferred if it simplifies messaging): id, job_id, participant_1, participant_2, created_at
   - Ensure `messages` table already exists; add `read` boolean default false
   - Add `completed_at` to `jobs`
   - Add `average_rating` and `review_count` to `firms` (computed via trigger or updated via function)
   - Add `review_images` table if multiple images per review needed (or keep single `image_url` in reviews)
4. **Storage bucket**: `review-images` with RLS policies (authenticated upload, public read, 2MB limit enforced client-side).
5. **Database functions/triggers** (optional but recommended):
   - Function to update firm average rating after review insert
   - Function to create notification on new bid, accepted bid, new message, job completion
6. **Document all SQL** in the migration file and provide a summary of what was changed.

### Constraints
- Must work with static export (no Edge Functions unless needed for triggers; triggers are fine).
- Do not change existing column names without updating frontend references.
- Keep foreign keys and ON DELETE CASCADE clean.

## Agent 2: Frontend Dashboards & Job Flow

### Deliverables
1. **Client dashboard** (`/dashboard/`):
   - List of client's jobs with status badges (open, bidding, in_progress, completed, cancelled)
   - Each job card shows title, city, status, bid count
   - Clicking a job opens `/dashboard/poslovi/[id]/` (new page) with job details and bids
   - Buttons: "Otka┼żi posao", "Ozna─Źi kao zavr┼íen", "Pogledaj ponude"
2. **Job detail page** (`/dashboard/poslovi/[id]/`):
   - Shows job title, description, city, status
   - Lists all bids with firm name, amount, message, date
   - Client can "Prihvati ponudu" ÔÇö sets bid status to accepted, job status to in_progress, rejects other bids
   - Client can "Ozna─Źi kao zavr┼íen" ÔÇö sets job status to completed
   - Link to conversation with accepted firm
3. **Firm dashboard** (`/dashboard/firma/`):
   - Restore job list with "Po┼íalji ponudu" form
   - List of firm's own bids with status (pending/accepted/rejected)
   - Link to conversation for accepted jobs
4. **Update `/objavi-projekat/`**:
   - Already functional; add image upload to Supabase Storage (optional, can be added later)
   - Ensure category/city mapping is correct
5. **Make all forms robust**: validation, loading states, error messages, success messages.
6. **Responsive design** for all dashboards.

### Constraints
- Use existing `useAuth()` and `supabase` client.
- No server components; use `'use client'` for all dynamic pages.
- Use `generateStaticParams` if needed, but for dynamic `/dashboard/poslovi/[id]/` with static export, we can use a catch-all route or query params. Since static export can't know all job IDs at build time, use `/dashboard/poslovi/` with `?id=UUID` pattern, or use a client-side router param hack. Prefer `?id=` query string for simplicity.
- Keep URL paths consistent with `trailingSlash: true`.

## Agent 3: Messaging, Reviews, Firm Profiles & Polish

### Deliverables
1. **Real-time messaging** between client and firm:
   - Page `/dashboard/razgovor/?job_id=UUID` or similar
   - Shows job title at top
   - Chat bubble UI, auto-scroll to bottom
   - Supabase real-time subscription for new messages
   - Mark messages as read
2. **Review system**:
   - After job is completed, client sees "Ostavi recenziju" button
   - Form: 1-5 star rating (interactive), comment text, optional image upload (max 2MB)
   - Save to `reviews` table and `review_images` if applicable
   - Show reviews on firm public profile page
3. **Firm public profile page** (`/firma/[slug]/`):
   - Reuse existing `/firma/[id]/` or create `/firma-profil/[slug]/`
   - Shows firm name, city, description, logo, average rating, review count, list of reviews
4. **Firm profile editor** (`/dashboard/firma/profil/`):
   - Edit name, description, city, phone, logo upload, categories
5. **Polish**:
   - Loading skeletons/spinners
   - Empty states
   - Error handling with user-friendly messages
   - Mobile menu logout already added; ensure it works everywhere
   - Update homepage firm stats to pull real review count from Supabase (optional)

### Constraints
- Image upload: validate file type (jpg/png/webp) and size (2MB) before upload.
- Real-time must be cleaned up on unmount.
- Firm public profile must be statically generated for SEO where possible; with static export we can't know all slugs at build time, so use `'use client'` with slug from URL.

## Coordination Notes
- **Agent 1 should finish first** so the database schema is ready before Agents 2 and 3 rely on it.
- Agents 2 and 3 can work in parallel once SQL is ready.
- **Use `lib/supabase.ts` and `lib/auth-context.tsx`**; do not create duplicate clients.
- **Test with `npm run build`** before declaring done.
- **Final integration**: one agent (or the lead) merges all changes, rebuilds, and pushes to main.

## Success Criteria
- Client can register, login, post a job, view bids, accept a bid, chat with firm, mark job complete, leave review with photo.
- Firm can register, login, view open jobs, submit bid, chat, see accepted jobs, edit profile.
- No "Application error" pages.
- No build errors.
- Mobile responsive.
- All copy clean (no dashes).

## Reference URLs
- Werkspot.nl (general UX pattern)
- Current live site: https://ocjenime.github.io/zaposli.ba/

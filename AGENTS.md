# AGENTS.md — zaposli.ba

## Objective
- Complete, deploy, and harden a Werkspot-style marketplace (Zaposli.ba) so every page, link, and flow works smoothly, looks premium, and is free of bugs; then migrate to Vercel for proper Next.js runtime support.

## Important Details
- Canonical domain: `https://zaposli.ba` (apex). `https://www.zaposli.ba` redirects to apex via Vercel.
- Site is now hosted on Vercel; every push to `main` auto-deploys.
- GitHub Pages workflow `.github/workflows/deploy.yml` is disabled (`if: false` on jobs); `CNAME` and `public/CNAME` removed.
- `next.config.js` uses conditional export: `output: 'export'` only when `GITHUB_PAGES=true` (set in the disabled workflow).
- `SITE_URL` in Supabase is set to `https://zaposli.ba`.
- Supabase project ref: `nwgbrvpomjkzkofjknyi`.
- Edge Functions env vars: `SB_SERVICE_ROLE_KEY`, `SB_URL`, `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`, `SITE_URL`, `WEBHOOK_SECRET=zaposli-webhook-2024-secure-key`.
- Private job statuses: `pending`, `accepted`, `in_progress`, `done_pending`, `completed`, `declined`, `cancelled`.
- Date formatting uses deterministic `lib/date.ts` helpers because Node.js `toLocaleDateString('bs-BA')` produced malformed month output like `M08` on the build machine.
- In-app notifications are emitted for `bid_received`, `new_job`, `bid_accepted`, and `review`.
- Em dash (`—`) and en dash (`–`) characters are not used in user-facing UI text; they are replaced with simple ASCII hyphens (`-`) or removed to avoid font/glyph rendering issues.

## Work State
### Completed
- Switched canonical domain from `www.zaposli.ba` to `zaposli.ba`.
- Fixed broken “back to firm profile” link in `app/zatrazi-ponudu/page.tsx`.
- Fixed `NotificationBell.tsx` and `dashboard/notifications/page.tsx` RLS filters by `user_id`.
- Fixed `admin/page.tsx` typo `ODGOBRENA` → `ODOBRENA`.
- Fixed `Footer.tsx` privacy link text to `Politika privatnosti`.
- Fixed `lib/jsonld.tsx` logo URL to `/images/logo-mark.png`.
- Improved `app/layout.tsx` accessibility by allowing pinch zoom.
- Created `app/not-found.tsx` with a custom 404 page.
- Created `/zaboravljena-lozinka/` flow and linked it from `/prijava/`.
- Added proper metadata to `/prijava/`, `/registracija/`, `/nova-lozinka/`, and `/zaboravljena-lozinka/`.
- Fixed duplicated `| Zaposli.ba` in `<title>` by changing root template to `'%s'`.
- Added `/zaboravljena-lozinka/` to `sitemap.ts`.
- Added admin-page security note for static export.
- Added `.eslintrc.json` (`next/core-web-vitals`) and fixed all lint errors.
- Added in-app notifications for `bid_received`, `new_job`, `bid_accepted`, and `review`.
- Updated and redeployed Edge Functions `notify-client-on-bid` and `notify-firms-on-job`.
- Created `lib/date.ts` with deterministic `formatDate`, `formatDateTime`, and `formatMonthYear` helpers.
- Replaced all client-side `toLocaleDateString('bs-BA')` usages with deterministic helpers.
- Updated Edge Functions `notify-admin` and `notify-client-on-bid` to use deterministic date formatting.
- Added GitHub Actions workflow to deploy Supabase Edge Functions using `SUPABASE_ACCESS_TOKEN`.
- Pushed latest code to `main`, verified `npm run build` succeeds, and confirmed Edge Functions redeployed (endpoints return `401`).
- Fixed firm “last active” tracking by adding a global `FirmActivityTracker` component so firm/majstor users are marked active on any page, not just the dashboard.
- Added missing cities: Bužim, Ključ, Bosanski Petrovac, Drvar, Bosanska Krupa, Bosanski Novi, Tešanj, Kalesije, Kladanj, Srebrenica, Neum.
- Finalized categories taxonomy with 50 categories in 15 groups, added missing trades (betoniranje, hidroizolacija, tapetar, kuhinje po mjeri, kupatila ključ u ruke, popločavanje, pergole, pranje fasada/krovova, dizajn eksterijera, statika, energetska obnova), fixed Bosnian names and icons, and seeded `categories` lookup table via `supabase/migration-job-alerts.sql`.
- Fixed the categories migration SQL by removing the invalid `notifications_id_seq` grant that caused the seed to fail.
- Verified the latest static build generates 2392 pages without errors.
- Re-checked every link on `/kategorije/zavrsni-radovi/` (164 internal links) and confirmed all return 200.
- Completed QA round 2 across the public site: ran a full internal crawl of 2,412 unique URLs; with retries GitHub Pages returned 0 broken links and 0 connection errors (two transient 503s were confirmed as CDN rate-limit false positives).
- Fixed missing page metadata on client-only pages by adding server-side wrappers/layouts with titles and Open Graph tags for `/top-firme/`, `/za-firme/`, `/objavi-projekat/` and `/zatrazi-ponudu/`.
- Prepared `next.config.js` for Vercel: `output: 'export'` only when `GITHUB_PAGES=true`.
- Updated `.github/workflows/deploy.yml` to set `GITHUB_PAGES=true` and disabled the GitHub Pages workflow.
- Migrated the project to Vercel (`zaposli-ba` project) and deployed successfully.
- Added custom domains to Vercel: `zaposli.ba` (primary) and `www.zaposli.ba` (redirects to apex).
- Updated DNS at registrar: `zaposli.ba` A record → `216.198.79.1`; `www.zaposli.ba` CNAME → `a914dc9ffe22997f.vercel-dns-017.com`.
- Removed `CNAME` and `public/CNAME` files.
- Updated Supabase `SITE_URL` to `https://zaposli.ba`.
- Upgraded `next` to `15.5.22`, `react`/`react-dom` to `^19.0.1`, aligned `eslint-config-next` and optional `@next/swc-win32-x64-msvc`.
- Closed Vercel auto-generated security PR #1 (manual upgrade on `main` is newer and includes the same CVE patch).
- Replaced all em/en dashes (`—` / `–`) with simple ASCII hyphens (`-`) across user-facing UI text in `app`, `components`, and `lib` to eliminate the glyph/symbol issue reported in the “Hitne intervencije” header and other texts.
- User confirmed the fix is acceptable; no further separator changes needed.
- Added `bids_count` auto-maintenance migration (`supabase/migration-bids-count-autoupdate.sql`) with triggers for INSERT, DELETE, and UPDATE of `bids`, plus a recalculation of existing counts.
- Updated `/poslovi/` (`ProjectsPageClient.tsx`) to always display the bids count badge in the job card, matching the homepage behavior.
- `supabase/migration-bids-count-autoupdate.sql` applied to production by user.
- Added a new `supabase/migration-jobs-delete-policy.sql` migration that adds `jobs_delete_own` RLS policy so clients can delete their own jobs.
- Updated `/dashboard/` to let clients edit and delete their own jobs when status is `open` or `bidding`.
- Deleting a job also removes associated `job-images` storage objects before the row is deleted; cascading foreign keys clean up `bids`, `job_images` rows, and `messages.job_id` is set to NULL.

### Active
- Waiting to apply `supabase/migration-jobs-delete-policy.sql` to the live Supabase database.

### Blocked
- Cannot execute the migration locally because `SUPABASE_ACCESS_TOKEN` is not available in the environment. Either the user runs the SQL in the Supabase SQL Editor or provides the access token so `npx supabase` can apply it.

## Next Move
- Apply `supabase/migration-jobs-delete-policy.sql` to production (user runs in SQL Editor or provides token).
- Verify that accepted/cancelled jobs are no longer visible on `/poslovi/` and that edit/delete buttons appear on the client dashboard for open/bidding jobs.

## Relevant Files
- `components/HeroSection.tsx`: hero banner text and emergency badge.
- `app/layout.tsx`: site metadata titles.
- `app/admin/page.tsx`: admin placeholders and separators.
- `app/admin/SubscriptionEditModal.tsx`: subscription details.
- `app/dashboard/firma/page.tsx` and `app/dashboard/poslovi/page.tsx`: dashboard labels and budget ranges.
- `app/dashboard/page.tsx`: client dashboard, job list, edit/delete modals.
- `supabase/migration-bids-count-autoupdate.sql`: keep `jobs.bids_count` accurate automatically.
- `supabase/migration-jobs-delete-policy.sql`: RLS delete policy for `jobs`.
- `app/dashboard/razgovor/page.tsx`: admin preview label.
- `app/firma-profil/FirmProfileContent.tsx`: private request label.
- `app/objavi-projekat/page.tsx`: optional deadline label and budget display.
- `app/poslovi/ProjectsPageClient.tsx`: project listings and filters.
- `components/EmergencyProcessAnimation.tsx`, `components/Footer.tsx`, `components/Header.tsx`, `components/ui/LiveStatsSection.tsx`: UI labels and comments.
- `lib/categories.ts`: category names and descriptions.
- `next.config.js`: conditional static export for Vercel/GitHub Pages.
- `.github/workflows/deploy.yml`: disabled GitHub Pages workflow.
- `lib/site.ts`: canonical URL.
- `lib/date.ts`: deterministic date formatting.
- `lib/data.ts`: cities and FAQ data.
- `components/FirmActivityTracker.tsx`: global firm activity heartbeat.
- `lib/hooks/useFirmActivityHeartbeat.ts`: `last_active_at` update logic.
- `supabase/migration-job-alerts.sql`: `categories` seed + job-alert trigger.
- `.github/workflows/deploy-supabase-functions.yml`: automated Edge Function deployment.
- `AGENTS.md`: this state file.

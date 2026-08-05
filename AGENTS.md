# AGENTS.md — zaposli.ba

## Objective
- Complete, deploy, and harden a Werkspot-style marketplace (Zaposli.ba) so every page, link, and flow works smoothly, looks premium, and is free of bugs; then migrate to Vercel for proper Next.js runtime support.

## Important Details
- Canonical domain: `https://zaposli.ba` (apex). `https://www.zaposli.ba` redirects to apex.
- GitHub Pages deploys via `Build and deploy to GitHub Pages` workflow on pushes to `main`.
- `CNAME` and `public/CNAME` contain `zaposli.ba`.
- SSL/TLS certificate is issued and HTTPS is enforced.
- Static export on GitHub Pages cannot provide true server-side route protection; `/admin` and `/dashboard/*` use client-side guards plus Supabase RLS.
- `SITE_URL` in Supabase should be `https://zaposli.ba` so emails use the canonical domain.
- Supabase project ref: `nwgbrvpomjkzkofjknyi`.
- Edge Functions env vars: `SB_SERVICE_ROLE_KEY`, `SB_URL`, `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`, `SITE_URL`, `WEBHOOK_SECRET=zaposli-webhook-2024-secure-key`.
- Private job statuses: `pending`, `accepted`, `in_progress`, `done_pending`, `completed`, `declined`, `cancelled`.
- Date formatting uses deterministic `lib/date.ts` helpers because Node.js `toLocaleDateString('bs-BA')` produced malformed month output like `M08` on the build machine.
- In-app notifications are emitted for `bid_received`, `new_job`, `bid_accepted`, and `review`.

## Work State
### Completed
- Switched canonical domain from `www.zaposli.ba` to `zaposli.ba` (CNAME, `lib/site.ts`, metadata, email fallbacks, Edge Functions).
- Fixed broken “back to firm profile” link in `app/zatrazi-ponudu/page.tsx`.
- Ran multiple QA rounds; fixed bugs across auth, dashboard, admin, and public pages.
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
- Re-checked every link on `/kategorije/zavrsni-radovi/` (164 internal links) and confirmed all return 200; the earlier broken-link report is now resolved.
- Completed QA round 2 across the public site: ran a full internal crawl of 2,412 unique URLs; with retries GitHub Pages returned 0 broken links and 0 connection errors (two transient 503s were confirmed as CDN rate-limit false positives).
- Fixed missing page metadata on client-only pages by adding server-side wrappers/layouts with titles and Open Graph tags for `/top-firme/`, `/za-firme/`, `/objavi-projekat/` and `/zatrazi-ponudu/`.
- Refactored `/top-firme/` and `/za-firme/` into server `page.tsx` (metadata + canonical) + client `Content` components so SEO tags are prerendered without changing functionality.
- Verified the local static export now serves the correct titles for `/top-firme/`, `/za-firme/`, `/objavi-projekat/` and `/zatrazi-ponudu/`.
- Confirmed header mobile menu renders correctly, contact form has required fields, all public static pages return 200, and the 404 page works.

### Active / In Progress
- QA round 2 is complete locally; waiting for the next deploy so the metadata fixes can be verified live before Vercel migration.

### Blocked
- No current blockers.

## Next Move
1. Deploy the latest fixes (push to `main` so GitHub Pages rebuilds and verify live metadata).
2. Then proceed with the Vercel migration:
   - Import repo into a Vercel project.
   - Configure env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, etc.).
   - Set DNS A/AAAA records to Vercel.
   - Disable GitHub Pages.
   - Update `SITE_URL` in Supabase to `https://zaposli.ba`.

## Relevant Files
- `CNAME` / `public/CNAME`: apex domain for GitHub Pages.
- `lib/site.ts`: canonical URL.
- `lib/date.ts`: deterministic date formatting helpers.
- `lib/categories.ts`: category definitions and taxonomy.
- `lib/data.ts`: cities and FAQ data.
- `app/kategorije/page.tsx`: categories listing page.
- `app/kategorije/[slug]/page.tsx`: category detail pages.
- `components/FirmActivityTracker.tsx`: global firm activity heartbeat.
- `app/not-found.tsx`: custom 404 page.
- `app/prijava/`, `app/registracija/`, `app/nova-lozinka/`, `app/zaboravljena-lozinka/`: auth pages with metadata wrappers.
- `app/admin/page.tsx`: admin dashboard (client-side guards).
- `components/NotificationBell.tsx`, `app/dashboard/notifications/page.tsx`: notification UI.
- `lib/notifications.ts`: notification routing.
- `supabase/functions/notify-admin/index.ts`: admin email formatting.
- `supabase/functions/notify-client-on-bid/index.ts`: bid notification formatting.
- `.github/workflows/deploy-supabase-functions.yml`: automated Edge Function deployment.
- `.eslintrc.json`: ESLint config.

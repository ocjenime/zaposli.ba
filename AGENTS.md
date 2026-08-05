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
- Pushed latest code to `main` and verified `npm run build` succeeds.

### Active / In Progress
- Need to redeploy the updated Edge Functions to Supabase so email templates use the new date formatting.
- Preparing Vercel migration for tonight.

### Blocked
- Supabase Edge Function deployment requires an access token. `npx supabase functions deploy` failed with `LegacyPlatformAuthRequiredError` because the environment is not logged in.

## Next Move
1. Authenticate Supabase CLI (run `supabase login` or set `SUPABASE_ACCESS_TOKEN`) then deploy:
   ```bash
   npx supabase functions deploy notify-admin notify-client-on-bid --project-ref nwgbrvpomjkzkofjknyi
   ```
2. Proceed with Vercel migration:
   - Import repo into Vercel project.
   - Configure env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, etc.).
   - Set DNS A/AAAA records to Vercel.
   - Disable GitHub Pages.
   - Update `SITE_URL` in Supabase to `https://zaposli.ba`.

## Relevant Files
- `CNAME` / `public/CNAME`: apex domain for GitHub Pages.
- `lib/site.ts`: canonical URL.
- `lib/date.ts`: deterministic date formatting helpers.
- `app/not-found.tsx`: custom 404 page.
- `app/prijava/`, `app/registracija/`, `app/nova-lozinka/`, `app/zaboravljena-lozinka/`: auth pages with metadata wrappers.
- `app/admin/page.tsx`: admin dashboard (client-side guards).
- `components/NotificationBell.tsx`, `app/dashboard/notifications/page.tsx`: notification UI.
- `lib/notifications.ts`: notification routing.
- `supabase/functions/notify-admin/index.ts`: admin email formatting.
- `supabase/functions/notify-client-on-bid/index.ts`: bid notification formatting.
- `.eslintrc.json`: ESLint config.

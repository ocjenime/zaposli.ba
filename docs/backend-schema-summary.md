# Backend schema summary

This document describes the schema additions and RLS changes in `supabase/migration-complete.sql` for the Zaposli.ba werkspot-style marketplace.

## New table

- `notifications`
  - `id uuid PK`
  - `user_id uuid -> profiles(id)`
  - `type text`
  - `title text`
  - `message text`
  - `read boolean default false`
  - `job_id uuid -> jobs(id) ON DELETE SET NULL`
  - `created_at timestamptz default now()`
  - Indexed on `(user_id, read)`.
  - RLS: users can select/insert/update/delete only their own notifications.

## New / fixed columns

- `firms.average_rating DECIMAL(3,2) DEFAULT 0`
- `firms.review_count INT DEFAULT 0`
- `jobs.completed_at TIMESTAMPTZ`
- `messages.read BOOLEAN DEFAULT false`

## Storage

- Bucket `review-images` created (`public`, 2MB `file_size_limit`).
- `storage.objects` policies:
  - Public `SELECT` for the bucket.
  - Authenticated `INSERT` into the bucket (client enforces 2MB).
  - Authenticated `DELETE` only of files they own.

## RLS fixes

- All existing policies are recreated idempotently via `DROP POLICY IF EXISTS ...; CREATE POLICY ...`.
- Fixed the ambiguous `job_id = job_id` predicate in the `messages` insert/update policies.
- Added a `messages_update_participant_read` policy so participants can mark messages as read.

## Trigger

- `update_firm_rating()` recalculates `firms.average_rating` and `firms.review_count` from `reviews` after every insert, update or delete on `reviews`.

## Notes

- PostgreSQL does not support `CREATE OR REPLACE POLICY`; policies are dropped and recreated to remain idempotent.
- The public `anon` key is used on the client. No service_role key is required for these schema changes.
- All new columns have defaults so existing frontend queries continue to work.

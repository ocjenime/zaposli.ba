-- Migration: Allow administrators to send messages inside any conversation
-- (support / dispute resolution) while keeping the existing participant policy.

-- Ensure the existing participant INSERT policy remains untouched.
-- We add a separate admin INSERT policy so the two rules are independent.

DROP POLICY IF EXISTS "messages_insert_admin" ON public.messages;

CREATE POLICY "messages_insert_admin" ON public.messages
  FOR INSERT WITH CHECK (
    public.is_admin_user(auth.uid())
  );

-- Admin smije kreirati firmu za drugog korisnika (npr. prebacivanje
-- klijenta u majstora kroz admin panel, gdje firma još ne postoji).
-- Pokrenuti u Supabase Dashboard > SQL Editor > Run.

DROP POLICY IF EXISTS "firms_insert_admin" ON firms;
CREATE POLICY "firms_insert_admin" ON firms
  FOR INSERT WITH CHECK (public.is_admin_user(auth.uid()));

-- ============================================================================
-- Klijent može uređivati vlastitu recenziju (ocjena + komentar).
-- Rok od 30 dana se provjerava u aplikaciji (review.created_at).
-- Pokrenuti jednom u Supabase Dashboard > SQL Editor > Run.
-- Idempotentno: slobodno pokrenuti više puta.
-- ============================================================================

DROP POLICY IF EXISTS "reviews_update_own" ON reviews;
CREATE POLICY "reviews_update_own" ON reviews
  FOR UPDATE USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

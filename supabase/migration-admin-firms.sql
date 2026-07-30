-- Admin panel: full edit support for firms and firm categories
-- Run this in Supabase SQL Editor after migration-admin-requests.sql

-- Helper function (idempotent, same as previous migrations)
CREATE OR REPLACE FUNCTION is_admin_user(uid UUID)
RETURNS BOOLEAN
SET row_security = off
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = uid AND is_admin = true);
END;
$$;

-- ---------------------------------------------------------------------------
-- Firms: admin can update and delete any firm
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "firms_update_admin" ON firms;
CREATE POLICY "firms_update_admin" ON firms
  FOR UPDATE USING (is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "firms_delete_admin" ON firms;
CREATE POLICY "firms_delete_admin" ON firms
  FOR DELETE USING (is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- Firm categories: admin can manage categories for any firm
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "fc_insert_admin" ON firm_categories;
CREATE POLICY "fc_insert_admin" ON firm_categories
  FOR INSERT WITH CHECK (is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "fc_delete_admin" ON firm_categories;
CREATE POLICY "fc_delete_admin" ON firm_categories
  FOR DELETE USING (is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- Plans: admin can manage subscription plans
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "plans_select_admin" ON plans;
CREATE POLICY "plans_select_admin" ON plans
  FOR SELECT USING (is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "plans_insert_admin" ON plans;
CREATE POLICY "plans_insert_admin" ON plans
  FOR INSERT WITH CHECK (is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "plans_update_admin" ON plans;
CREATE POLICY "plans_update_admin" ON plans
  FOR UPDATE USING (is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "plans_delete_admin" ON plans;
CREATE POLICY "plans_delete_admin" ON plans
  FOR DELETE USING (is_admin_user(auth.uid()));

-- Fix RLS infinite recursion for admin policies on profiles
-- This uses a SECURITY DEFINER function with row_security off to bypass recursion

-- Create helper function to check if a user is admin
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

-- Fix select policy
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (is_admin_user(auth.uid()));

-- Fix update policy (admin can update any profile)
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE USING (is_admin_user(auth.uid()));

-- Ensure admin flag column exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set the specified user as admin
-- Run this after the user has signed up
UPDATE profiles
SET is_admin = true
WHERE email = 'ivanovmail92@icloud.com';

-- If the profile does not exist, insert it (requires the user to exist in auth.users)
INSERT INTO profiles (id, email, full_name, role, is_admin)
SELECT id, email, 'Admin', 'client', true
FROM auth.users
WHERE email = 'ivanovmail92@icloud.com'
  AND NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'ivanovmail92@icloud.com');

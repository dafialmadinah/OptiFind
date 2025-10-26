-- Safe Migration: Change users.id from BIGINT to UUID
-- This preserves existing data by creating new UUID for each user
-- Run this in Supabase SQL Editor

BEGIN;

-- 1. Add temporary UUID column to users
ALTER TABLE users ADD COLUMN new_id UUID DEFAULT gen_random_uuid();

-- 2. Update all existing users to have UUID
UPDATE users SET new_id = gen_random_uuid() WHERE new_id IS NULL;

-- 3. Add temporary UUID column to barangs
ALTER TABLE barangs ADD COLUMN new_pelapor_id UUID;

-- 4. Map old pelapor_id to new UUID
-- WARNING: This will LOSE the connection between users and their barangs!
-- You need to manually map if you want to preserve relationships
UPDATE barangs b
SET new_pelapor_id = (SELECT new_id FROM users WHERE id::text = b.pelapor_id::text LIMIT 1);

-- 5. Drop old foreign key
ALTER TABLE barangs DROP CONSTRAINT IF EXISTS barangs_pelapor_id_fkey;

-- 6. Drop old columns
ALTER TABLE users DROP COLUMN id;
ALTER TABLE barangs DROP COLUMN pelapor_id;

-- 7. Rename new columns to original names
ALTER TABLE users RENAME COLUMN new_id TO id;
ALTER TABLE barangs RENAME COLUMN new_pelapor_id TO pelapor_id;

-- 8. Make id PRIMARY KEY
ALTER TABLE users ADD PRIMARY KEY (id);

-- 9. Re-add foreign key constraint
ALTER TABLE barangs 
  ADD CONSTRAINT barangs_pelapor_id_fkey 
  FOREIGN KEY (pelapor_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

-- 10. Make sure pelapor_id is NOT NULL
ALTER TABLE barangs ALTER COLUMN pelapor_id SET NOT NULL;

-- 11. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 12. Create RLS Policies
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON users;
CREATE POLICY "Public users are viewable by everyone"
ON users FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Users can insert via service role" ON users;
CREATE POLICY "Users can insert via service role"
ON users FOR INSERT
TO service_role
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own record" ON users;
CREATE POLICY "Users can update own record"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

COMMIT;

-- NOTES:
-- ⚠️ WARNING: This migration will BREAK the relationship between existing users and their barangs
-- because we're creating new UUIDs for existing users, not using their Supabase Auth UUID
-- 
-- Recommendation: If you have important data, it's better to:
-- 1. Export your data
-- 2. Drop and recreate tables (use migration-users-to-uuid.sql)
-- 3. Re-import data with proper Supabase Auth UUIDs

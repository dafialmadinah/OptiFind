-- Migration: Change users.id from BIGINT to UUID
-- Run this in Supabase SQL Editor

-- IMPORTANT: Backup your data first!
-- This will delete all existing users data

BEGIN;

-- 1. Drop foreign key constraints from barangs table
ALTER TABLE barangs DROP CONSTRAINT IF EXISTS barangs_pelapor_id_fkey;

-- 2. Drop existing users table (WARNING: This deletes all user data!)
-- If you have existing users, you need to migrate them manually
DROP TABLE IF EXISTS users CASCADE;

-- 3. Create new users table with UUID
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  no_telepon TEXT,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Change barangs.pelapor_id to UUID
ALTER TABLE barangs 
  ALTER COLUMN pelapor_id TYPE UUID USING pelapor_id::text::uuid;

-- 5. Re-add foreign key constraint
ALTER TABLE barangs 
  ADD CONSTRAINT barangs_pelapor_id_fkey 
  FOREIGN KEY (pelapor_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;

-- 6. Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for users table
-- Everyone can read users
CREATE POLICY "Public users are viewable by everyone"
ON users FOR SELECT
TO authenticated, anon
USING (true);

-- Authenticated users can insert their own record
CREATE POLICY "Users can insert via service role"
ON users FOR INSERT
TO service_role
WITH CHECK (true);

-- Users can update their own data
CREATE POLICY "Users can update own record"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 8. Create index for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

COMMIT;

-- NOTES:
-- 1. This script DELETES all existing users
-- 2. If you have existing users, export them first and re-import after migration
-- 3. Make sure to run this in Supabase SQL Editor
-- 4. After running this, you can register new users with UUID

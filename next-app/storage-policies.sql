-- =======================================
-- SUPABASE STORAGE POLICIES
-- Bucket: foto_barang
-- =======================================
-- Run this SQL in Supabase SQL Editor or via psql
-- to fix "new row violates row-level security policy" error

-- =======================================
-- 1. ALLOW AUTHENTICATED USERS TO UPLOAD
-- =======================================
CREATE POLICY "Allow authenticated users to upload to foto_barang"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'foto_barang');

-- =======================================
-- 2. ALLOW PUBLIC READ ACCESS
-- (needed if bucket is public and you want to list files)
-- =======================================
CREATE POLICY "Allow public read access to foto_barang"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'foto_barang');

-- =======================================
-- 3. ALLOW USERS TO UPDATE/DELETE THEIR OWN FILES (OPTIONAL)
-- =======================================
-- Uncomment below if you want users to update/delete only their own uploads
-- This requires storing user id in the file path or metadata

-- CREATE POLICY "Allow users to update own files in foto_barang"
-- ON storage.objects
-- FOR UPDATE
-- TO authenticated
-- USING (bucket_id = 'foto_barang' AND (storage.foldername(name))[1] = auth.uid()::text)
-- WITH CHECK (bucket_id = 'foto_barang');

-- CREATE POLICY "Allow users to delete own files in foto_barang"
-- ON storage.objects
-- FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'foto_barang' AND (storage.foldername(name))[1] = auth.uid()::text);

-- =======================================
-- ALTERNATIVE: SIMPLER POLICY (if you want to allow all authenticated users full access)
-- =======================================
-- Uncomment below if you want all authenticated users to update/delete any file in the bucket

-- CREATE POLICY "Allow authenticated full access to foto_barang"
-- ON storage.objects
-- FOR ALL
-- TO authenticated
-- USING (bucket_id = 'foto_barang')
-- WITH CHECK (bucket_id = 'foto_barang');

-- =======================================
-- NOTES
-- =======================================
-- 1. The bucket 'foto_barang' should be created in Supabase Dashboard first
-- 2. Set bucket to "Public" if you want files accessible via public URL without signed URLs
-- 3. After running these policies, uploads from authenticated users will work
-- 4. To test: try uploading a file from your app after running this SQL

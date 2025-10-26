-- =======================================
-- COMPLETE MIGRATION WITH RLS POLICIES
-- Run this in Supabase SQL Editor
-- =======================================

BEGIN;

-- =======================================
-- 1. HAPUS SEMUA TABEL JIKA SUDAH ADA
-- =======================================
DROP TABLE IF EXISTS barangs CASCADE;
DROP TABLE IF EXISTS kategoris CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =======================================
-- 2. EKSTENSI UNTUK UUID
-- =======================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================================
-- 3. TABEL USERS (UUID)
-- =======================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  no_telepon TEXT,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  email_verified_at TIMESTAMPTZ,
  password TEXT NOT NULL,
  remember_token TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =======================================
-- 4. TABEL KATEGORIS
-- =======================================
CREATE TABLE kategoris (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =======================================
-- 5. TABEL STATUSES
-- =======================================
CREATE TABLE statuses (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =======================================
-- 6. TABEL BARANGS
-- =======================================
CREATE TABLE barangs (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  tipe TEXT CHECK (tipe IN ('hilang', 'temuan')) NOT NULL,
  kategori_id BIGINT REFERENCES kategoris(id) ON DELETE SET NULL,
  pelapor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  waktu TIMESTAMPTZ,
  lokasi TEXT,
  kontak TEXT,
  deskripsi TEXT,
  foto TEXT,
  status_id BIGINT REFERENCES statuses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =======================================
-- 7. INDEX UNTUK PERFORMA
-- =======================================
CREATE INDEX idx_barangs_kategori_id ON barangs(kategori_id);
CREATE INDEX idx_barangs_status_id ON barangs(status_id);
CREATE INDEX idx_barangs_pelapor_id ON barangs(pelapor_id);
CREATE INDEX idx_barangs_tipe ON barangs(tipe);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- =======================================
-- 8. ENABLE ROW LEVEL SECURITY
-- =======================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE barangs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kategoris ENABLE ROW LEVEL SECURITY;
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;

-- =======================================
-- 9. RLS POLICIES - USERS
-- =======================================

-- Everyone can view all users (for displaying pelapor info)
CREATE POLICY "users_select_all"
ON users FOR SELECT
TO authenticated, anon
USING (true);

-- Service role can insert (for registration)
CREATE POLICY "users_insert_service"
ON users FOR INSERT
TO service_role
WITH CHECK (true);

-- Users can update their own profile
CREATE POLICY "users_update_own"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can delete their own account
CREATE POLICY "users_delete_own"
ON users FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- =======================================
-- 10. RLS POLICIES - BARANGS
-- =======================================

-- Everyone can view all barangs (public listings)
CREATE POLICY "barangs_select_all"
ON barangs FOR SELECT
TO authenticated, anon
USING (true);

-- Authenticated users can insert barangs
CREATE POLICY "barangs_insert_auth"
ON barangs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = pelapor_id);

-- Users can update their own barangs
CREATE POLICY "barangs_update_own"
ON barangs FOR UPDATE
TO authenticated
USING (auth.uid() = pelapor_id)
WITH CHECK (auth.uid() = pelapor_id);

-- Users can delete their own barangs
CREATE POLICY "barangs_delete_own"
ON barangs FOR DELETE
TO authenticated
USING (auth.uid() = pelapor_id);

-- =======================================
-- 11. RLS POLICIES - KATEGORIS
-- =======================================

-- Everyone can view kategoris
CREATE POLICY "kategoris_select_all"
ON kategoris FOR SELECT
TO authenticated, anon
USING (true);

-- Authenticated users can insert kategoris (auto-create from barang form)
CREATE POLICY "kategoris_insert_auth"
ON kategoris FOR INSERT
TO authenticated
WITH CHECK (true);

-- =======================================
-- 12. RLS POLICIES - STATUSES
-- =======================================

-- Everyone can view statuses
CREATE POLICY "statuses_select_all"
ON statuses FOR SELECT
TO authenticated, anon
USING (true);

-- Only service role can manage statuses
CREATE POLICY "statuses_insert_service"
ON statuses FOR INSERT
TO service_role
WITH CHECK (true);

-- =======================================
-- 13. SEED DATA - KATEGORIS
-- =======================================
INSERT INTO kategoris (nama) VALUES
  ('Elektronik'),
  ('Dokumen'),
  ('Tas & Dompet'),
  ('Aksesoris'),
  ('Kendaraan'),
  ('Pakaian'),
  ('Alat Tulis'),
  ('Kunci'),
  ('Kartu (KTP/SIM/ATM)'),
  ('Lainnya')
ON CONFLICT (nama) DO NOTHING;

-- =======================================
-- 14. SEED DATA - STATUSES
-- =======================================
INSERT INTO statuses (nama) VALUES
  ('Belum Dikembalikan'),
  ('Sudah Dikembalikan'),
  ('Dalam Proses')
ON CONFLICT (nama) DO NOTHING;

COMMIT;

-- =======================================
-- 15. VERIFIKASI
-- =======================================
SELECT 'Migration completed successfully!' as status;

SELECT 'Users table:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Kategoris table:', COUNT(*) FROM kategoris
UNION ALL
SELECT 'Statuses table:', COUNT(*) FROM statuses
UNION ALL
SELECT 'Barangs table:', COUNT(*) FROM barangs;

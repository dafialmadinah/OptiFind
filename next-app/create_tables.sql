-- =======================================
-- HAPUS SEMUA TABEL JIKA SUDAH ADA
-- (urutannya penting karena ada foreign key)
-- =======================================
DROP TABLE IF EXISTS barangs CASCADE;
DROP TABLE IF EXISTS kategoris CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =======================================
-- EKSTENSI UNTUK UUID
-- =======================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================================
-- TABEL USERS (UUID)
-- =======================================
CREATE TABLE IF NOT EXISTS users (
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
-- TABEL KATEGORIS
-- =======================================
CREATE TABLE IF NOT EXISTS kategoris (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =======================================
-- TABEL STATUSES
-- =======================================
CREATE TABLE IF NOT EXISTS statuses (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =======================================
-- TABEL BARANGS
-- =======================================
CREATE TABLE IF NOT EXISTS barangs (
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
-- INDEX TAMBAHAN
-- =======================================
CREATE INDEX IF NOT EXISTS idx_barangs_kategori_id ON barangs(kategori_id);
CREATE INDEX IF NOT EXISTS idx_barangs_status_id ON barangs(status_id);
CREATE INDEX IF NOT EXISTS idx_barangs_pelapor_id ON barangs(pelapor_id);
CREATE INDEX IF NOT EXISTS idx_barangs_tipe ON barangs(tipe);

-- end of file

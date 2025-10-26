-- Seed Data untuk Kategoris dan Statuses
-- Jalankan setelah migration schema

-- =======================================
-- INSERT KATEGORIS (Auto-increment ID)
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
-- INSERT STATUSES (Auto-increment ID)
-- =======================================
INSERT INTO statuses (nama) VALUES
  ('Belum Dikembalikan'),
  ('Sudah Dikembalikan'),
  ('Dalam Proses')
ON CONFLICT (nama) DO NOTHING;

-- =======================================
-- VERIFIKASI DATA
-- =======================================
SELECT 'Kategoris:' as info, COUNT(*) as total FROM kategoris
UNION ALL
SELECT 'Statuses:' as info, COUNT(*) as total FROM statuses;

-- Tampilkan semua data
SELECT * FROM kategoris ORDER BY id;
SELECT * FROM statuses ORDER BY id;

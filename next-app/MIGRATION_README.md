# Database Migration Guide: BIGINT to UUID

## ❗ Masalah

Error: `invalid input syntax for type bigint: "uuid-string"`

**Penyebab:** Tabel `users` masih menggunakan `BIGINT` untuk kolom `id`, tapi Supabase Auth menggunakan `UUID`.

## ✅ Solusi

### Langkah 1: Pilih Strategi Migration

#### Opsi A: Fresh Start (Database Kosong) - RECOMMENDED
Jika belum ada data production atau data bisa dihapus:

1. Buka **Supabase Dashboard**
2. SQL Editor → New Query
3. Copy-paste isi file `migration-users-to-uuid.sql`
4. Klik **Run**
5. ✅ Done! Tabel `users` sekarang menggunakan UUID

#### Opsi B: Preserve Data (Advanced)
Jika ada data penting yang harus dipertahankan:

⚠️ **WARNING:** Migration ini akan memutus hubungan antara users dan barangs yang sudah ada!

Gunakan file `migration-users-to-uuid-safe.sql` ATAU:

1. Export data users:
   ```sql
   SELECT * FROM users;
   ```
   Save hasilnya

2. Export data barangs:
   ```sql
   SELECT * FROM barangs;
   ```
   Save hasilnya

3. Jalankan `migration-users-to-uuid.sql` (hapus semua data)

4. Untuk setiap user lama:
   - Buat akun baru via Supabase Dashboard → Authentication → Add User
   - Catat UUID yang digenerate
   - Insert ke tabel users dengan UUID tersebut:
     ```sql
     INSERT INTO users (id, name, username, email, no_telepon, password, role)
     VALUES ('uuid-dari-auth', 'name', 'username', 'email', 'phone', 'hashed-password', 'user');
     ```

5. Update barangs dengan UUID yang baru

---

### Langkah 2: Verifikasi

Setelah migration, cek tipe data:

1. Buka Supabase → Table Editor → users
2. Klik kolom `id`
3. Pastikan Type = `uuid` ✅ (bukan `int8` atau `bigint`)

---

### Langkah 3: Setup RLS Policies

Jika belum ada, jalankan SQL ini:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE barangs ENABLE ROW LEVEL SECURITY;

-- Policy untuk users: Everyone can read
CREATE POLICY "Public users are viewable by everyone"
ON users FOR SELECT
TO authenticated, anon
USING (true);

-- Policy untuk users: Service role can insert
CREATE POLICY "Users can insert via service role"
ON users FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy untuk users: Users can update their own
CREATE POLICY "Users can update own record"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Policy untuk barangs: Everyone can read
CREATE POLICY "Public barangs are viewable by everyone"
ON barangs FOR SELECT
TO authenticated, anon
USING (true);

-- Policy untuk barangs: Authenticated users can insert
CREATE POLICY "Authenticated users can create barangs"
ON barangs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = pelapor_id);

-- Policy untuk barangs: Users can update their own
CREATE POLICY "Users can update their own barangs"
ON barangs FOR UPDATE
TO authenticated
USING (auth.uid() = pelapor_id);
```

---

### Langkah 4: Test Registration

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka `/register`

3. Register user baru

4. Cek di Supabase:
   - Authentication → Users (harus ada user baru dengan UUID)
   - Table Editor → users (harus ada record dengan UUID yang sama)

5. ✅ Jika berhasil, data user masuk ke kedua tempat!

---

## 🔍 Troubleshooting

### Error: "new row violates row-level security policy"

**Solusi:** Pastikan RLS policy sudah dibuat (Langkah 3)

### Error: "duplicate key value violates unique constraint"

**Solusi:** Email atau username sudah terdaftar. Coba dengan email/username lain.

### Error: "permission denied for table users"

**Solusi:** 
1. Pastikan `SUPABASE_SERVICE_ROLE_KEY` ada di `.env.local`
2. Atau, ubah policy insert menjadi untuk `authenticated` users

---

## 📝 Summary

Setelah migration selesai:

- ✅ `users.id` bertipe UUID
- ✅ `barangs.pelapor_id` bertipe UUID
- ✅ Foreign key relationship tetap berfungsi
- ✅ RLS policies aktif
- ✅ Registration flow berfungsi dengan Supabase Auth

---

## 🚀 Quick Start (Database Kosong)

Jika database masih kosong, jalankan ini:

```bash
# 1. Copy isi migration-users-to-uuid.sql
# 2. Paste di Supabase SQL Editor
# 3. Run
# 4. Test register user baru
# 5. ✅ Done!
```

Total waktu: ~5 menit

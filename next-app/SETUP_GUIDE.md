# OptiFind - Setup Guide

Panduan lengkap setup aplikasi OptiFind dari awal sampai siap digunakan.

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account
- Git (optional)

---

## 🚀 Step-by-Step Setup

### 1. Clone/Download Project

```bash
cd OptiFind/next-app
npm install
```

### 2. Setup Supabase Project

#### A. Buat Project Baru di Supabase
1. Buka https://supabase.com
2. Login/Sign up
3. Klik "New Project"
4. Isi:
   - Name: `OptiFind` (atau nama lain)
   - Database Password: (catat password ini!)
   - Region: Southeast Asia (Singapore) - recommended
5. Tunggu ~2 menit sampai project ready

#### B. Jalankan Database Migration

1. Buka Supabase Dashboard → **SQL Editor**
2. Klik **New Query**
3. Copy seluruh isi file `complete-migration.sql`
4. Paste ke SQL Editor
5. Klik **Run** (F5)
6. ✅ Tunggu sampai selesai (should see "Migration completed successfully!")

File `complete-migration.sql` akan:
- ✅ Create 4 tables: users, barangs, kategoris, statuses
- ✅ Setup UUID untuk users.id
- ✅ Enable Row Level Security (RLS)
- ✅ Create RLS Policies
- ✅ Insert seed data (10 kategoris + 3 statuses)

#### C. Setup Storage Bucket

1. Supabase Dashboard → **Storage**
2. Klik **New bucket**
3. Name: `foto_barang`
4. **Public bucket**: ✅ ON (centang)
5. Klik **Create bucket**

**Setup Storage Policy:**
1. Klik bucket `foto_barang` → **Policies**
2. Klik **New policy** → Select **For full customization**
3. **Policy 1 - Public Read**:
   - Policy name: `Public read access`
   - Target roles: `public`
   - Policy definition:
     ```sql
     SELECT
     ```
   - WITH CHECK: (kosongkan)
   - Klik **Review** → **Save policy**

4. **Policy 2 - Authenticated Upload**:
   - Policy name: `Authenticated users can upload`
   - Target roles: `authenticated`
   - Policy definition:
     ```sql
     INSERT
     ```
   - WITH CHECK:
     ```sql
     (bucket_id = 'foto_barang')
     ```
   - Klik **Review** → **Save policy**

#### D. Disable Email Confirmation (untuk testing)

1. Supabase Dashboard → **Authentication** → **Providers**
2. Klik **Email**
3. **Confirm email**: ❌ OFF (matikan)
4. Klik **Save**

**⚠️ PENTING:** Di production, nyalakan kembali email confirmation!

### 3. Environment Variables

#### A. Dapatkan Supabase Keys

1. Supabase Dashboard → **Settings** → **API**
2. Copy keys berikut:
   - **URL** (`https://xxx.supabase.co`)
   - **anon / public** key
   - **service_role** key (show dulu, lalu copy)

#### B. Buat File `.env.local`

Buat file baru `.env.local` di root project:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# NextAuth (untuk password hashing)
NEXTAUTH_SECRET=your-random-secret-key-here
```

**Generate NEXTAUTH_SECRET:**
```bash
# Di terminal, jalankan:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy hasil dan paste ke NEXTAUTH_SECRET
```

### 4. Verifikasi Setup

#### A. Check Database

1. Supabase → **Table Editor**
2. Pastikan ada 4 tables:
   - ✅ `users` (dengan kolom `id` type UUID)
   - ✅ `barangs`
   - ✅ `kategoris` (harus ada 10 rows)
   - ✅ `statuses` (harus ada 3 rows)

#### B. Check Storage

1. Supabase → **Storage**
2. Pastikan ada bucket `foto_barang` (public)

### 5. Run Development Server

```bash
npm run dev
```

Buka http://localhost:3000

✅ Aplikasi siap digunakan!

---

## 🧪 Testing Flow

### Test 1: Register & Login

1. Buka http://localhost:3000/register
2. Isi form register:
   - Name: `Test User`
   - Username: `testuser`
   - Email: `test@example.com`
   - No. Telepon: `081234567890`
   - Password: `password123`
3. Klik **Daftar**
4. ✅ Should redirect to `/barangs`
5. Check di Supabase:
   - **Authentication** → Users (harus ada user baru)
   - **Table Editor** → users (harus sync)

### Test 2: Lapor Barang Hilang

1. Pastikan sudah login
2. Buka `/barangs/lapor-hilang`
3. Isi form:
   - Nama Barang: `Dompet Kulit`
   - Kategori: Pilih dari dropdown (data dari API)
   - Waktu: Pilih tanggal/waktu
   - Lokasi: `Gedung A Lt. 3`
   - Deskripsi: `Dompet warna coklat`
   - Kontak: `081234567890`
   - Foto: Upload gambar
4. Klik **Kirim Laporan**
5. ✅ Should show "Laporan berhasil dikirim!" dan redirect ke `/barangs`
6. Check di Supabase:
   - **Table Editor** → barangs (harus ada row baru)
   - **Storage** → foto_barang (harus ada file foto)

### Test 3: Lapor Barang Temuan

1. Pastikan sudah login
2. Buka `/barangs/lapor-temuan`
3. Isi form dengan data berbeda
4. Kategori dropdown harus terisi dari database (dinamis)
5. ✅ Success flow sama seperti Test 2

---

## 🔧 Troubleshooting

### Error: "invalid input syntax for type bigint"

**Penyebab:** Tabel `users` masih pakai BIGINT, bukan UUID

**Solusi:**
1. Jalankan ulang `complete-migration.sql`
2. Atau jalankan `migration-users-to-uuid.sql`

### Error: "new row violates row-level security policy"

**Penyebab:** RLS policies belum dibuat

**Solusi:**
1. Pastikan `complete-migration.sql` sudah dijalankan
2. Check di Supabase → Authentication → Policies

### Error: "Failed to upload photo"

**Penyebab:** Storage bucket belum dibuat atau tidak public

**Solusi:**
1. Create bucket `foto_barang` (public)
2. Setup storage policies (lihat Step 2.C)

### Error: "Supabase client is not initialized"

**Penyebab:** Environment variables belum di-set

**Solusi:**
1. Check `.env.local` exists
2. Restart dev server (`npm run dev`)

### Kategori dropdown kosong

**Penyebab:** Seed data belum insert

**Solusi:**
1. Jalankan ulang `complete-migration.sql` (sudah include seed data)
2. Atau manual insert via SQL Editor

### User tidak bisa register

**Penyebab:** Email confirmation enabled

**Solusi:**
1. Supabase → Authentication → Providers → Email
2. Disable "Confirm email"

---

## 📊 Database Schema Reference

### Users Table
```sql
id UUID PRIMARY KEY (dari Supabase Auth)
name TEXT NOT NULL
username TEXT UNIQUE
email TEXT UNIQUE NOT NULL
no_telepon TEXT
role TEXT (user/admin)
password TEXT NOT NULL (hashed)
```

### Barangs Table
```sql
id BIGSERIAL PRIMARY KEY
nama TEXT NOT NULL
tipe TEXT (hilang/temuan)
kategori_id BIGINT FK → kategoris.id
pelapor_id UUID FK → users.id
waktu TIMESTAMPTZ
lokasi TEXT
kontak TEXT
deskripsi TEXT
foto TEXT (URL)
status_id BIGINT FK → statuses.id
```

### Kategoris Table
```sql
id BIGSERIAL PRIMARY KEY
nama TEXT UNIQUE NOT NULL
```

Default data:
1. Elektronik
2. Dokumen
3. Tas & Dompet
4. Aksesoris
5. Kendaraan
6. Pakaian
7. Alat Tulis
8. Kunci
9. Kartu (KTP/SIM/ATM)
10. Lainnya

### Statuses Table
```sql
id BIGSERIAL PRIMARY KEY
nama TEXT UNIQUE NOT NULL
```

Default data:
1. Belum Dikembalikan
2. Sudah Dikembalikan
3. Dalam Proses

---

## 🎯 Features Checklist

### Authentication ✅
- [x] Register with Supabase Auth
- [x] Login with email/password
- [x] Logout
- [x] Session persistence (cookies)
- [x] Protected routes

### Barang Management ✅
- [x] Lapor barang hilang
- [x] Lapor barang temuan
- [x] Upload foto ke Supabase Storage
- [x] Dynamic kategori dropdown (from API)
- [x] Form validation
- [x] Success redirect to `/barangs`

### API Integration ✅
- [x] POST /api/barangs (create)
- [x] GET /api/kategoris (fetch categories)
- [x] Auth middleware (automatic via cookies)
- [x] Error handling

### Security ✅
- [x] Row Level Security (RLS) enabled
- [x] RLS Policies configured
- [x] UUID for user IDs (Supabase Auth)
- [x] Password hashing (bcrypt)
- [x] Service role key for backend only

---

## 📚 Next Steps

Setelah setup berhasil:

1. **Buat halaman listing barangs** (`/barangs`)
   - Fetch dari `GET /api/barangs`
   - Filter by tipe (hilang/temuan)
   - Search functionality

2. **Buat halaman detail barang** (`/barangs/[id]`)
   - Show full info
   - Contact button
   - Mark as selesai (if owner)

3. **Buat halaman riwayat** (`/riwayat-laporan`)
   - Show user's own reports
   - Edit/delete functionality

4. **Production deployment**
   - Deploy to Vercel
   - Update Supabase allowed URLs
   - Enable email confirmation
   - Setup custom domain

---

## 🆘 Support

Jika ada masalah:
1. Check error di browser console (F12)
2. Check error di terminal (npm run dev)
3. Check Supabase logs (Dashboard → Logs)
4. Refer to `API_DOCS.md` untuk API reference

---

**Happy coding! 🚀**

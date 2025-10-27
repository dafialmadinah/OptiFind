# OptiFind - Summary Perubahan & Setup

## 📋 Ringkasan Perubahan

### 1. ✅ Schema Database (create_tables.sql)
- Fixed missing semicolon di akhir index
- Schema sudah sesuai dengan production Supabase
- Menggunakan `tipe TEXT` dengan constraint `CHECK (tipe IN ('hilang', 'temuan'))`
- `pelapor_id UUID` untuk integrasi dengan Supabase Auth
- Foreign keys: kategori_id, status_id, pelapor_id dengan ON DELETE SET NULL

### 2. ✅ API POST /api/barangs (route.ts)
**Sebelum:**
- Mencoba insert `tipe_id` (tidak sesuai DB)
- Tidak ada validasi tipe

**Sesudah:**
- Insert `tipe` sebagai TEXT ('hilang' atau 'temuan')
- Validasi tipe di awal
- Get-or-create untuk kategori dan status
- Menggunakan `user.id` (UUID) dari Supabase Auth untuk `pelapor_id`
- Error handling lebih baik

### 3. ✅ Barang Service (barang-service.ts)
**Perubahan Types:**
- `BarangWithRelations.tipe`: dari `Reference` → `string`
- `BarangWithRelations.pelaporId`: dari `number | null` → `string | null` (UUID)
- `PelaporSummary.id`: dari `number` → `string` (UUID)
- Removed `tipe_id` references

**Perubahan Query:**
- Select `tipe` (TEXT) bukan `tipe:tipe_id(...)`
- Filter menggunakan `barang.tipe === 'hilang'` / `'temuan'` (lowercase)
- Normalisasi tipe di searchBarangs

### 4. ✅ Storage Upload (supabase-storage.ts)
**Improvements:**
- Validasi file (ukuran max 10MB)
- Menambahkan `contentType` pada upload
- Better error logging (bucket, path, size, type)
- Fixed getPublicUrl (synchronous call)

**⚠️ PENTING - Storage Policy:**
- File `storage-policies.sql` sudah dibuat
- **HARUS dijalankan di Supabase SQL Editor** untuk fix error RLS
- Tanpa policy ini, upload akan gagal dengan "violates row-level security policy"

### 5. ✅ HomePage Integration
**Sebelum:**
- Fetch via API routes (`/api/barangs?tipe=...`)
- Categories hardcoded
- Type `Barang` custom

**Sesudah:**
- Direct Supabase access via `getBarangOverview()`
- Categories fetched dari database
- Type `BarangWithRelations` dari barang-service
- Icon mapping untuk kategori
- Link ke `/cari` (bukan `/barangs-list`)
- Loading skeleton untuk categories

## 🚀 Cara Setup

### 1. Install Dependencies
```powershell
npm install
```

### 2. Setup Supabase Database
Jalankan SQL di Supabase SQL Editor:
```powershell
# Copy isi create_tables.sql ke Supabase SQL Editor dan run
```

### 3. **WAJIB: Setup Storage Policies**
```sql
-- Copy isi storage-policies.sql ke Supabase SQL Editor dan run
-- Ini untuk fix error "violates row-level security policy" saat upload
```

### 4. Seed Data Awal (Opsional)
Tambahkan kategori dan status default:
```sql
-- Insert default statuses
INSERT INTO statuses (nama) VALUES 
  ('Belum Dikembalikan'),
  ('Sudah Dikembalikan'),
  ('Belum Ditemukan'),
  ('Sudah Ditemukan')
ON CONFLICT (nama) DO NOTHING;

-- Insert default categories
INSERT INTO kategoris (nama) VALUES
  ('Dompet'),
  ('Kunci'),
  ('Aksesoris'),
  ('Smartphone'),
  ('Elektronik'),
  ('Botol'),
  ('Alat Tulis'),
  ('Pakaian'),
  ('Dokumen'),
  ('Lainnya')
ON CONFLICT (nama) DO NOTHING;
```

### 5. Environment Variables
Pastikan `.env.local` sudah ada:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 6. Run Development Server
```powershell
npm run dev
```

## 🔧 File-file yang Diubah

### Database
- ✅ `create_tables.sql` - Schema fix & match production
- ✅ `storage-policies.sql` - **BARU** - RLS policies untuk upload

### API Routes
- ✅ `src/app/api/barangs/route.ts` - POST insert tipe TEXT

### Libraries
- ✅ `src/lib/barang-service.ts` - Types & queries updated
- ✅ `src/lib/supabase-storage.ts` - Upload improvements

### Components
- ✅ `src/features/home/HomePage.tsx` - Supabase integration
- ✅ `src/components/category-card.tsx` - Link updated

## 📝 Catatan Penting

### Tipe Barang (hilang vs temuan)
- Database menyimpan: **lowercase** `'hilang'` atau `'temuan'`
- DB constraint: `CHECK (tipe IN ('hilang', 'temuan'))`
- Frontend bisa kirim capitalized, API akan normalize ke lowercase

### User ID (UUID)
- `pelapor_id` di `barangs` adalah **UUID string** dari Supabase Auth
- TypeScript types sudah di-update: `pelaporId: string | null`

### Storage Upload
- **HARUS run `storage-policies.sql` dulu** sebelum test upload
- Bucket `foto_barang` harus sudah dibuat di Supabase Dashboard
- Set bucket to **Public** untuk public URL access
- Max file size: 10 MB

### Search & Filter
- Tipe filter: lowercase `'hilang'` atau `'temuan'`
- Kategori filter: by `kategori_id` (number)
- Search by: nama, kategori.nama, lokasi

## 🐛 Troubleshooting

### Upload Error: "violates row-level security policy"
**Solusi:** Run `storage-policies.sql` di Supabase SQL Editor

### Tipe tidak ter-filter dengan benar
**Cek:** Pastikan DB menyimpan lowercase `'hilang'`/`'temuan'`

### Categories tidak muncul
**Cek:** 
1. Seed categories ke DB
2. Supabase client initialized
3. No RLS blocking SELECT on kategoris table

### Build errors tentang types
**Solusi:** Restart TS server atau rebuild
```powershell
npm run build
```

## ✨ Next Steps (Opsional)

1. **Seed sample data** untuk testing
2. **Add image compression** sebelum upload (client-side)
3. **Implement pagination** di search results
4. **Add filters** untuk waktu/lokasi di homepage
5. **Error boundary** untuk better UX saat Supabase down

---

**Status:** ✅ Semua perubahan sudah selesai dan integrated
**Testing:** Silakan test upload & homepage setelah run storage-policies.sql

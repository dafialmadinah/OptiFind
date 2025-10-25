# OptiFind API Collection

Koleksi Bruno untuk testing API OptiFind - Aplikasi Lost & Found

## Setup

1. Install Bruno: https://www.usebruno.com/
2. Buka Bruno dan import folder `bruno` ini
3. Pilih environment "Local" 
4. Jalankan aplikasi Next.js di `http://localhost:3000`

## Authentication

API menggunakan JWT (JSON Web Token) untuk authentication:

1. **Login** melalui endpoint `/api/auth/login`
2. Copy `token` dari response
3. Token akan otomatis tersimpan di environment variable `authToken`
4. Request yang memerlukan auth akan otomatis menggunakan Bearer token

### Manual Token Setup (jika diperlukan)

1. Login via Postman/Bruno
2. Copy token dari response
3. Set environment variable `authToken` dengan value token tersebut
4. Atau gunakan Authorization header: `Bearer YOUR_TOKEN`

## Endpoint yang Tersedia

### Auth
- **Register** - Registrasi user baru
- **Login** - Login user dan dapatkan JWT token

### Barangs
- **Get All Barangs** - Ambil semua data barang dengan filter optional
- **Search Barangs** - Cari barang dengan query
- **Create Barang** - Buat laporan barang baru (auth required)
- **Update Status** - Update status barang (auth required)
- **Selesaikan Laporan** - Tandai laporan sebagai selesai (auth required)

## Environment Variables

File `environments/Local.bru` berisi:
- `baseUrl`: http://localhost:3000
- `apiUrl`: {{baseUrl}}/api

Sesuaikan jika menggunakan port atau URL berbeda.

## Tips Testing

1. **Testing Flow Lengkap:**
   - Register user baru
   - Login dan token akan otomatis disimpan
   - Create barang baru (auth otomatis dari token)
   - Update status barang
   - Selesaikan laporan

2. **Query Parameters:**
   - Parameter dengan tilde (~) di awal adalah disabled
   - Hapus tilde untuk mengaktifkan parameter

3. **Response Testing:**
   - Setiap request punya tests otomatis
   - Lihat tab Tests di Bruno untuk hasil

## Troubleshooting

- **401 Unauthorized**: Token tidak valid, expired, atau tidak ada. Login ulang untuk mendapatkan token baru
- **422 Validation Error**: Periksa format body request
- **500 Server Error**: Cek Supabase configuration dan logs server

## Token Expiration

JWT token berlaku selama **7 hari**. Setelah itu perlu login ulang untuk mendapatkan token baru.

## Data Reference

### Tipe ID
- 1: Hilang
- 2: Temuan

### Status ID
- 1: Belum Ditemukan
- 2: Sudah Ditemukan
- 3: Belum Dikembalikan
- 4: Sudah Dikembalikan

### Kategori ID
(Sesuaikan dengan data di database Anda)

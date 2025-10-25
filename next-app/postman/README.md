# Postman Collection for OptiFind API

Koleksi Postman untuk testing API OptiFind - Aplikasi Lost & Found

## Import ke Postman

1. Buka Postman
2. Click **Import** di top-left
3. Pilih file `OptiFind-API.postman_collection.json`
4. Collection akan muncul di sidebar

## Environment Setup (Optional)

Jika ingin membuat environment terpisah:

1. Click **Environments** di Postman
2. Create New Environment
3. Tambahkan variables:
   - `baseUrl`: `http://localhost:3000`
   - `authToken`: (kosongkan dulu, akan auto-filled setelah login)

## Cara Menggunakan

### 1. Register User Baru
- Pilih request **Auth → Register**
- Click **Send**
- User baru akan dibuat

### 2. Login
- Pilih request **Auth → Login**
- Click **Send**
- **Token akan otomatis disimpan** ke environment variable `authToken`
- Cek di tab **Tests** untuk melihat script yang menyimpan token

### 3. Test Endpoint yang Butuh Auth

Semua request di folder **Barangs** (kecuali Get All) sudah dikonfigurasi dengan Bearer Token authentication yang menggunakan `{{authToken}}`.

Setelah login, token akan otomatis digunakan untuk request:
- Create Barang
- Update Status
- Selesaikan Laporan

## Request yang Tersedia

### Auth
- ✅ **Register** - Buat user baru
- ✅ **Login** - Login dan dapatkan JWT token (auto-save token)

### Barangs
- ✅ **Get All Barangs** - Ambil semua barang (public)
- ✅ **Search Barangs** - Cari barang dengan filter (public)
- 🔒 **Create Barang** - Buat laporan baru (auth required)
- 🔒 **Update Status** - Update status barang (auth required)
- 🔒 **Selesaikan Laporan** - Selesaikan laporan (auth required)

## Auto-Save Token Feature

Request **Login** memiliki script di tab **Tests** yang otomatis menyimpan token:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.token) {
        pm.environment.set('authToken', response.token);
        console.log('Token saved to environment');
    }
}
```

Anda bisa melihat script ini di tab **Tests** pada request Login.

## Testing Flow

1. **Register** → Buat user baru
2. **Login** → Token auto-saved ke `authToken`
3. **Create Barang** → Token otomatis terpakai
4. **Update Status** → Ganti ID barang di URL (misal `/api/barangs/2`)
5. **Selesaikan Laporan** → Tandai sebagai selesai

## Tips

- 🔍 Enable/disable query parameters dengan checkbox di tab **Params**
- 📝 Ganti ID di URL path untuk test barang berbeda
- 🔐 Token berlaku **7 hari**, setelah itu perlu login ulang
- 👁️ Lihat **Console** (View → Show Postman Console) untuk debug

## Dokumentasi API Lengkap

Lihat file `API_DOCUMENTATION.md` di root project untuk dokumentasi lengkap semua endpoint.

## Troubleshooting

### Token Tidak Tersimpan
- Pastikan environment sudah aktif (pilih di dropdown top-right)
- Cek tab Tests pada request Login
- Lihat Postman Console untuk error messages

### 401 Unauthorized
- Token expired (login ulang)
- Token tidak valid
- Environment variable `authToken` kosong atau salah

### Request Gagal
- Pastikan server Next.js berjalan di `http://localhost:3000`
- Cek Postman Console untuk detail error
- Periksa format body request sesuai dokumentasi

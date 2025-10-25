# Quick Start: Testing OptiFind API

## Prerequisites
- Server Next.js berjalan di `http://localhost:3000`
- Bruno atau Postman terinstall

## Option 1: Bruno (Recommended)

### Setup
1. Download Bruno dari https://www.usebruno.com/
2. Open Bruno → Click "Open Collection"
3. Pilih folder `bruno/` di project ini

### Testing Flow
1. **Register User**
   - Buka `Auth → Register`
   - Click **Run** (atau **Send**)
   - User baru akan dibuat

2. **Login**
   - Buka `Auth → Login`
   - Click **Run**
   - ✅ Token otomatis tersimpan ke environment `authToken`

3. **Create Barang**
   - Buka `Barangs → Create Barang`
   - Token otomatis digunakan dari environment
   - Click **Run**
   - Barang baru dibuat!

4. **Test Lainnya**
   - Get All Barangs (public, no auth)
   - Search Barangs (public, no auth)
   - Update Status (auth required)
   - Selesaikan Laporan (auth required)

---

## Option 2: Postman

### Setup
1. Open Postman
2. Click **Import**
3. Pilih file `postman/OptiFind-API.postman_collection.json`

### Testing Flow
1. **Create/Select Environment** (optional tapi recommended)
   - Click **Environments** → **+** (Create New)
   - Nama: "Local"
   - Variables:
     - `baseUrl`: `http://localhost:3000`
     - `authToken`: (leave empty)
   - Save dan pilih environment "Local"

2. **Register User**
   - Pilih `Auth → Register`
   - Click **Send**

3. **Login**
   - Pilih `Auth → Login`
   - Click **Send**
   - ✅ Check console: "Token saved to environment"
   - Token otomatis tersimpan!

4. **Create Barang**
   - Pilih `Barangs → Create Barang`
   - Token otomatis terpakai (lihat tab **Authorization**)
   - Click **Send**

---

## Option 3: cURL (Terminal)

### 1. Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login & Get Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Copy the token from response!**

### 3. Create Barang (replace YOUR_TOKEN)
```bash
curl -X POST http://localhost:3000/api/barangs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Dompet Kulit",
    "tipeId": 1,
    "kategoriId": 2,
    "statusId": 1,
    "lokasi": "Perpustakaan",
    "deskripsi": "Dompet warna coklat"
  }'
```

### 4. Get All Barangs (no auth)
```bash
curl http://localhost:3000/api/barangs
```

### 5. Update Status (replace ID and TOKEN)
```bash
curl -X PUT http://localhost:3000/api/barangs/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Quick Reference

### Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login & get token |
| GET | `/api/barangs` | ❌ | Get all barangs |
| POST | `/api/barangs` | ✅ | Create barang |
| PUT | `/api/barangs/:id` | ✅ | Update status |
| PUT | `/api/barangs/:id/selesaikan` | ✅ | Selesaikan laporan |

### Data IDs
- **Tipe**: 1=Hilang, 2=Temuan
- **Status**: 1=Belum Ditemukan, 2=Sudah Ditemukan, 3=Belum Dikembalikan, 4=Sudah Dikembalikan

### Token
- **Format**: `Bearer <token>`
- **Expiry**: 7 days
- **Location**: Header `Authorization`

---

## Troubleshooting

❌ **401 Unauthorized**
- Login ulang untuk mendapatkan token baru
- Pastikan format header: `Authorization: Bearer <token>`

❌ **422 Validation Error**
- Cek format request body
- Pastikan semua field required terisi

❌ **Connection Refused**
- Pastikan server Next.js berjalan: `npm run dev`
- Check URL: `http://localhost:3000`

---

## Full Documentation

📖 Lihat dokumentasi lengkap:
- **API Docs**: `API_DOCUMENTATION.md`
- **Bruno Guide**: `bruno/README.md`
- **Postman Guide**: `postman/README.md`
- **Refactoring Info**: `REFACTORING_SUMMARY.md`

---

**Happy Testing! 🚀**

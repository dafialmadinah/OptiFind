# API Documentation - OptiFind

Base URL: `http://localhost:3000/api` (development)

## 🔐 Authentication

Menggunakan **Supabase Auth** dengan session cookies. Login otomatis menyimpan session.

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "noTelepon": "081234567890",
  "password": "password123"
}
```

**Response 201:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "user"
  }
}
```

### Login
Login dilakukan di client menggunakan `useAuth().signIn(email, password)`

---

## 👤 Users

### Get Current User Profile
```http
GET /api/users/me
Authorization: Required (session cookie)
```

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "no_telepon": "081234567890",
    "role": "user"
  }
}
```

### Update Current User Profile
```http
PATCH /api/users/me
Authorization: Required (session cookie)
Content-Type: application/json

{
  "name": "John Doe Updated",
  "username": "johndoe2",
  "no_telepon": "081234567891"
}
```

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "name": "John Doe Updated",
    "username": "johndoe2",
    "no_telepon": "081234567891",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 📦 Barangs (Lost & Found Items)

### Get All Barangs (with filters)
```http
GET /api/barangs
GET /api/barangs?q=laptop
GET /api/barangs?tipe=hilang
GET /api/barangs?kategori=1&kategori=2
GET /api/barangs?q=dompet&tipe=temuan&kategori=3
```

**Query Parameters:**
- `q` (optional): Search keyword (nama, lokasi, deskripsi)
- `tipe` (optional): Filter by type (`hilang` or `temuan`)
- `kategori` (optional): Filter by category ID (can be multiple)

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "nama": "Laptop Dell",
      "tipe": "hilang",
      "kategori_id": 1,
      "pelapor_id": "uuid",
      "waktu": "2025-10-26T10:00:00Z",
      "lokasi": "Gedung A Lt. 3",
      "kontak": "081234567890",
      "deskripsi": "Laptop warna hitam",
      "foto": "https://storage.supabase.co/...",
      "status_id": 1,
      "created_at": "2025-10-26T10:00:00Z",
      "updated_at": "2025-10-26T10:00:00Z"
    }
  ]
}
```

### Create New Barang
```http
POST /api/barangs
Authorization: Required (session cookie)
Content-Type: application/json

{
  "nama": "Laptop Dell",
  "tipe": "hilang",
  "kategori": "Elektronik",
  "waktu": "2025-10-26T10:00:00Z",
  "lokasi": "Gedung A Lt. 3",
  "kontak": "081234567890",
  "deskripsi": "Laptop warna hitam dengan stiker",
  "foto": "https://storage.supabase.co/..."
}
```

**Notes:**
- `kategori` dapat berupa nama kategori (string) atau `kategoriId` (number)
- Jika kategori belum ada, akan otomatis dibuat
- `pelapor_id` otomatis dari user yang login
- `status` default: "Belum Dikembalikan"

**Response 201:**
```json
{
  "data": {
    "id": 1,
    "nama": "Laptop Dell",
    "tipe": "hilang",
    "kategori_id": 1,
    "pelapor_id": "uuid",
    ...
  }
}
```

### Get Barang by ID
```http
GET /api/barangs/1
```

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "nama": "Laptop Dell",
    "tipe": "hilang",
    ...
  }
}
```

### Update Barang
```http
PUT /api/barangs/1
Authorization: Required (session cookie, must be owner)
Content-Type: application/json

{
  "nama": "Laptop Dell Updated",
  "lokasi": "Gedung B Lt. 2",
  "deskripsi": "Deskripsi updated"
}
```

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "nama": "Laptop Dell Updated",
    ...
  }
}
```

### Delete Barang
```http
DELETE /api/barangs/1
Authorization: Required (session cookie, must be owner)
```

**Response 200:**
```json
{
  "message": "Barang berhasil dihapus"
}
```

### Mark as Selesai (Returned)
```http
POST /api/barangs/1/selesaikan
Authorization: Required (session cookie, must be owner)
```

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "status_id": 2,
    ...
  }
}
```

---

## 📂 Kategoris

### Get All Kategoris
```http
GET /api/kategoris
```

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "nama": "Elektronik",
      "created_at": "2025-10-26T00:00:00Z",
      "updated_at": "2025-10-26T00:00:00Z"
    },
    {
      "id": 2,
      "nama": "Dokumen",
      "created_at": "2025-10-26T00:00:00Z",
      "updated_at": "2025-10-26T00:00:00Z"
    }
  ]
}
```

### Create New Kategori
```http
POST /api/kategoris
Authorization: Required (session cookie)
Content-Type: application/json

{
  "nama": "Kategori Baru"
}
```

**Response 201:**
```json
{
  "data": {
    "id": 11,
    "nama": "Kategori Baru",
    "created_at": "2025-10-26T10:00:00Z",
    "updated_at": "2025-10-26T10:00:00Z"
  }
}
```

---

## 🏷️ Statuses

### Get All Statuses
```http
GET /api/statuses
```

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "nama": "Belum Dikembalikan",
      "created_at": "2025-10-26T00:00:00Z",
      "updated_at": "2025-10-26T00:00:00Z"
    },
    {
      "id": 2,
      "nama": "Sudah Dikembalikan",
      "created_at": "2025-10-26T00:00:00Z",
      "updated_at": "2025-10-26T00:00:00Z"
    },
    {
      "id": 3,
      "nama": "Dalam Proses",
      "created_at": "2025-10-26T00:00:00Z",
      "updated_at": "2025-10-26T00:00:00Z"
    }
  ]
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorised"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "message": "Validasi gagal",
  "errors": {
    "fieldErrors": {
      "email": ["Email tidak valid"],
      "password": ["Password minimal 8 karakter"]
    }
  }
}
```

### 500 Internal Server Error
```json
{
  "message": "Terjadi kesalahan pada server."
}
```

---

## 🚀 Setup Instructions

### 1. Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=your-secret-key
```

### 2. Run Database Migration
Jalankan `complete-migration.sql` di Supabase SQL Editor

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test APIs
Gunakan tools seperti Postman, Thunder Client, atau cURL

---

## 📝 Notes

1. **Authentication**: Semua endpoint kecuali GET public memerlukan authentication
2. **RLS Policies**: Supabase RLS otomatis enforce permissions
3. **Auto-create**: Kategori otomatis dibuat saat create barang jika belum ada
4. **File Upload**: Upload foto ke Supabase Storage terlebih dahulu, lalu kirim URL-nya
5. **UUID**: User IDs menggunakan UUID dari Supabase Auth
6. **Timestamps**: Semua timestamps dalam format ISO 8601

---

## 🔍 Frontend Integration Example

### Using with React/Next.js
```typescript
// Fetch barangs
const response = await fetch('/api/barangs?tipe=hilang');
const { data } = await response.json();

// Create barang (authenticated)
const { user } = useAuth();
const response = await fetch('/api/barangs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nama: 'Laptop',
    tipe: 'hilang',
    kategori: 'Elektronik',
    lokasi: 'Gedung A',
    deskripsi: 'Laptop hitam',
  }),
});
```

Session cookies otomatis dikirim oleh browser! ✅

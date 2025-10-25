# OptiFind API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

API menggunakan JWT (JSON Web Token) untuk authentication. Token harus disertakan dalam header `Authorization` dengan format:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Token berlaku selama **7 hari** setelah login.

---

## Endpoints

### 1. Register User

**POST** `/api/auth/register`

Registrasi user baru.

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "noTelepon": "081234567890",
  "password": "password123"
}
```

**Response (201 - Created):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "user"
  }
}
```

**Error Responses:**
- `422` - Validation error
- `409` - Email atau username sudah digunakan
- `500` - Server error

---

### 2. Login

**POST** `/api/auth/login`

Login dan mendapatkan JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 - OK):**
```json
{
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "noTelepon": "081234567890",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401` - Email atau password tidak valid
- `422` - Validation error
- `500` - Server error

---

### 3. Get All Barangs

**GET** `/api/barangs`

Mendapatkan daftar semua barang dengan filter optional.

**Query Parameters:**
- `q` (optional) - Search query
- `tipe` (optional) - Filter tipe: `hilang` atau `temuan`
- `kategori` (optional) - Filter kategori ID (dapat multiple)

**Example:**
```
GET /api/barangs?q=laptop&tipe=hilang&kategori=1&kategori=2
```

**Response (200 - OK):**
```json
{
  "data": [
    {
      "id": 1,
      "nama": "Laptop Asus ROG",
      "tipe": {
        "id": 1,
        "nama": "Hilang"
      },
      "kategori": {
        "id": 1,
        "nama": "Elektronik"
      },
      "pelapor": {
        "id": 1,
        "nama": "John Doe"
      },
      "waktu": "2025-10-20T10:00:00Z",
      "lokasi": "Gedung A Lantai 3",
      "kontak": "081234567890",
      "deskripsi": "Laptop gaming warna hitam",
      "foto": "https://example.com/foto.jpg",
      "status": {
        "id": 1,
        "nama": "Belum Ditemukan"
      }
    }
  ]
}
```

---

### 4. Create Barang

**POST** `/api/barangs`

🔒 **Authentication Required**

Membuat laporan barang baru (hilang atau temuan).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "nama": "Laptop Asus ROG",
  "tipeId": 1,
  "kategoriId": 1,
  "statusId": 1,
  "waktu": "2025-10-20T10:00:00Z",
  "lokasi": "Gedung A Lantai 3",
  "kontak": "081234567890",
  "deskripsi": "Laptop gaming warna hitam, ada stiker di cover",
  "foto": "https://example.com/foto.jpg"
}
```

**Field Details:**
- `nama` (string, required) - Nama barang
- `tipeId` (number, required) - 1=Hilang, 2=Temuan
- `kategoriId` (number, required) - ID kategori barang
- `statusId` (number, required) - ID status barang
- `waktu` (ISO string, optional) - Waktu kehilangan/penemuan
- `lokasi` (string, optional) - Lokasi kehilangan/penemuan
- `kontak` (string, optional) - Kontak pelapor
- `deskripsi` (string, optional) - Deskripsi detail barang
- `foto` (string URL, optional) - URL foto barang

**Response (201 - Created):**
```json
{
  "data": {
    "id": 1,
    "nama": "Laptop Asus ROG",
    ...
  }
}
```

**Error Responses:**
- `401` - Unauthorized (token tidak valid)
- `422` - Validation error
- `500` - Server error

---

### 5. Update Barang Status

**PUT** `/api/barangs/:id`

🔒 **Authentication Required**

Mengubah status barang (hanya pelapor atau admin).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Path Parameters:**
- `id` (number) - ID barang yang akan diupdate

**Status Transitions:**
- "Belum Ditemukan" → "Sudah Ditemukan"
- "Belum Dikembalikan" → "Sudah Dikembalikan"

**Example:**
```
PUT /api/barangs/1
```

**Response (200 - OK):**
```json
{
  "message": "Status laporan berhasil diperbarui."
}
```

**Error Responses:**
- `400` - ID tidak valid atau status sudah selesai
- `401` - Unauthorized
- `403` - Forbidden (bukan pelapor atau admin)
- `404` - Barang tidak ditemukan
- `500` - Server error

---

### 6. Selesaikan Laporan

**PUT** `/api/barangs/:id/selesaikan`

🔒 **Authentication Required**

Menandai laporan sebagai selesai (hanya pelapor atau admin).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Path Parameters:**
- `id` (number) - ID barang yang akan diselesaikan

**Example:**
```
PUT /api/barangs/1/selesaikan
```

**Response (200 - OK):**
```json
{
  "message": "Status laporan berhasil diperbarui."
}
```

**Error Responses:**
- `400` - ID tidak valid atau status sudah selesai
- `401` - Unauthorized
- `403` - Forbidden (bukan pelapor atau admin)
- `404` - Barang tidak ditemukan
- `500` - Server error

---

## Data Reference

### Tipe ID
- `1` - Hilang
- `2` - Temuan

### Status ID (untuk Barang Hilang)
- `1` - Belum Ditemukan
- `2` - Sudah Ditemukan

### Status ID (untuk Barang Temuan)
- `3` - Belum Dikembalikan
- `4` - Sudah Dikembalikan

### Role
- `user` - User biasa
- `ADMIN` - Administrator

---

## Error Handling

Semua error response menggunakan format JSON:

```json
{
  "message": "Error message here",
  "errors": {
    // Optional: validation errors detail
  }
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

---

## Testing dengan Bruno/Postman

### 1. Register
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login dan Simpan Token
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Copy `token` dari response!**

### 3. Create Barang (dengan token)
```bash
POST http://localhost:3000/api/barangs
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "nama": "Dompet Kulit",
  "tipeId": 1,
  "kategoriId": 2,
  "statusId": 1,
  "lokasi": "Perpustakaan"
}
```

---

## Security Notes

1. **JWT Secret**: Pastikan menggunakan secret key yang kuat di production
2. **HTTPS**: Gunakan HTTPS di production untuk enkripsi data
3. **Token Storage**: Simpan token dengan aman (localStorage/sessionStorage)
4. **Token Expiration**: Token berlaku 7 hari, setelah itu perlu login ulang
5. **Password**: Minimum 8 karakter, di-hash dengan bcrypt

---

## Development

Start development server:
```bash
npm run dev
```

API akan tersedia di: `http://localhost:3000/api`

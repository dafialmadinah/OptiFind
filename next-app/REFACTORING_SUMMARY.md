# Refactoring: Login API dengan JWT Authentication

## Ringkasan Perubahan

API login telah direfactor dari NextAuth `[...nextauth]` menjadi endpoint REST API sederhana dengan JWT authentication yang bisa di-test dengan mudah di Postman/Bruno.

## ✅ Yang Telah Dibuat/Diubah

### 1. **New Files Created**

#### API Endpoints
- ✅ `src/app/api/auth/login/route.ts` - Endpoint login baru dengan JWT

#### Utilities
- ✅ `src/lib/auth-utils.ts` - Helper functions untuk JWT verification

#### Documentation
- ✅ `API_DOCUMENTATION.md` - Dokumentasi lengkap semua endpoint
- ✅ `.env.example` - Updated dengan JWT_SECRET

#### Testing Collections
- ✅ `bruno/` - Bruno collection untuk API testing
  - `bruno.json` - Collection config
  - `environments/Local.bru` - Environment variables
  - `Auth/Register.bru` - Test register
  - `Auth/Login.bru` - Test login (updated)
  - `Barangs/Get All Barangs.bru`
  - `Barangs/Search Barangs.bru`
  - `Barangs/Create Barang.bru` (updated)
  - `Barangs/Update Status.bru` (updated)
  - `Barangs/Selesaikan Laporan.bru` (updated)
  - `README.md` - Dokumentasi Bruno

- ✅ `postman/` - Postman collection
  - `OptiFind-API.postman_collection.json`
  - `README.md` - Dokumentasi Postman

### 2. **Modified Files**

#### API Routes (Migration from NextAuth to JWT)
- ✅ `src/app/api/barangs/route.ts` - Menggunakan JWT auth
- ✅ `src/app/api/barangs/[id]/route.ts` - Menggunakan JWT auth
- ✅ `src/app/api/barangs/[id]/selesaikan/route.ts` - Menggunakan JWT auth

### 3. **Dependencies Installed**
- ✅ `jsonwebtoken` - JWT signing/verification
- ✅ `@types/jsonwebtoken` - TypeScript types

## 🔑 Cara Kerja Authentication Baru

### Before (NextAuth)
```typescript
const session = await getServerSession(authOptions);
if (!session?.user?.id) {
  return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
}
const userId = session.user.id;
```

### After (JWT)
```typescript
const user = getAuthUser(request);
if (!user) {
  return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
}
const userId = user.id;
```

## 📡 Endpoint Baru

### POST `/api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "username": "username",
    "noTelepon": "081234567890",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔐 Cara Menggunakan Token

### Di Postman/Bruno
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Di JavaScript/Fetch
```javascript
fetch('http://localhost:3000/api/barangs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
```

## 📝 Migration Guide untuk Frontend

Jika ada kode frontend yang masih menggunakan NextAuth, perlu diupdate:

### Before (NextAuth)
```typescript
import { signIn, signOut, useSession } from 'next-auth/react';

// Login
await signIn('credentials', {
  email,
  password,
  callbackUrl: '/'
});

// Get user
const { data: session } = useSession();
const user = session?.user;
```

### After (Custom JWT)
```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
if (data.token) {
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

// Get user
const token = localStorage.getItem('authToken');
const user = JSON.parse(localStorage.getItem('user') || '{}');
```

## ⚙️ Environment Variables

Tambahkan di `.env.local`:
```bash
NEXTAUTH_SECRET=your-secret-key-here
# atau
JWT_SECRET=your-jwt-secret-key-here
```

Generate secret key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🧪 Testing

### 1. Testing dengan Bruno
```bash
# Install Bruno dari https://www.usebruno.com/
# Buka folder bruno/ di Bruno
# Run requests
```

### 2. Testing dengan Postman
```bash
# Import postman/OptiFind-API.postman_collection.json
# Token akan auto-save setelah login
```

### 3. Testing Manual dengan curl
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Barang (dengan token)
curl -X POST http://localhost:3000/api/barangs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test Item","tipeId":1,"kategoriId":1,"statusId":1}'
```

## 📊 Comparison: Before vs After

| Aspect | NextAuth (Before) | JWT (After) |
|--------|------------------|-------------|
| Login Endpoint | `/api/auth/[...nextauth]` | `/api/auth/login` |
| Test di Postman | ❌ Sulit | ✅ Mudah |
| Authentication | Session-based | Token-based |
| Token Storage | Cookie (auto) | Manual (localStorage/header) |
| API Testing | Butuh browser cookie | Pakai Bearer token |
| Documentation | Complex | Simple REST |

## 🎯 Benefits

1. ✅ **Mudah di-test** di Postman/Bruno/curl
2. ✅ **Standard REST API** dengan Bearer token
3. ✅ **Dokumentasi lengkap** dan jelas
4. ✅ **Type-safe** dengan TypeScript
5. ✅ **Auto-save token** di Bruno/Postman
6. ✅ **Flexible** untuk mobile/web/desktop clients

## ⚠️ Breaking Changes

Jika ada frontend code yang menggunakan NextAuth, perlu diupdate untuk menggunakan JWT authentication yang baru.

## 🔄 Next Steps (Optional)

1. Update frontend login form untuk menggunakan endpoint baru
2. Implement token refresh mechanism (jika perlu)
3. Add logout endpoint untuk blacklist token
4. Implement remember me feature
5. Add rate limiting untuk login endpoint

## 📚 Documentation

- **API Documentation**: `API_DOCUMENTATION.md`
- **Bruno Collection**: `bruno/README.md`
- **Postman Collection**: `postman/README.md`

## 🐛 Troubleshooting

### 401 Unauthorized
- Cek token valid dan tidak expired
- Token format: `Bearer <token>`

### 422 Validation Error
- Periksa request body sesuai schema

### Token Expired
- Token berlaku 7 hari
- Login ulang untuk mendapatkan token baru

---

**Status:** ✅ Refactoring Complete & Ready for Testing

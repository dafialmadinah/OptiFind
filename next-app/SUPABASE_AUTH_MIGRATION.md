# Migrasi ke Supabase Auth

## 📋 Ringkasan Perubahan

Sistem autentikasi telah diubah dari **NextAuth + JWT** menjadi **Supabase Auth** untuk konsistensi dan menyelesaikan masalah Row Level Security (RLS).

## ✅ Yang Sudah Diubah

### 1. **Dependencies**
- ✅ Installed `@supabase/ssr` untuk SSR support

### 2. **Auth System**
- ✅ `src/lib/auth-context.tsx` - Auth Context Provider
- ✅ `src/lib/supabase.ts` - Browser client dengan session persistence
- ✅ `src/lib/supabase-server.ts` - Server client untuk API routes
- ✅ `src/components/providers.tsx` - Menggunakan `AuthProvider`

### 3. **Forms**
- ✅ `src/features/auth/login-form.tsx` - Menggunakan `useAuth().signIn()`
- ✅ `src/features/auth/register-form.tsx` - Menggunakan `useAuth().signIn()`
- ✅ `src/app/(public)/barangs/lapor-hilang/page.tsx` - Tidak perlu manual token
- ✅ `src/app/(public)/barangs/lapor-temuan/page.tsx` - Tidak perlu manual token

### 4. **API Routes**
- ✅ `src/app/api/barangs/route.ts` - Menggunakan `getSupabaseUser()`
- ✅ `src/app/api/auth/register/route.ts` - Creates user in Supabase Auth + Database

### 5. **Components**
- ✅ `src/components/navbar.tsx` - Menggunakan `useAuth()`
- ✅ `src/components/public-navbar.tsx` - Menggunakan `useAuth()`

### 6. **Pages**
- ✅ `src/app/(public)/riwayat-laporan/page.tsx` - Menggunakan `useAuth()`
- ✅ `src/app/(public)/layout.tsx` - Client component

## 🔧 Setup yang Diperlukan

### 1. Tambahkan Environment Variable

Tambahkan ke `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_SECRET=your-secret-for-password-hashing
```

**Cara mendapatkan keys:**
1. Buka Supabase Dashboard
2. Settings → API
3. Copy `URL` dan `anon/public key`

**Note:** Kita hanya menggunakan **anon key** saja. Anon key aman digunakan di frontend karena dilindungi oleh Row Level Security (RLS) policies.

### 2. Update Database Schema

Ubah kolom `id` di tabel `users` menjadi UUID (opsional tapi direkomendasikan):

```sql
-- Backup data users terlebih dahulu!

-- 1. Buat tabel baru dengan UUID
CREATE TABLE users_new (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  username TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  no_telepon TEXT,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Copy data (manual, karena id berubah dari int ke uuid)
-- Untuk setiap user lama, buat user baru di Supabase Auth dulu
-- Lalu insert ke users_new dengan UUID dari Supabase Auth

-- 3. Update foreign keys di tabel barangs
ALTER TABLE barangs 
  ALTER COLUMN pelapor_id TYPE UUID USING pelapor_id::uuid;

-- 4. Drop tabel lama dan rename
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;
```

### 3. Setup Row Level Security (RLS)

Enable RLS dan buat policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE barangs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kategoris ENABLE ROW LEVEL SECURITY;

-- Policy untuk users: Everyone can read
CREATE POLICY "Public users are viewable by everyone"
ON users FOR SELECT
TO authenticated, anon
USING (true);

-- Policy untuk users: Users can insert their own record
CREATE POLICY "Users can create their own record"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

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

-- Policy untuk kategoris: Everyone can read
CREATE POLICY "Kategoris are viewable by everyone"
ON kategoris FOR SELECT
TO authenticated, anon
USING (true);
```

**Penting:** Karena kita menggunakan anon key, pastikan RLS policies sudah benar untuk melindungi data!

## 🚀 Cara Menggunakan

### Login

```tsx
import { useAuth } from "@/lib/auth-context";

function MyComponent() {
  const { signIn } = useAuth();
  
  const handleLogin = async () => {
    try {
      await signIn(email, password);
      // Success! User is logged in
    } catch (error) {
      // Handle error
    }
  };
}
```

### Register

```tsx
import { useAuth } from "@/lib/auth-context";

function MyComponent() {
  const { signUp } = useAuth();
  
  const handleRegister = async () => {
    try {
      await signUp(email, password, {
        name: "John Doe",
        username: "johndoe"
      });
      // Success! User is registered
    } catch (error) {
      // Handle error
    }
  };
}
```

### Logout

```tsx
import { useAuth } from "@/lib/auth-context";

function MyComponent() {
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };
}
```

### Check Auth Status

```tsx
import { useAuth } from "@/lib/auth-context";

function MyComponent() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (user) {
    return <div>Welcome {user.email}</div>;
  }
  
  return <div>Please login</div>;
}
```

### Protected API Routes

```ts
import { getSupabaseUser } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const user = await getSupabaseUser(request);
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // user.id adalah UUID dari Supabase Auth
  // Use it as needed
}
```

## 📝 Catatan Penting

1. **User ID sekarang UUID** (bukan integer)
2. **Session disimpan di cookies** oleh Supabase (otomatis)
3. **Tidak perlu localStorage.getItem('token')** lagi
4. **RLS otomatis enforce** di Supabase
5. **Service Role Key hanya untuk server-side** (jangan expose ke client!)

## 🔄 Breaking Changes

### Sebelum (NextAuth):
```tsx
import { useSession } from "next-auth/react";

const { data: session } = useSession();
const userName = session?.user?.name;
```

### Sesudah (Supabase Auth):
```tsx
import { useAuth } from "@/lib/auth-context";

const { user } = useAuth();
const userName = user?.user_metadata?.name;
```

## ✨ Keuntungan

1. ✅ **Tidak ada lagi RLS errors** - Supabase Auth terintegrasi dengan RLS
2. ✅ **Lebih sederhana** - Satu sistem auth, bukan dual (NextAuth + JWT)
3. ✅ **Better security** - Row Level Security enforcement
4. ✅ **Auto session management** - Supabase handle cookies & refresh tokens
5. ✅ **File upload support** - Supabase Storage integration ready

## 🧪 Testing

Setelah setup:

1. Register user baru
2. Login dengan user tersebut
3. Coba buat laporan barang (hilang/temuan)
4. Check di Supabase Dashboard:
   - Authentication → Users (harus ada user baru)
   - Table Editor → users (harus sync)
   - Table Editor → barangs (laporan berhasil dibuat)

## 🐛 Troubleshooting

### Error: "new row violates row-level security policy"
- **Penyebab**: RLS policy belum dibuat atau salah
- **Solusi**: Jalankan SQL policies di atas

### Error: "User not found" saat login
- **Penyebab**: Email confirmation required
- **Solusi**: Disable email confirmation di Supabase Dashboard → Authentication → Settings

### Error: "Failed to create user"
- **Penyebab**: Email confirmation required atau error koneksi
- **Solusi**: 
  1. Disable email confirmation di Supabase Dashboard → Authentication → Settings
  2. Check apakah SUPABASE_URL dan ANON_KEY sudah benar

### Catatan tentang Anon Key
- **Anon key aman** digunakan di frontend karena dilindungi RLS
- Semua operasi akan di-check oleh RLS policies
- Pastikan RLS policies sudah benar untuk keamanan data

---

**Migrasi selesai! Sistem auth sekarang 100% menggunakan Supabase Auth. 🎉**

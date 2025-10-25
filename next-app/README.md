# OptiFind - Lost & Found Application

OptiFind adalah aplikasi web untuk melaporkan dan mencari barang hilang atau temuan. Dibangun dengan Next.js, TypeScript, dan Supabase.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account

### Installation

1. Clone repository
```bash
git clone https://github.com/dafialmadinah/OptiFind.git
cd OptiFind/next-app
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan kredensial Supabase Anda:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_secret_key
```

4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) dengan browser Anda.

## 📡 API Testing

OptiFind menyediakan REST API yang bisa di-test dengan mudah menggunakan Postman atau Bruno.

### Quick Start API Testing

Lihat **[QUICK_START.md](./QUICK_START.md)** untuk panduan cepat testing API.

### Testing Tools

#### 🟣 Bruno (Recommended)
```bash
# 1. Install Bruno dari https://www.usebruno.com/
# 2. Open Collection → Pilih folder bruno/
# 3. Run requests!
```

Dokumentasi: [bruno/README.md](./bruno/README.md)

#### 🟠 Postman
```bash
# 1. Import file: postman/OptiFind-API.postman_collection.json
# 2. Token auto-save setelah login
# 3. Test endpoints!
```

Dokumentasi: [postman/README.md](./postman/README.md)

### API Documentation

Dokumentasi lengkap semua endpoint API tersedia di **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

### Available Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user baru |
| POST | `/api/auth/login` | ❌ | Login & get JWT token |
| GET | `/api/barangs` | ❌ | Get all barangs |
| POST | `/api/barangs` | ✅ | Create laporan barang |
| PUT | `/api/barangs/:id` | ✅ | Update status barang |
| PUT | `/api/barangs/:id/selesaikan` | ✅ | Selesaikan laporan |

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Token)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **API Testing**: Bruno / Postman

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, register)
│   ├── (public)/        # Public pages
│   ├── api/             # API routes
│   └── dashboard/       # Dashboard pages
├── components/          # React components
├── lib/                 # Utilities & helpers
└── types/              # TypeScript types

bruno/                   # Bruno API collection
postman/                # Postman collection
```

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) authentication:

1. Login via `/api/auth/login`
2. Dapatkan token dari response
3. Gunakan token di header: `Authorization: Bearer <token>`
4. Token berlaku 7 hari

## 📚 Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Dokumentasi lengkap API
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide untuk testing
- **[REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)** - Info refactoring login

## 🧪 Testing

### API Testing
```bash
# Dengan Bruno - lihat bruno/README.md
# Dengan Postman - lihat postman/README.md
# Dengan curl - lihat QUICK_START.md
```

### Development
```bash
npm run dev      # Run dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Dafi Almadinah**
- GitHub: [@dafialmadinah](https://github.com/dafialmadinah)

---

Made with ❤️ using Next.js

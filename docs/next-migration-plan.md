# OptiFind Next.js Migration Plan

## Target Stack
- Next.js 14 (App Router) with TypeScript
- Styling via Tailwind CSS (matching existing utility-first approach)
- Supabase (PostgreSQL) as managed database + storage via `@supabase/supabase-js`
- NextAuth.js (Credentials provider) for session-based auth and role handling
- Zod for request validation; bcrypt for password hashing; sharp for image processing
- Upload storage: local `public/uploads` (option to swap to S3-compatible service later)

## Module Mapping
| Laravel Module | Next.js Counterpart |
| --- | --- |
| Routes (`routes/web.php`) | App Router segments under `/app/(public|dashboard)` and `/app/api` |
| Controllers (`BarangController`) | Server actions + API route handlers under `app/api/barangs` |
| Blade views (`resources/views/...`) | React Server Components + Client Components within `app` directory |
| Middleware (`auth`) | NextAuth session checks + `middleware.ts` for protected routes |
| Models/Migrations | Supabase schema & SQL migrations (managed in Supabase Dashboard) |
| Storage (`storage/app/public`) | `/public/uploads` served via Next static folder |

## Supabase Schema Highlights
- Tabel `users`, `barangs`, `tipes`, `kategoris`, `statuses` dibuat di Supabase (PostgreSQL) mengikuti struktur Laravel.
- Foreign key:
  - `barangs.tipe_id` → `tipes.id`
  - `barangs.kategori_id` → `kategoris.id`
  - `barangs.status_id` → `statuses.id`
  - `barangs.pelapor_id` → `users.id`
- Gunakan Supabase SQL editor atau migration scripts untuk menambahkan constraint & index sesuai kebutuhan pencarian (misal `GIN` index untuk kolom teks).

## Route Mapping
- `/` → redirects to `/barangs`
- `/barangs` → landing + aggregated sections; uses server component fetching `GET /api/barangs?scope=overview`
- `/barangs/[id]` → detail page
- `/barangs/lapor-hilang` & `/barangs/lapor-temuan` → authenticated client components with forms posting to `/api/barangs`
- `/riwayat-laporan` → protected page fetching `/api/barangs?scope=history`
- `/dashboard` (admin) → protected by role check
- `/profile` → form backed by `/api/profile`
- Search: `/cari` page using server actions to call `/api/barangs?query=...`

## API Surface
- `GET /api/barangs` (filters: query, tipe, kategoriIds, statusScope)
- `POST /api/barangs` (auth required)
- `PUT /api/barangs/[id]`, `DELETE /api/barangs/[id]` (auth + ownership/admin guard)
- `PUT /api/barangs/[id]/selesaikan`
- `GET /api/reference/kategoris|tipes|statuses`
- `GET/PUT /api/profile`
- `POST /api/auth/register`, `POST /api/auth/login`

## Auth Workflow
1. Registration & login handled via NextAuth Credentials provider dengan query langsung ke Supabase `users`.
2. Session stored in JWT, with role embedded for middleware checks.
3. `middleware.ts` protects `/dashboard`, `/riwayat-laporan`, and form routes.

## UI Composition
- Global layout in `app/(public)/layout.tsx` replicating navigation + hero sections.
- Shared components: `Navbar`, `BarangCard`, `RiwayatCard`, `FilterSidebar`, `Alert`.
- Tailwind config migrated from `tailwind.config.js`.
- Forms use `react-hook-form` + `zod` for validation feedback matching Blade components.

## Migration Steps
1. Scaffold Next.js app inside `apps/web` (or `next-app`).
2. Copy Tailwind config & base styles; adjust to JSX.
3. Siapkan Supabase schema (SQL) & seeding data awal lewat Supabase SQL editor atau `supabase` CLI.
4. Build authentication pages & middleware.
5. Port public-facing UI pages.
6. Implement admin dashboard & CRUD flows.
7. Deprecate Laravel app once parity & testing complete.

## Outstanding Questions
- Confirm target database (MySQL/MariaDB vs PostgreSQL vs SQLite).
- Decide on deployment environment and image storage (local vs cloud).
- Define email verification & password reset flows (Laravel provided scaffolding).

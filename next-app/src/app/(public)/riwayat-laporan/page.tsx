import Link from "next/link";

export default function RiwayatLaporanPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Riwayat Laporan</h1>
        <p className="text-sm text-slate-600">
          Halaman ini membutuhkan autentikasi pengguna. Fungsionalitas penuh akan tersedia setelah modul login &
          role-based access control selesai dimigrasikan.
        </p>
      </header>
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        Sementara waktu, silakan pantau daftar laporan umum atau siapkan kredensial database Anda untuk mencoba build
        baru setelah autentikasi aktif.
      </div>
      <Link
        href="/barangs"
        className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
      >
        Kembali ke daftar barang
      </Link>
    </section>
  );
}

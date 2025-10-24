import Link from "next/link";

export default function LaporTemuanPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-6 rounded-2xl border bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Laporkan Barang Temuan</h1>
        <p className="text-sm text-slate-600">
          Kami sedang menyiapkan formulir laporan baru berbasis Next.js. Setelah autentikasi tersedia, Anda bisa
          langsung mengunggah detail barang temuan di sini.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        Silakan cek daftar barang hilang untuk memastikan apakah barang yang Anda temukan sudah dilaporkan sebelumnya.
      </div>
      <div className="flex gap-3">
        <Link
          href="/barangs"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
        >
          Kembali ke daftar
        </Link>
        <Link
          href="/barangs/lapor-hilang"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Laporkan Barang Hilang
        </Link>
      </div>
    </section>
  );
}

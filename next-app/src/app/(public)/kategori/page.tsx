import Image from "next/image";
import Link from "next/link";
import { getAllKategoris } from "@/lib/barang-service";

function getKategoriIcon(name: string) {
  const normalized = encodeURIComponent(name.toLowerCase());
  return `/assets/${normalized}.svg`;
}

export default async function KategoriPage() {
  const kategoris = await getAllKategoris();

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-16 pt-28">
      <div className="mx-auto max-w-5xl px-6">
        <header className="text-center">
          <h1 className="text-3xl font-semibold text-[#1d1d1d] md:text-4xl">Kategori Barang</h1>
          <p className="mt-3 text-sm text-[#6b6b6b] md:text-base">
            Pilih kategori untuk menelusuri laporan barang hilang dan temuan dengan lebih cepat.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {kategoris.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              Kategori belum tersedia saat ini.
            </p>
          ) : (
            kategoris.map((kategori) => (
              <Link
                key={kategori.id}
                href={`/cari?tipe=Temuan&kategori=${kategori.id}`}
                className="flex flex-col items-center gap-4 rounded-[20px] border border-white bg-white px-6 py-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f5ff]">
                  <Image
                    src={getKategoriIcon(kategori.nama)}
                    alt={kategori.nama}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h2 className="text-lg font-semibold text-[#1d1d1d]">{kategori.nama}</h2>
                <span className="text-xs font-semibold uppercase tracking-wide text-[#3a64c4]">
                  Telusuri Lap. Terkait →
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

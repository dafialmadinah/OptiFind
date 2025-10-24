import Image from "next/image";
import Link from "next/link";
import { BarangCard } from "@/components/barang/barang-card";
import { getAllKategoris, searchBarangs, type Kategori } from "@/lib/barang-service";

type Props = {
  searchParams: {
    q?: string;
    tipe?: string;
    kategori?: string | string[];
  };
};

const tipeTabs = [
  { label: "Temuan", value: "Temuan" },
  { label: "Hilang", value: "Hilang" },
];

export default async function CariPage({ searchParams }: Props) {
  const query = searchParams.q ?? "";
  const tipe = searchParams.tipe ?? "Temuan";
  const kategoriParam = searchParams.kategori;
  const kategoriFilter = Array.isArray(kategoriParam)
    ? kategoriParam.map((k) => Number(k)).filter((v) => !Number.isNaN(v))
    : kategoriParam
      ? [Number(kategoriParam)].filter((v) => !Number.isNaN(v))
      : [];

  const [barangs, kategoris] = await Promise.all([
    searchBarangs({ q: query, tipe, kategori: kategoriFilter }),
    getAllKategoris(),
  ]);

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <div className="mx-auto max-w-[1512px] px-4 pt-24 pb-10 sm:px-6 md:px-12 lg:px-[100px]">
        <div className="flex flex-col items-start gap-10 md:flex-row md:gap-[40px]">
          <aside className="hidden w-full max-w-[240px] rounded-[10px] bg-white p-6 shadow md:block">
            <FilterForm query={query} tipe={tipe} kategoriFilter={kategoriFilter} kategoris={kategoris} />
          </aside>

          <section className="w-full flex-1 space-y-6">
            <div className="flex flex-wrap justify-center gap-6 md:justify-start">
              {tipeTabs.map((tab) => {
                const isActive = tipe === tab.value;
                return (
                  <Link
                    key={tab.value}
                    href={`/cari?${buildQueryString({ q: query, tipe: tab.value, kategori: kategoriFilter })}`}
                    className={`flex min-w-[120px] flex-col items-center border-b-[3px] px-2 pb-1 text-[18px] font-semibold ${
                      isActive ? "border-[#2c599d] text-[#2c599d]" : "border-transparent text-[#b0b0b0]"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              {query ? (
                <h1 className="text-[16px] font-semibold text-black md:text-[18px]">
                  Hasil untuk: <span className="text-[#2c599d]">{query}</span>
                </h1>
              ) : (
                <h1 className="text-[18px] font-semibold text-black md:text-[20px]">Semua laporan</h1>
              )}

              <div className="relative md:hidden">
                <details className="group">
              <summary className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#193a6f] shadow outline-none">
                    <Image src="/assets/filter.svg" alt="Filter" width={20} height={20} />
                  </summary>
                  <div className="absolute right-0 z-50 mt-3 w-72 rounded-[12px] border bg-white p-5 shadow-lg">
                    <FilterForm
                      query={query}
                      tipe={tipe}
                      kategoriFilter={kategoriFilter}
                      kategoris={kategoris}
                      isCompact
                    />
                  </div>
                </details>
              </div>
            </div>

            {barangs.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-gray-500">
                Tidak ada hasil untuk pencarian ini.
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                {barangs.map((barang) => (
                  <BarangCard key={barang.id} barang={barang} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function FilterForm({
  query,
  tipe,
  kategoriFilter,
  kategoris,
  isCompact = false,
}: {
  query: string;
  tipe: string;
  kategoriFilter: number[];
  kategoris: Kategori[];
  isCompact?: boolean;
}) {
  return (
    <form action="/cari" className={`space-y-6 ${isCompact ? "" : "text-sm"}`}>
      <input type="hidden" name="tipe" value={tipe} />
      <div className="space-y-2">
        <label htmlFor={isCompact ? "search-mobile" : "search"} className="text-sm font-semibold text-[#193a6f]">
          Kata kunci
        </label>
        <input
          id={isCompact ? "search-mobile" : "search"}
          name="q"
          defaultValue={query}
          placeholder="Cari nama barang atau lokasi"
          className="w-full rounded-[10px] border border-slate-200 px-3 py-2 text-sm text-[#193a6f] focus:border-[#193a6f] focus:outline-none focus:ring-2 focus:ring-[#193a6f]/20"
          type="text"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-[#193a6f]">Kategori</p>
        <div className="mt-3 space-y-2">
          {kategoris.map((kategori) => (
            <label key={kategori.id} className="flex items-center gap-2 text-sm text-[#193a6f]">
              <input
                type="checkbox"
                name="kategori"
                value={kategori.id}
                defaultChecked={kategoriFilter.includes(kategori.id)}
                className="h-4 w-4 rounded border-slate-300 text-[#193a6f] focus:ring-[#193a6f]"
              />
              {kategori.nama}
            </label>
          ))}
          {kategoris.length === 0 && <p className="text-xs text-slate-400">Belum ada kategori yang tersedia.</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-[10px] bg-[#193a6f] py-2 text-sm font-semibold text-white transition hover:bg-[#142e56]"
      >
        Terapkan filter
      </button>

      <Link
        href="/barangs"
        className="flex w-full items-center justify-center rounded-[10px] border border-[#193a6f] py-2 text-sm font-semibold text-[#193a6f] transition hover:bg-[#193a6f] hover:text-white"
      >
        Reset pencarian
      </Link>
    </form>
  );
}

function buildQueryString({
  q,
  tipe,
  kategori,
}: {
  q?: string;
  tipe?: string;
  kategori?: number[];
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tipe) params.set("tipe", tipe);
  kategori?.forEach((value) => {
    params.append("kategori", value.toString());
  });
  return params.toString();
}

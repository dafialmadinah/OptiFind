import { supabase } from "./supabase";

export type Reference = {
  id: number;
  nama: string;
};

export type PelaporSummary = {
  id: string; // UUID
  name: string | null;
  username: string | null;
  noTelepon: string | null;
} | null;

export type BarangWithRelations = {
  id: number;
  nama: string;
  tipe: string; // 'hilang' or 'temuan' (TEXT field)
  kategoriId: number;
  pelaporId: string | null; // UUID string
  statusId: number;
  waktu: string;
  lokasi: string | null;
  kontak: string | null;
  deskripsi: string | null;
  foto: string | null;
  createdAt: string;
  updatedAt: string;
  kategori: Reference;
  status: Reference;
  pelapor: PelaporSummary;
};

export type Kategori = Reference;

type SupabaseBarangRow = {
  id: number;
  nama: string;
  tipe: string; // TEXT field
  kategori_id: number;
  pelapor_id: string | null; // UUID
  status_id: number;
  waktu: string | null;
  lokasi: string | null;
  kontak: string | null;
  deskripsi: string | null;
  foto: string | null;
  created_at: string | null;
  updated_at: string | null;
  kategori: Reference[] | null;
  status: Reference[] | null;
  pelapor:
    | {
        id: string; // UUID
        name: string | null;
        username: string | null;
        no_telepon: string | null;
      }[]
    | null;
};

const barangSelect = `
  id,
  nama,
  tipe,
  kategori_id,
  pelapor_id,
  status_id,
  waktu,
  lokasi,
  kontak,
  deskripsi,
  foto,
  created_at,
  updated_at,
  kategori:kategori_id(id, nama),
  status:status_id(id, nama),
  pelapor:pelapor_id(id, name, username, no_telepon)
`;

// Map data dari Supabase ke bentuk BarangWithRelations
function mapBarang(row: SupabaseBarangRow): BarangWithRelations {
  const kategoriRel = row.kategori?.[0] ?? { id: row.kategori_id, nama: "-" };
  const statusRel = row.status?.[0] ?? { id: row.status_id, nama: "-" };
  const pelaporRel = row.pelapor?.[0] ?? null;

  return {
    id: row.id,
    nama: row.nama,
    tipe: row.tipe, // 'hilang' or 'temuan'
    kategoriId: row.kategori_id,
    pelaporId: row.pelapor_id,
    statusId: row.status_id,
    waktu: row.waktu ?? "",
    lokasi: row.lokasi,
    kontak: row.kontak,
    deskripsi: row.deskripsi,
    foto: row.foto,
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
    kategori: kategoriRel,
    status: statusRel,
    pelapor: pelaporRel
      ? {
          id: pelaporRel.id,
          name: pelaporRel.name,
          username: pelaporRel.username,
          noTelepon: pelaporRel.no_telepon,
        }
      : null,
  };
}

function mapBarangs(rows: SupabaseBarangRow[] | null): BarangWithRelations[] {
  if (!rows) return [];
  return rows.map(mapBarang);
}

function sortByWaktuDesc(items: BarangWithRelations[]) {
  return [...items].sort((a, b) => {
    const timeA = a.waktu ? new Date(a.waktu).getTime() : 0;
    const timeB = b.waktu ? new Date(b.waktu).getTime() : 0;
    return timeB - timeA;
  });
}

const emptyOverview = {
  barangs: [] as BarangWithRelations[],
  kategoris: [] as Kategori[],
  barangTemuan: [] as BarangWithRelations[],
  barangHilang: [] as BarangWithRelations[],
};

// Ambil overview barang dan kategori
export async function getBarangOverview() {
  if (!supabase) return emptyOverview;

  try {
    const [
      { data: barangData, error: barangError },
      { data: kategoriData, error: kategoriError },
    ] = await Promise.all([
      supabase.from("barangs").select(barangSelect).order("created_at", { ascending: false }),
      supabase.from("kategoris").select("id, nama").order("nama", { ascending: true }),
    ]);

    if (barangError) throw barangError;
    if (kategoriError) throw kategoriError;

    const barangs = mapBarangs(barangData ?? []);
    const kategoris: Kategori[] = (kategoriData ?? []) as Kategori[];

    const barangTemuan = sortByWaktuDesc(
      barangs.filter(
        (barang) => barang.tipe === "temuan" && barang.status.nama === "Belum Dikembalikan"
      )
    ).slice(0, 6);

    const barangHilang = sortByWaktuDesc(
      barangs.filter(
        (barang) => barang.tipe === "hilang" && barang.status.nama === "Belum Ditemukan"
      )
    ).slice(0, 6);

    return { barangs, kategoris, barangTemuan, barangHilang };
  } catch (error) {
    console.error("Failed to fetch barang overview", error);
    return emptyOverview;
  }
}

// Ambil barang berdasarkan ID
export async function getBarangById(id: number): Promise<BarangWithRelations | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("barangs")
      .select(barangSelect)
      .eq("id", id)
      .maybeSingle<SupabaseBarangRow>();

    if (error) throw error;
    if (!data) return null;

    return mapBarang(data);
  } catch (error) {
    console.error("Failed to fetch barang", error);
    return null;
  }
}

// Parameter pencarian
export type SearchParams = {
  q?: string;
  tipe?: string;
  kategori?: number[];
};

// Fungsi pencarian barang
export async function searchBarangs(params: SearchParams): Promise<BarangWithRelations[]> {
  if (!supabase) return [];

  const { q, tipe, kategori = [] } = params;

  try {
    let query = supabase.from("barangs").select(barangSelect).order("waktu", { ascending: false });

    if (kategori.length > 0) {
      query = query.in("kategori_id", kategori);
    }

    const { data, error } = await query;
    if (error) throw error;

    let items = mapBarangs(data ?? []);

    if (q) {
      const needle = q.toLowerCase();
      items = items.filter(
        (barang) =>
          barang.nama.toLowerCase().includes(needle) ||
          (barang.kategori?.nama?.toLowerCase().includes(needle) ?? false) ||
          (barang.lokasi?.toLowerCase().includes(needle) ?? false)
      );
    }

    if (tipe) {
      const tipeNormalized = tipe.toLowerCase(); // normalize to 'hilang' or 'temuan'
      items = items.filter((barang) => barang.tipe === tipeNormalized);

      if (tipeNormalized === "temuan") {
        items = items.filter((barang) => barang.status.nama === "Belum Dikembalikan");
      } else if (tipeNormalized === "hilang") {
        items = items.filter((barang) => barang.status.nama === "Belum Ditemukan");
      }
    }

    return items;
  } catch (error) {
    console.error("Failed to search barangs", error);
    return [];
  }
}

// Ambil semua kategori
export async function getAllKategoris(): Promise<Kategori[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("kategoris")
      .select("id, nama")
      .order("nama", { ascending: true });

    if (error) throw error;

    return (data ?? []) as Kategori[];
  } catch (error) {
    console.error("Failed to fetch kategoris", error);
    return [];
  }
}

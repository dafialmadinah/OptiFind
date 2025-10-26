import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { barangSchema } from "@/lib/validation";
import { getBarangById, searchBarangs } from "@/lib/barang-service";
import { getSupabaseUser } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? undefined;
  const tipe = searchParams.get("tipe") ?? undefined;
  const kategoriParams = searchParams.getAll("kategori");

  const kategori = kategoriParams
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value));

  const barangs = await searchBarangs({
    q: query,
    tipe,
    kategori,
  });

  return NextResponse.json({ data: barangs });
}

export async function POST(request: NextRequest) {
  const user = await getSupabaseUser(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  if (!supabase) {
      return NextResponse.json(
        { message: "Supabase belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

  try {
    const json = await request.json();
    
    // Determine tipe_id: 1 for hilang, 2 for temuan
    let tipeId: number;
    if (json.tipe === 'hilang') {
      tipeId = 1;
    } else if (json.tipe === 'temuan') {
      tipeId = 2;
    } else {
      tipeId = Number(json.tipeId) || 2; // default to temuan
    }

    // Get or create kategori_id
    let kategoriId: number;
    
    if (json.kategoriId) {
      kategoriId = Number(json.kategoriId);
    } else if (json.kategori) {
      // Check if kategori exists by name
      const { data: existingKategori } = await supabase
        .from('kategoris')
        .select('id')
        .ilike('nama', json.kategori)
        .single();

      if (existingKategori) {
        kategoriId = existingKategori.id;
      } else {
        // Create new kategori
        const { data: newKategori, error: kategoriError } = await supabase
          .from('kategoris')
          .insert({ nama: json.kategori })
          .select('id')
          .single();

        if (kategoriError || !newKategori) {
          console.error('Kategori insert error:', kategoriError);
          return NextResponse.json(
            { message: 'Gagal membuat kategori baru' },
            { status: 500 }
          );
        }

        kategoriId = newKategori.id;
      }
    } else {
      return NextResponse.json(
        { message: 'Kategori diperlukan' },
        { status: 422 }
      );
    }

    // Get pelapor_id from authenticated user (UUID dari Supabase Auth)
    const pelaporId = user.id;

    // Default status_id (1 = Belum Dikembalikan)
    const statusId = Number(json.statusId) || 1;

    // Validate required fields
    if (!json.nama) {
      return NextResponse.json(
        { message: 'Nama barang diperlukan' },
        { status: 422 }
      );
    }

    // Insert barang
    const { data: inserted, error: insertError } = await supabase
      .from("barangs")
      .insert({
        nama: json.nama,
        tipe_id: tipeId,
        kategori_id: kategoriId,
        pelapor_id: pelaporId,
        waktu: json.waktu ? new Date(json.waktu).toISOString() : null,
        lokasi: json.lokasi ?? null,
        kontak: json.kontak ?? null,
        deskripsi: json.deskripsi ?? null,
        foto: json.foto ?? null,
        status_id: statusId,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { message: "Gagal menyimpan data barang." },
        { status: 500 }
      );
    }

    const barang = await getBarangById(inserted.id);
    return NextResponse.json({ data: barang }, { status: 201 });
  } catch (error) {
    console.error("Failed to create barang:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

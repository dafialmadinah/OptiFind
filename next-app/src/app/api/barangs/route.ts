import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabaseAdmin } from "@/lib/supabase";
import { barangSchema } from "@/lib/validation";
import { getBarangById, searchBarangs } from "@/lib/barang-service";

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

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ message: "Supabase belum dikonfigurasi." }, { status: 500 });
  }

  try {
    const json = await request.json();
    const payload = {
      ...json,
      tipeId: Number(json.tipeId),
      kategoriId: Number(json.kategoriId),
      statusId: Number(json.statusId),
    };

    const parsed = barangSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const data = parsed.data;
    const pelaporId = Number(session.user.id);

    if (Number.isNaN(pelaporId)) {
      return NextResponse.json({ message: "Session tidak valid." }, { status: 401 });
    }

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("barangs")
      .insert({
        nama: data.nama,
        tipe_id: data.tipeId,
        kategori_id: data.kategoriId,
        pelapor_id: pelaporId,
        waktu: data.waktu ? new Date(data.waktu).toISOString() : null,
        lokasi: data.lokasi ?? null,
        kontak: data.kontak ?? null,
        deskripsi: data.deskripsi ?? null,
        foto: data.foto ? data.foto : null,
        status_id: data.statusId,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      throw insertError ?? new Error("Gagal menyimpan data barang.");
    }

    const barang = await getBarangById(inserted.id);

    return NextResponse.json({ data: barang }, { status: 201 });
  } catch (error) {
    console.error("Failed to create barang", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

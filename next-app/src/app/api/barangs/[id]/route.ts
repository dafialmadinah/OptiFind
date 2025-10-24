import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabaseAdmin } from "@/lib/supabase";
import { barangSchema } from "@/lib/validation";
import { getBarangById } from "@/lib/barang-service";

type Params = {
  params: { id: string };
};

export async function GET(_: Request, { params }: Params) {
  const barangId = Number(params.id);
  if (Number.isNaN(barangId)) {
    return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
  }

  const barang = await getBarangById(barangId);

  if (!barang) {
    return NextResponse.json({ message: "Barang tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ data: barang });
}

export async function PUT(request: Request, { params }: Params) {
  const barangId = Number(params.id);
  if (Number.isNaN(barangId)) {
    return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ message: "Supabase belum dikonfigurasi." }, { status: 500 });
  }

  const existing = await getBarangById(barangId);

  if (!existing) {
    return NextResponse.json({ message: "Barang tidak ditemukan." }, { status: 404 });
  }

  const userId = Number(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin && existing.pelaporId !== userId) {
    return NextResponse.json({ message: "Anda tidak memiliki akses." }, { status: 403 });
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

    const { error: updateError } = await supabaseAdmin
      .from("barangs")
      .update({
        nama: data.nama,
        tipe_id: data.tipeId,
        kategori_id: data.kategoriId,
        waktu: data.waktu ? new Date(data.waktu).toISOString() : null,
        lokasi: data.lokasi ?? null,
        kontak: data.kontak ?? null,
        deskripsi: data.deskripsi ?? null,
        foto: data.foto ? data.foto : null,
        status_id: data.statusId,
      })
      .eq("id", barangId);

    if (updateError) {
      throw updateError;
    }

    const barang = await getBarangById(barangId);

    return NextResponse.json({ data: barang });
  } catch (error) {
    console.error("Failed to update barang", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const barangId = Number(params.id);
  if (Number.isNaN(barangId)) {
    return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ message: "Supabase belum dikonfigurasi." }, { status: 500 });
  }

  const existing = await getBarangById(barangId);

  if (!existing) {
    return NextResponse.json({ message: "Barang tidak ditemukan." }, { status: 404 });
  }

  const userId = Number(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin && existing.pelaporId !== userId) {
    return NextResponse.json({ message: "Anda tidak memiliki akses." }, { status: 403 });
  }

  try {
    const { error: deleteError } = await supabaseAdmin.from("barangs").delete().eq("id", barangId);
    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: "Barang berhasil dihapus." });
  } catch (error) {
    console.error("Failed to delete barang", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

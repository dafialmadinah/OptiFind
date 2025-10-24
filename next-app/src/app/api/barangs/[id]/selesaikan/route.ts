import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabaseAdmin } from "@/lib/supabase";
import { getBarangById } from "@/lib/barang-service";

type Params = {
  params: { id: string };
};

export async function PUT(_: Request, { params }: Params) {
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

  const barang = await getBarangById(barangId);

  if (!barang) {
    return NextResponse.json({ message: "Barang tidak ditemukan." }, { status: 404 });
  }

  const userId = Number(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin && barang.pelaporId !== userId) {
    return NextResponse.json({ message: "Anda tidak memiliki akses." }, { status: 403 });
  }

  const statusNama = barang.status.nama.toLowerCase();
  let statusTarget: string | null = null;

  if (statusNama.includes("belum ditemukan")) {
    statusTarget = "Sudah Ditemukan";
  } else if (statusNama.includes("belum dikembalikan")) {
    statusTarget = "Sudah Dikembalikan";
  } else {
    return NextResponse.json({ message: "Laporan sudah dalam status selesai." }, { status: 400 });
  }

  const { data: statusBaru, error: statusError } = await supabaseAdmin
    .from("statuses")
    .select("id")
    .eq("nama", statusTarget)
    .maybeSingle<{ id: number }>();

  if (statusError) {
    console.error("Status lookup error", statusError);
    return NextResponse.json({ message: "Gagal mencari status baru." }, { status: 500 });
  }

  if (!statusBaru) {
    return NextResponse.json({ message: "Status tujuan tidak ditemukan." }, { status: 500 });
  }

  const { error: updateError } = await supabaseAdmin
    .from("barangs")
    .update({ status_id: statusBaru.id })
    .eq("id", barangId);

  if (updateError) {
    console.error("Status update error", updateError);
    return NextResponse.json({ message: "Gagal memperbarui status." }, { status: 500 });
  }

  return NextResponse.json({ message: "Status laporan berhasil diperbarui." });
}

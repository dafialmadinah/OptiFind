import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSupabaseUser } from "@/lib/supabase-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const barangId = parseInt(params.id);
    if (isNaN(barangId)) {
      return NextResponse.json(
        { message: "ID barang tidak valid" },
        { status: 400 }
      );
    }

    const json = await request.json();
    const { statusId } = json;

    if (!statusId || ![1, 2, 3, 4].includes(statusId)) {
      return NextResponse.json(
        { message: "Status ID harus antara 1-4" },
        { status: 400 }
      );
    }

    // Check if barang exists and belongs to user
    const { data: barang, error: fetchError } = await supabase
      .from("barangs")
      .select("pelapor_id")
      .eq("id", barangId)
      .single();

    if (fetchError || !barang) {
      return NextResponse.json(
        { message: "Barang tidak ditemukan" },
        { status: 404 }
      );
    }

    if (barang.pelapor_id !== user.id) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses untuk mengubah barang ini" },
        { status: 403 }
      );
    }

    // Update status
    const { data, error } = await supabase
      .from("barangs")
      .update({ status_id: statusId })
      .eq("id", barangId)
      .select()
      .single();

    if (error) {
      console.error("Update status error:", error);
      return NextResponse.json(
        { message: "Gagal mengubah status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, message: "Status berhasil diubah" });
  } catch (error) {
    console.error("Failed to update status:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

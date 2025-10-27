import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getBarangById } from "@/lib/barang-service";
import { getSupabaseUser } from "@/lib/supabase-server";

type Params = {
    params: { id: string };
};

export async function PUT(request: NextRequest, { params }: Params) {
    const barangId = Number(params.id);
    if (Number.isNaN(barangId)) {
        return NextResponse.json(
            { message: "ID tidak valid." },
            { status: 400 }
        );
    }

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

    const barang = await getBarangById(barangId);
    if (!barang) {
        return NextResponse.json(
            { message: "Barang tidak ditemukan." },
            { status: 404 }
        );
    }

    const userId = user.id; // UUID string from Supabase Auth
    
    // Get user role from database
    const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();
    
    const isAdmin = userData?.role === "ADMIN";

    // Compare UUID strings
    if (!isAdmin && barang.pelaporId !== userId) {
        return NextResponse.json(
            { message: "Anda tidak memiliki akses." },
            { status: 403 }
        );
    }

    if (!barang.status) {
        return NextResponse.json(
            { message: "Status barang tidak ditemukan." },
            { status: 400 }
        );
    }

    const statusNama = barang.status.nama.toLowerCase();
    let statusTarget: string | null = null;

    if (statusNama.includes("belum ditemukan")) {
        statusTarget = "Sudah Ditemukan";
    } else if (statusNama.includes("belum dikembalikan")) {
        statusTarget = "Sudah Dikembalikan";
    } else {
        return NextResponse.json(
            { message: "Laporan sudah dalam status selesai." },
            { status: 400 }
        );
    }

    // 🔹 Cari status baru
    const { data: statusBaru, error: statusError } = await supabase
        .from("statuses")
        .select("id")
        .eq("nama", statusTarget)
        .maybeSingle<{ id: number }>();

    if (statusError) {
        console.error("Status lookup error", statusError);
        return NextResponse.json(
            { message: "Gagal mencari status baru." },
            { status: 500 }
        );
    }

    if (!statusBaru) {
        return NextResponse.json(
            { message: "Status tujuan tidak ditemukan." },
            { status: 500 }
        );
    }

    // 🔹 Update status barang
    const { error: updateError } = await supabase
        .from("barangs")
        .update({ status_id: statusBaru.id })
        .eq("id", barangId);

    if (updateError) {
        console.error("Status update error", updateError);
        return NextResponse.json(
            { message: "Gagal memperbarui status." },
            { status: 500 }
        );
    }

    return NextResponse.json({
        message: "Status laporan berhasil diperbarui.",
    });
}

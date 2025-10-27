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

    // Pastikan Supabase sudah dikonfigurasi
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

    // Compare UUID strings - only owner or admin can edit
    if (!isAdmin && barang.pelaporId !== userId) {
        return NextResponse.json(
            { message: "Anda tidak memiliki akses." },
            { status: 403 }
        );
    }

    // Parse request body untuk update data barang
    const body = await request.json();
    const { nama, kategoriId, waktu, lokasi, deskripsi, kontak, foto } = body;

    // Validasi required fields
    if (!nama || !kategoriId || !lokasi || !kontak) {
        return NextResponse.json(
            { message: "Field wajib tidak lengkap." },
            { status: 400 }
        );
    }

    // Update data barang (TIDAK termasuk status_id)
    const { error: updateError } = await supabase
        .from("barangs")
        .update({
            nama,
            kategori_id: kategoriId,
            waktu: waktu || null,
            lokasi,
            deskripsi: deskripsi || null,
            kontak,
            foto: foto || null,
            // TIDAK update status_id - status tetap sama
        })
        .eq("id", barangId);

    if (updateError) {
        console.error("Barang update error:", updateError);
        return NextResponse.json(
            { message: "Gagal memperbarui barang." },
            { status: 500 }
        );
    }

    return NextResponse.json({
        message: "Barang berhasil diperbarui.",
    });
}

export async function GET(request: NextRequest, { params }: Params) {
    {
        const barangId = Number(params.id);
        if (Number.isNaN(barangId)) {
            return NextResponse.json(
                { message: "ID tidak valid." },
                { status: 400 }
            );
        }

        const barang = await getBarangById(barangId);
        if (!barang) {
            return NextResponse.json(
                { message: "Barang tidak ditemukan." },
                { status: 404 }
            );
        }

        return NextResponse.json(barang);
    }
}

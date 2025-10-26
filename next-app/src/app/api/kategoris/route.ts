import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/kategoris - Get all categories
export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase belum dikonfigurasi di server." },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("kategoris")
      .select("*")
      .order("nama", { ascending: true });

    if (error) {
      console.error("Kategori fetch error:", error);
      return NextResponse.json(
        { message: "Gagal mengambil data kategori." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error("Failed to fetch kategoris:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

// POST /api/kategoris - Create new category (optional, bisa auto-create dari barang)
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase belum dikonfigurasi di server." },
      { status: 500 }
    );
  }

  try {
    const json = await request.json();

    if (!json.nama) {
      return NextResponse.json(
        { message: "Nama kategori diperlukan" },
        { status: 422 }
      );
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from("kategoris")
      .select("id, nama")
      .ilike("nama", json.nama)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { message: "Kategori sudah ada", data: existing },
        { status: 409 }
      );
    }

    // Insert new kategori
    const { data: inserted, error: insertError } = await supabase
      .from("kategoris")
      .insert({ nama: json.nama })
      .select("*")
      .single();

    if (insertError || !inserted) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { message: "Gagal membuat kategori." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("Failed to create kategori:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/statuses - Get all statuses
export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase belum dikonfigurasi di server." },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("statuses")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Status fetch error:", error);
      return NextResponse.json(
        { message: "Gagal mengambil data status." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error("Failed to fetch statuses:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

// POST /api/statuses - Create new status
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
        { message: "Nama status diperlukan" },
        { status: 422 }
      );
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from("statuses")
      .select("id, nama")
      .ilike("nama", json.nama)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { message: "Status sudah ada", data: existing },
        { status: 409 }
      );
    }

    // Insert new status
    const { data: inserted, error: insertError } = await supabase
      .from("statuses")
      .insert({ nama: json.nama })
      .select("*")
      .single();

    if (insertError || !inserted) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { message: "Gagal membuat status." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    console.error("Failed to create status:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

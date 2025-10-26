import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase belum dikonfigurasi di server." },
      { status: 500 },
    );
  }

  try {
    const json = await request.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const { name, username, email, noTelepon, password } = parsed.data;

    // Cek apakah user sudah ada di database
    const { data: existing, error: existingError } = await supabase
      .from("users")
      .select("id")
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (existingError && existingError.code !== "PGRST116") {
      throw existingError;
    }

    if (existing) {
      return NextResponse.json(
        { message: "Email atau username sudah digunakan." },
        { status: 409 },
      );
    }

    // Hash password untuk database
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create user di Supabase Auth menggunakan signUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          no_telepon: noTelepon ?? null,
        },
      },
    });

    if (authError) {
      console.error("Auth user creation error:", authError);
      return NextResponse.json(
        { message: authError.message || "Gagal membuat user auth." },
        { status: 500 },
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { message: "Gagal membuat user." },
        { status: 500 },
      );
    }

    // 2. Insert user ke database dengan auth.uid
    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id, // Gunakan UUID dari Supabase Auth
        name,
        username,
        email,
        no_telepon: noTelepon ?? null,
        password: hashedPassword,
        role: "user",
      })
      .select("id, name, email, username, role")
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      // Note: Dengan anon key, kita tidak bisa menghapus user dari auth
      // User akan tetap ada di auth tapi tidak di database
      // Alternatif: gunakan RLS policy untuk mencegah insert duplikat
      return NextResponse.json(
        { message: "Gagal menyimpan data user." },
        { status: 500 },
      );
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}

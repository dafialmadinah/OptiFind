import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // ubah import
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

    // Cek apakah user sudah ada
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert({
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
      throw insertError;
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

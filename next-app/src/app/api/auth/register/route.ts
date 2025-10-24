import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!supabaseAdmin) {
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

    const { data: existing, error: existingError } = await supabaseAdmin
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        name,
        username,
        email,
        no_telepon: noTelepon ?? null,
        password: hashedPassword,
        role: "USER",
      })
      .select("id, name, email, username, role")
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

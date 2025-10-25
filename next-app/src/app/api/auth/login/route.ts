import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { supabase } from "@/lib/supabase";
import { loginSchema } from "@/lib/validation";

type SupabaseUserRow = {
  id: number;
  name: string | null;
  email: string;
  username: string | null;
  no_telepon: string | null;
  password: string;
  role: string;
};

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase belum dikonfigurasi di server." },
      { status: 500 }
    );
  }

  try {
    const json = await request.json();
    const parsed = loginSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { email, password } = parsed.data;

    // Cari user berdasarkan email
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, username, no_telepon, password, role")
      .eq("email", email)
      .maybeSingle<SupabaseUserRow>();

    if (error || !user) {
      return NextResponse.json(
        { message: "Email atau password tidak valid." },
        { status: 401 }
      );
    }

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Email atau password tidak valid." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "your-secret-key";
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      secret,
      { expiresIn: "7d" } // Token berlaku 7 hari
    );

    // Return user data dan token (tanpa password)
    return NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          noTelepon: user.no_telepon,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

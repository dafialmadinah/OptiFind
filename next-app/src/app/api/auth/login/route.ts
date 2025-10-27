import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
    try {
        const json = await request.json();
        const parsed = loginSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { message: "Validasi gagal", errors: parsed.error.flatten() },
                { status: 422 }
            );
        }

        if (!supabase) {
            return NextResponse.json(
                { message: "Supabase belum dikonfigurasi di server." },
                { status: 500 }
            );
        }

        const { email, password } = parsed.data;
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

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json(
                { message: "Email atau password tidak valid." },
                { status: 401 }
            );
        }

        // Generate JWT token
        const secret = process.env.JWT_SECRET || "your-secret-key";
        const token = sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
            secret,
            { expiresIn: "7d" }
        );

        // Simpan token di cookie
        const res = NextResponse.json({
            message: "Login berhasil",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                noTelepon: user.no_telepon,
                role: user.role,
            },
        });

        res.cookies.set("token", token, {
            httpOnly: true, // aman dari XSS
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 hari
            path: "/",
        });

        return res;
    } catch (error) {
        console.error("Login error", error);
        return NextResponse.json(
            { message: "Terjadi kesalahan pada server." },
            { status: 500 }
        );
    }
}

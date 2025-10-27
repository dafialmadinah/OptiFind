import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Jika tidak ada token → redirect ke /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    verify(token, secret); // jika tidak valid akan throw error
    return NextResponse.next();
  } catch (err) {
    console.error("Invalid token:", err);
    // Hapus cookie biar ga infinite redirect
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }
}

export const config = {
  matcher: [
    "/barangs/:path*",
    "/riwayat-laporan",
    "/dashboard/:path*",
    "/cari"
  ],
};

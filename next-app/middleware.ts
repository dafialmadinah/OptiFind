export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/barangs/lapor-hilang",
    "/barangs/lapor-temuan",
    "/riwayat-laporan",
    "/dashboard/:path*",
  ],
};

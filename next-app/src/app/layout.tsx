import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { GsapProvider } from "@/components/gsap-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-primary",
});

export const metadata: Metadata = {
  title: "OptiFind",
  description: "Platform pelaporan barang hilang dan temuan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="!scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased bg-[#f0f9ff] text-slate-900 overflow-x-hidden`}>
        <GsapProvider>{children}</GsapProvider>
      </body>
    </html>
  );
}


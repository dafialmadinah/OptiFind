import type { ReactNode } from "react";
import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

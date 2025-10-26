import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PublicNavbar } from "@/components/public-navbar";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#f0f9ff] text-slate-900">
      <Navbar user={session?.user ?? null} />
=======
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar user={session?.user ?? null} />
>>>>>>> bf5e2c52c9c6e9c76405f09270622e440380a6ca
      <main>{children}</main>
    </div>
  );
}

import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Navbar } from "@/components/navbar";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-slate-900">
      <Navbar user={session?.user ?? null} />
      <main className="pb-12">{children}</main>
    </div>
  );
}

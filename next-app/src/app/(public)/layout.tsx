import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PublicNavbar } from "@/components/public-navbar";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar user={session?.user ?? null} />
      <main>{children}</main>
    </div>
  );
}

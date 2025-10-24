"use client";

import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-10">
      <Link href="/" className="mb-10 text-2xl font-semibold text-slate-900">
        OptiFind
      </Link>
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">{children}</div>
    </div>
  );
}

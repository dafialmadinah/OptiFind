'use client';

import { AuthProvider } from "@/lib/auth-context";
import { GsapProvider } from "./gsap-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GsapProvider>{children}</GsapProvider>
    </AuthProvider>
  );
}

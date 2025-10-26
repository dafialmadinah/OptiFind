'use client';

import { SessionProvider } from "next-auth/react";
import { GsapProvider } from "./gsap-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GsapProvider>{children}</GsapProvider>
    </SessionProvider>
  );
}

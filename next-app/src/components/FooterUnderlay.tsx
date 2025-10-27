"use client";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

type SocialLink = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

const QUICK_LINKS = [
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Fitur Platform", href: "/fitur" },
  { label: "Hubungi Kami", href: "/kontak" },
  { label: "Kebijakan Privasi", href: "/privacy" },
];

const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
];

export function FooterUnderlay() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      data-footer-underlay
      className="fixed bottom-0 left-0 right-0 z-0 overflow-hidden bg-gradient-to-br from-[#1a2d68] via-[#1e3675] to-[#223f8a] text-white min-h-[400px]"
      style={{ boxShadow: '0 -10px 50px rgba(244, 139, 47, 0.5)' }}
    >
      {/* DEBUG indicator */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#f48b2f] z-50" />
      
      <div className="pointer-events-none absolute left-1/2 -top-14 h-24 w-[90%] -translate-x-1/2 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute bottom-0 w-40 h-40 rounded-full -left-32 bg-white/10 blur-2xl" />
        <div className="absolute w-32 h-32 rounded-full right-12 top-4 bg-white/10 blur-2xl" />
      </div>

      <div className="relative flex flex-col w-full max-w-6xl gap-12 px-6 py-16 mx-auto md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-4">
          <div className="flex items-center gap-1">
            <Image src="/assets/magnifier.svg" alt="OptiFind" width={40} height={40} className="w-10 h-10" />
            <p className="text-2xl font-semibold leading-tight">
              <span className="text-white">pti</span>
              <span className="text-[#f48b2f]">Find</span>
            </p>
          </div>
          <p className="text-sm text-white/70">Teknologi yang Menyatukan Kepedulian.</p>
        </div>

        <div className="grid flex-1 gap-10 text-sm sm:grid-cols-[1fr] md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-wide text-white uppercase">Navigasi Cepat</p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white uppercase">Ikuti Kami</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-[#1a2d68]"
                >
                  <Icon className="h-5 w-5 transition group-hover:text-[#1a2d68]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative mx-auto h-px w-[90%] max-w-5xl bg-white/15" />
      <p className="py-6 text-xs text-center text-white/70">
        &copy; {currentYear} OptiFind! Platform. Semua hak dilindungi undang-undang.
      </p>
    </footer>
  );
}
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none top-4">
      <div
        className={`pointer-events-auto flex w-full max-w-4xl items-center justify-between gap-4 rounded-[22px] bg-gray-900/30 px-6 py-3 text-white backdrop-blur-md transition-all ${
          scrolled ? "shadow-2xl bg-gray-900/40" : "shadow-lg"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm">
            <Image src="/assets/logo_kecil.svg" alt="OptiFind" width={28} height={28} className="h-7 w-7" />
          </div>
          <span className="text-lg font-semibold tracking-wide text-white">OptiFind</span>
        </Link>

        <nav className="items-center hidden gap-6 text-sm font-semibold md:flex">
          <Link href="/#cara-kerja" className="text-white/90 hover:text-orange-400 transition-colors">
            Cara Kerja
          </Link>
          <Link href="/#dampak" className="text-white/90 hover:text-orange-400 transition-colors">
            Dampak
          </Link>
          <Link href="/#testimoni" className="text-white/90 hover:text-orange-400 transition-colors">
            Testimoni
          </Link>
        </nav>

        <div className="items-center hidden gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-[#6f6b70]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase transition bg-orange-500 rounded-full hover:bg-orange-400"
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center w-10 h-10 ml-auto border rounded-lg border-white/40 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="pointer-events-auto absolute top-full mt-3 w-full max-w-4xl rounded-2xl bg-gray-900/40 backdrop-blur-md p-4 text-white shadow-lg md:hidden">
          <Link
            href="/#cara-kerja"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-white hover:text-orange-400 transition"
          >
            Cara Kerja
          </Link>
          <Link
            href="/#dampak"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-white hover:text-orange-400 transition"
          >
            Dampak
          </Link>
          <Link
            href="/#testimoni"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-white hover:text-orange-400 transition"
          >
            Testimoni
          </Link>
          <div className="h-px my-2 bg-white/20" />
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-white/10 px-4 py-2 text-center text-sm font-semibold uppercase tracking-wide transition hover:bg-white hover:text-[#6f6b70]"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 text-sm font-semibold tracking-wide text-center text-white uppercase transition bg-orange-500 rounded-full hover:bg-orange-400"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

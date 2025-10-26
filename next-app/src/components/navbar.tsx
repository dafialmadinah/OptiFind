"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { label: "Beranda", href: "/dashboard" },
  { 
    label: "Lapor Barang", 
    href: "#",
    dropdown: [
      { label: "Barang Hilang", href: "/barangs/lapor-hilang" },
      { label: "Barang Temuan", href: "/barangs/lapor-temuan" },
    ]
  },
  { label: "Riwayat", href: "/riwayat-laporan" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut: authSignOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setDropdownOpen(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setDropdownOpen(null);
    }, 200);
    setCloseTimeout(timeout);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    if (href === "#") return false;
    return pathname.startsWith(href);
  };

  const isDropdownActive = (dropdown?: { label: string; href: string }[]) => {
    if (!dropdown) return false;
    return dropdown.some(item => pathname.startsWith(item.href));
  };

  return (
    <header className="fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none top-4">
      <div
        className={`pointer-events-auto flex w-full max-w-4xl items-center justify-between gap-4 rounded-[22px] bg-[#8b8891]/95 px-6 py-3 text-white backdrop-blur transition-shadow ${
          scrolled ? "shadow-2xl" : "shadow-lg"
        }`}
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/20 backdrop-blur-sm">
            <Image src="/assets/logo_kecil.svg" alt="OptiFind" width={28} height={28} className="h-7 w-7" />
          </div>
          <span className="text-lg font-semibold tracking-wide text-white">OptiFind</span>
        </Link>

        <nav className="items-center hidden gap-6 text-sm font-semibold md:flex">
          {navLinks.map((link) => (
            link.dropdown ? (
              <div 
                key={link.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`transition-colors flex items-center gap-1 ${
                    isDropdownActive(link.dropdown) ? "text-orange-400" : "text-white/90 hover:text-orange-400"
                  }`}
                >
                  {link.label}
                  <svg 
                    className={`w-4 h-4 transition-transform ${dropdownOpen === link.label ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {dropdownOpen === link.label && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActive(item.href) 
                            ? "bg-orange-50 text-orange-600 font-semibold" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive(link.href) ? "text-orange-400" : "text-white/90 hover:text-orange-400"
                }`}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        <div className="items-center hidden gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-white/80">{user.user_metadata?.name ?? user.email}</span>
              <button
                type="button"
                onClick={async () => {
                  await authSignOut();
                  router.push("/");
                }}
                className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-[#6f6b70]"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
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
        <div className="pointer-events-auto mt-3 w-full max-w-4xl rounded-2xl bg-[#8b8891]/95 p-4 text-white shadow-lg md:hidden">
          {navLinks.map((link) => (
            link.dropdown ? (
              <div key={link.label}>
                <div className="px-3 py-2 text-sm font-semibold text-white/70">
                  {link.label}
                </div>
                {link.dropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-lg px-6 py-2 text-sm font-medium transition ${
                      isActive(item.href) ? "bg-white/15 text-orange-400" : "text-white hover:text-orange-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive(link.href) ? "bg-white/15 text-orange-400" : "text-white hover:text-orange-400"
                }`}
              >
                {link.label}
              </Link>
            )
          ))}
          <div className="h-px bg-white/20 my-2" />
          {user ? (
            <button
              type="button"
              onClick={async () => {
                setMenuOpen(false);
                await authSignOut();
                router.push("/");
              }}
              className="mt-2 w-full rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition hover:bg-white hover:text-[#6f6b70]"
            >
              Keluar
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
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
          )}
        </div>
      )}
    </header>
  );
}


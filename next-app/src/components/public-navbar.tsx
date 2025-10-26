"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";

type PublicNavbarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
};

export function PublicNavbar({ user }: PublicNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/barangs-list?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
    setCloseTimeout(timeout);
  };

  return (
    <header className="bg-[#1e3a8a] text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="bg-white rounded-full p-2 flex items-center justify-center">
              <Image
                src="/assets/logo_kecil.svg"
                alt="Found It!"
                width={28}
                height={28}
              />
            </div>
            <span className="text-xl font-bold whitespace-nowrap">
              Found <span className="text-orange-500">It!</span>
            </span>
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari barang"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-lg text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Image
                  src="/assets/cari.svg"
                  alt="Search"
                  width={18}
                  height={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                />
              </div>
            </form>
          </div>

          {/* Navigation Menu - Right */}
          <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="text-white hover:text-blue-200 transition-colors font-medium whitespace-nowrap flex items-center gap-1"
              >
                Lapor Barang
                <svg 
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href="/barangs/lapor-hilang"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Barang Hilang
                  </Link>
                  <Link
                    href="/barangs/lapor-temuan"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Barang Temuan
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/riwayat-laporan"
              className="text-white hover:text-blue-200 transition-colors font-medium whitespace-nowrap"
            >
              Riwayat Laporan
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/90">
                  {user.name || user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-white hover:text-blue-200 transition-colors font-medium whitespace-nowrap"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-white hover:text-blue-200 transition-colors font-medium whitespace-nowrap"
              >
                Akun
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 hover:bg-blue-800 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-blue-700 pt-4">
            <nav className="flex flex-col gap-3">
              <div>
                <div className="text-white/70 font-medium py-2 text-sm">
                  Lapor Barang
                </div>
                <Link
                  href="/barangs/lapor-hilang"
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-blue-200 transition-colors font-medium py-2 pl-4 block"
                >
                  Barang Hilang
                </Link>
                <Link
                  href="/barangs/lapor-temuan"
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-blue-200 transition-colors font-medium py-2 pl-4 block"
                >
                  Barang Temuan
                </Link>
              </div>
              <Link
                href="/riwayat-laporan"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-blue-200 transition-colors font-medium py-2"
              >
                Riwayat Laporan
              </Link>
              {user ? (
                <>
                  <span className="text-sm text-white/90 py-2">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="text-white hover:text-blue-200 transition-colors font-medium text-left py-2"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-blue-200 transition-colors font-medium py-2"
                >
                  Akun
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

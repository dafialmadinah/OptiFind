"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function PublicNavbar() {
    const router = useRouter();
    const { user, signOut: authSignOut } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/barangs-list?q=${encodeURIComponent(
                searchQuery
            )}`;
        }
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
                        <div className="px-2 flex items-center justify-center">
                            <Image
                                src="/assets/logo_optifind.png"
                                alt="Logo"
                                width={120}
                                height={30}
                            />
                        </div>
                    </Link>

                    {/* Search Bar - Center */}
                    <div className="flex-1 max-w-2xl mx-4">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari barang"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
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
                        <Link
                            href="/barangs/lapor-hilang"
                            className="text-white hover:text-blue-200 transition-colors font-medium whitespace-nowrap"
                        >
                            Lapor Barang
                        </Link>
                        <Link
                            href="/riwayat-laporan"
                            className="text-white hover:text-blue-200 transition-colors font-medium whitespace-nowrap"
                        >
                            Riwayat Laporan
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-white/90">
                                    {user.user_metadata?.name || user.email}
                                </span>
                                <button
                                    onClick={async () => {
                                        await authSignOut();
                                        router.push("/");
                                    }}
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
                                d={
                                    menuOpen
                                        ? "M6 18L18 6M6 6l12 12"
                                        : "M4 6h16M4 12h16M4 18h16"
                                }
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-blue-700 pt-4">
                        <nav className="flex flex-col gap-3">
                            <Link
                                href="/barangs/lapor-hilang"
                                onClick={() => setMenuOpen(false)}
                                className="text-white hover:text-blue-200 transition-colors font-medium py-2"
                            >
                                Lapor Barang
                            </Link>
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
                                        {user.user_metadata?.name || user.email}
                                    </span>
                                    <button
                                        onClick={async () => {
                                            setMenuOpen(false);
                                            await authSignOut();
                                            router.push("/");
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

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function PublicNavbar() {
    const router = useRouter();
    const { user, signOut: authSignOut } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/cari?q=${encodeURIComponent(
                searchQuery
            )}`;
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setProfileDropdownOpen(false);
        await authSignOut();
        router.push("/");
    };

    return (
        <header className="bg-[#1e3a8a] text-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link
                        href={user ? "/barangs" : "/"}
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
                                <Image
                                    src="/assets/cari.svg"
                                    alt="Search"
                                    width={18}
                                    height={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 opacity-50"
                                />
                                <input
                                    type="text"
                                    placeholder="Cari barang"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 pl-10 pr-12 rounded-lg text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                                    aria-label="Profile menu"
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
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.user_metadata?.name || "User"}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            Keluar
                                        </button>
                                    </div>
                                )}
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
                                    <div className="py-2 border-t border-blue-700 mt-2">
                                        <p className="text-sm font-medium text-white">
                                            {user.user_metadata?.name || "User"}
                                        </p>
                                        <p className="text-xs text-white/70 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            setMenuOpen(false);
                                            await authSignOut();
                                            router.push("/");
                                        }}
                                        className="text-red-500 hover:text-blue-200 transition-colors font-medium text-left py-2 flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
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
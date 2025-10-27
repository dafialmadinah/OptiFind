"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";

export default function NotFound() {
    const [mounted, setMounted] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const supabase = createSupabaseClient();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogoutAndRedirect = async () => {
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Error logging out:", error);
            // Still redirect even if logout fails
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-500 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 with Logo */}
                <div
                    className={`mb-8 transition-all duration-1000 ${
                        mounted
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-75"
                    }`}
                >
                    <div className="relative flex items-center justify-center gap-4 mb-6">
                        {/* 4 */}
                        <span className="text-9xl font-bold text-white drop-shadow-2xl">
                            4
                        </span>
                        
                        {/* Logo sebagai "0" */}
                        <div className="relative w-32 h-32">
                            <Image
                                src="/assets/logo.svg"
                                alt="OptiFind Logo"
                                fill
                                className="object-contain drop-shadow-2xl animate-pulse"
                                priority
                            />
                        </div>
                        
                        {/* 4 */}
                        <span className="text-9xl font-bold text-white drop-shadow-2xl">
                            4
                        </span>
                    </div>
                </div>

                {/* Error Message */}
                <div
                    className={`mb-8 transition-all duration-1000 delay-300 ${
                        mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Halaman Tidak Ditemukan
                    </h1>
                    <p className="text-lg text-gray-200 mb-2">
                        Ups! Sepertinya halaman yang Anda cari telah hilang
                    </p>
                    <p className="text-base text-gray-300">
                        Jangan khawatir, kami akan membantu Anda menemukannya kembali
                    </p>
                </div>

                {/* Suggestions */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 transition-all duration-1000 delay-500 ${
                        mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <Link
                        href="/"
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-6 border border-white/20 transition-all group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                            🏠
                        </div>
                        <h3 className="text-white font-semibold mb-2">
                            Beranda
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Kembali ke halaman utama
                        </p>
                    </Link>
                    
                    <Link
                        href="/cari"
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-6 border border-white/20 transition-all group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                            🔍
                        </div>
                        <h3 className="text-white font-semibold mb-2">
                            Cari Barang
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Temukan barang hilang Anda
                        </p>
                    </Link>
                    
                    <Link
                        href="/barangs/lapor-hilang"
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-6 border border-white/20 transition-all group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                            📢
                        </div>
                        <h3 className="text-white font-semibold mb-2">
                            Lapor Hilang
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Laporkan barang yang hilang
                        </p>
                    </Link>
                    
                    <Link
                        href="/barangs/lapor-temuan"
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-6 border border-white/20 transition-all group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                            ✨
                        </div>
                        <h3 className="text-white font-semibold mb-2">
                            Lapor Temuan
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Laporkan barang yang ditemukan
                        </p>
                    </Link>
                </div>

                {/* Main Action Button */}
                <div
                    className={`transition-all duration-1000 delay-700 ${
                        mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <button
                        onClick={handleLogoutAndRedirect}
                        disabled={isLoggingOut}
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                        {isLoggingOut ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Logging out...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-5 h-5"
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
                                Logout & Kembali ke Beranda
                            </>
                        )}
                    </button>
                </div>

                {/* Footer Note */}
                <div
                    className={`mt-12 transition-all duration-1000 delay-1000 ${
                        mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <p className="text-gray-400 text-sm">
                        Jika Anda yakin halaman ini seharusnya ada, hubungi tim kami
                    </p>
                </div>
            </div>
        </div>
    );
}

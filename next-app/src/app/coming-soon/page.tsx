"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ComingSoonPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Logo with Animation */}
                <div
                    className={`mb-8 transition-all duration-1000 ${
                        mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-10"
                    }`}
                >
                    <div className="relative w-48 h-48 mx-auto mb-6">
                        <Image
                            src="/assets/logo.svg"
                            alt="OptiFind Logo"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
                        OptiFind
                    </h1>
                </div>

                {/* Coming Soon Text */}
                <div
                    className={`mb-8 transition-all duration-1000 delay-300 ${
                        mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-4">
                        Segera Hadir!
                    </h2>
                    <p className="text-lg md:text-xl text-gray-200 mb-2">
                        Fitur Tukar Poin Sedang Dalam Pengembangan
                    </p>
                    <p className="text-base text-gray-300">
                        Sistem reward yang menarik untuk Anda yang membantu mengembalikan barang hilang
                    </p>
                </div>

                {/* Features Preview */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 transition-all duration-1000 delay-500 ${
                        mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="text-4xl mb-3">🎁</div>
                        <h3 className="text-white font-semibold mb-2">
                            Kumpulkan Poin
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Dapatkan poin setiap kali membantu mengembalikan barang
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="text-4xl mb-3">💰</div>
                        <h3 className="text-white font-semibold mb-2">
                            Tukar Hadiah
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Tukarkan poin dengan uang atau hadiah menarik
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="text-4xl mb-3">🏆</div>
                        <h3 className="text-white font-semibold mb-2">
                            Peringkat
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Lihat peringkat pengguna dengan poin terbanyak
                        </p>
                    </div>
                </div>

                {/* Back Button */}
                <div
                    className={`transition-all duration-1000 delay-700 ${
                        mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <Link
                        href="/barangs"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    >
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
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                </div>

                {/* Notification */}
                <div
                    className={`mt-12 transition-all duration-1000 delay-1000 ${
                        mounted
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <p className="text-gray-400 text-sm">
                        Nantikan pembaruan lebih lanjut! 🚀
                    </p>
                </div>
            </div>
        </div>
    );
}

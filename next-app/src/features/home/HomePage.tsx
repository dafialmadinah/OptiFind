"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import { CategoryCard } from "@/components/category-card";
import { BannerCard } from "@/components/banner-card";

dayjs.extend(relativeTime);
dayjs.locale("id");

const categories = [
    { id: 1, name: "Dompet", icon: "/assets/dompet.svg" },
    { id: 2, name: "Kunci", icon: "/assets/kunci.svg" },
    { id: 3, name: "Aksesoris", icon: "/assets/aksesoris.svg" },
    { id: 4, name: "Smartphone", icon: "/assets/smartphone.svg" },
    { id: 5, name: "Elektronik", icon: "/assets/elektronik.svg" },
    { id: 6, name: "Botol", icon: "/assets/botol minum.svg" },
    { id: 7, name: "Alat Tulis", icon: "/assets/alat tulis.svg" },
    { id: 8, name: "Pakaian", icon: "/assets/pakaian.svg" },
    { id: 9, name: "Dokumen", icon: "/assets/dokumen.svg" },
    { id: 10, name: "Lainnya", icon: "/assets/lainnya.svg" },
];

interface Barang {
    id: number;
    nama: string;
    lokasi: string | null;
    foto: string | null;
    createdAt: string;
}

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [barangTemuan, setBarangTemuan] = useState<Barang[]>([]);
    const [barangHilang, setBarangHilang] = useState<Barang[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBarangs();
    }, []);

    const fetchBarangs = async () => {
        try {
            setLoading(true);

            // Fetch barang temuan
            const temuanRes = await fetch("/api/barangs?tipe=temuan");
            const temuanData = await temuanRes.json();
            setBarangTemuan(temuanData.data.slice(0, 6));

            // Fetch barang hilang
            const hilangRes = await fetch("/api/barangs?tipe=hilang");
            const hilangData = await hilangRes.json();
            setBarangHilang(hilangData.data.slice(0, 6));
        } catch (error) {
            console.error("Error fetching barangs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/barangs-list?q=${encodeURIComponent(
                searchQuery
            )}`;
        }
    };

    const BarangCard = ({ barang }: { barang: Barang }) => (
        <Link href={`/barangs/${barang.id}`}>
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    <Image
                        src={barang.foto || "/assets/no_image.png"}
                        alt={barang.nama}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-3">
                    <h3
                        className="font-semibold text-sm text-gray-800 mb-1 truncate"
                        title={barang.nama}
                    >
                        {barang.nama}
                    </h3>
                    {barang.lokasi && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                            <Image
                                src="/assets/lokasi_abu.svg"
                                alt=""
                                width={12}
                                height={12}
                            />
                            <span className="truncate">{barang.lokasi}</span>
                        </p>
                    )}
                    <p className="text-xs text-gray-400">
                        {dayjs(barang.createdAt).fromNow()}
                    </p>
                </div>
            </div>
        </Link>
    );

    const SkeletonCard = () => (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-[#1e3a8a] text-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link
                            href="/dashboard"
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
                            <Link
                                href="/dashboard"
                                className="text-white hover:text-blue-200 transition-colors font-medium whitespace-nowrap"
                            >
                                Akun
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
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
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Banner Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    <BannerCard
                        title="Kehilangan barang?"
                        subtitle="Temukan atau laporkan dengan mudah!"
                        buttonText="Lapor Sekarang"
                        buttonLink="/barangs/lapor-hilang"
                        backgroundImage="/assets/banner_hilang.png"
                        variant="blue"
                    />
                    <BannerCard
                        title="Tukar poin menjadi uang!"
                        subtitle="Kembalikan barang milik orang lain dan raih poin"
                        buttonText="Tukarkan Poin"
                        buttonLink="/barangs/lapor-temuan"
                        backgroundImage="/assets/banner_poin.png"
                        variant="orange"
                    />
                </div>

                {/* Kategori Barang */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Kategori Barang
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                id={category.id}
                                name={category.name}
                                icon={category.icon}
                            />
                        ))}
                    </div>
                </section>

                {/* Barang Temuan Terbaru */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Barang Temuan Terbaru
                        </h2>
                        <Link
                            href="/barangs-list?tipe=temuan"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            Lihat Semua →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))
                        ) : barangTemuan.length > 0 ? (
                            barangTemuan.map((barang) => (
                                <BarangCard key={barang.id} barang={barang} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                Belum ada barang temuan
                            </div>
                        )}
                    </div>
                </section>

                {/* Barang Hilang Terbaru */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Barang Hilang Terbaru
                        </h2>
                        <Link
                            href="/barangs-list?tipe=hilang"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            Lihat Semua →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))
                        ) : barangHilang.length > 0 ? (
                            barangHilang.map((barang) => (
                                <BarangCard key={barang.id} barang={barang} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                Belum ada barang hilang
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

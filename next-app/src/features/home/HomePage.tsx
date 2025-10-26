"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import { CategoryCard } from "@/components/category-card";
import { BannerCard } from "@/components/banner-card";
import { getBarangOverview, type BarangWithRelations, type Kategori } from "@/lib/barang-service";

dayjs.extend(relativeTime);
dayjs.locale("id");

// Icon mapping for categories (fallback to default icon if not found)
const categoryIcons: Record<string, string> = {
    "Dompet": "/assets/dompet.svg",
    "Kunci": "/assets/kunci.svg",
    "Aksesoris": "/assets/aksesoris.svg",
    "Smartphone": "/assets/smartphone.svg",
    "Elektronik": "/assets/elektronik.svg",
    "Botol": "/assets/botol minum.svg",
    "Alat Tulis": "/assets/alat tulis.svg",
    "Pakaian": "/assets/pakaian.svg",
    "Dokumen": "/assets/dokumen.svg",
    "Lainnya": "/assets/lainnya.svg",
};

const getCategoryIcon = (categoryName: string): string => {
    return categoryIcons[categoryName] || "/assets/lainnya.svg";
};

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [barangTemuan, setBarangTemuan] = useState<BarangWithRelations[]>([]);
    const [barangHilang, setBarangHilang] = useState<BarangWithRelations[]>([]);
    const [kategoris, setKategoris] = useState<Kategori[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const overview = await getBarangOverview();
            
            setBarangTemuan(overview.barangTemuan);
            setBarangHilang(overview.barangHilang);
            setKategoris(overview.kategoris);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/cari?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    const BarangCard = ({ barang }: { barang: BarangWithRelations }) => (
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
                        {loading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2" />
                                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
                                </div>
                            ))
                        ) : (
                            kategoris.slice(0, 10).map((kategori) => (
                                <CategoryCard
                                    key={kategori.id}
                                    id={kategori.id}
                                    name={kategori.nama}
                                    icon={getCategoryIcon(kategori.nama)}
                                />
                            ))
                        )}
                    </div>
                </section>

                {/* Barang Temuan Terbaru */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Barang Temuan Terbaru
                        </h2>
                        <Link
                            href="/cari?tipe=temuan"
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
                            href="/cari?tipe=hilang"
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

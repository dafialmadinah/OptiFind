"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BarangCard } from "@/components/barang/barang-card";
import { BarangFilter } from "@/components/barang-filter";
import Skeleton from "@/components/skeleton";
import {
    searchBarangs,
    getAllKategoris,
    type Kategori,
    type BarangWithRelations,
} from "@/lib/barang-service";

interface FilterState {
    kategori: number[];
    waktu: string;
    lokasi: string;
    urutkan: string;
}

const tipeTabs = [
    { label: "Temuan", value: "temuan" },
    { label: "Hilang", value: "hilang" },
];

function CariContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") ?? "";
    const tipe = searchParams.get("tipe") ?? "temuan";
    const kategoriParam = searchParams.get("kategori");

    const [barangs, setBarangs] = useState<BarangWithRelations[]>([]);
    const [filteredBarangs, setFilteredBarangs] = useState<
        BarangWithRelations[]
    >([]);
    const [filters, setFilters] = useState<FilterState>({
        kategori: kategoriParam ? [Number(kategoriParam)] : [],
        waktu: "",
        lokasi: "",
        urutkan: "",
    });
    const [kategoris, setKategoris] = useState<Kategori[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [query, tipe, kategoriParam]);

    useEffect(() => {
        if (kategoriParam) {
            setFilters((prev) => ({
                ...prev,
                kategori: [Number(kategoriParam)],
            }));
        }
    }, [kategoriParam]);

    useEffect(() => {
        applyFilters();
    }, [barangs, filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const kategoriParams = kategoriParam ? [Number(kategoriParam)] : [];
            const [barangRes, kategoriRes] = await Promise.all([
                searchBarangs({ q: query, tipe, kategori: kategoriParams }),
                getAllKategoris(),
            ]);

            setBarangs(barangRes || []);
            setKategoris(kategoriRes || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setBarangs([]);
        } finally {
            setLoading(false);
        }
    };

    const getSearchTitle = () => {
        if (kategoriParam) {
            const kategori = kategoris.find(
                (k) => k.id === Number(kategoriParam)
            );
            return kategori ? `${kategori.nama}` : "Semua barang";
        }
        return query ? `"${query}"` : "Semua barang";
    };

    const applyFilters = () => {
        let filtered = [...barangs];

        if (filters.kategori.length > 0) {
            filtered = filtered.filter((barang) =>
                filters.kategori.includes(barang?.kategoriId || 0)
            );
        }

        if (filters.lokasi) {
            filtered = filtered.filter((barang) =>
                barang.lokasi
                    ?.toLowerCase()
                    .includes(filters.lokasi.toLowerCase())
            );
        }

        if (filters.waktu) {
            const now = new Date();
            filtered = filtered.filter((barang) => {
                const createdDate = new Date(barang.createdAt ?? "");
                switch (filters.waktu) {
                    case "Hari ini":
                        return (
                            createdDate.toDateString() === now.toDateString()
                        );
                    case "Minggu ini":
                        const weekAgo = new Date(
                            now.getTime() - 7 * 24 * 60 * 60 * 1000
                        );
                        return createdDate >= weekAgo;
                    case "Bulan ini":
                        return (
                            createdDate.getMonth() === now.getMonth() &&
                            createdDate.getFullYear() === now.getFullYear()
                        );
                    default:
                        return true;
                }
            });
        }

        if (filters.urutkan) {
            filtered = [...filtered].sort((a, b) => {
                switch (filters.urutkan) {
                    case "Terbaru":
                        return (
                            new Date(b.createdAt ?? "").getTime() -
                            new Date(a.createdAt ?? "").getTime()
                        );
                    case "Terlama":
                        return (
                            new Date(a.createdAt ?? "").getTime() -
                            new Date(b.createdAt ?? "").getTime()
                        );
                    case "Nama (A-Z)":
                        return a.nama.localeCompare(b.nama);
                    case "Nama (Z-A)":
                        return b.nama.localeCompare(a.nama);
                    default:
                        return 0;
                }
            });
        }

        setFilteredBarangs(filtered);
    };

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams();
        params.set("tipe", value);
        if (query) params.set("q", query);
        if (kategoriParam) params.set("kategori", kategoriParam);
        router.push(`/cari?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Filter */}
                    <div className="lg:col-span-1">
                        {loading ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 animate-pulse">
                                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="h-8 w-full bg-gray-200 rounded"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <BarangFilter
                                onFilterChange={handleFilterChange}
                                initialFilters={filters}
                            />
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="flex border-b border-gray-200">
                                {tipeTabs.map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() =>
                                            handleTabChange(tab.value)
                                        }
                                        className={`flex-1 px-6 py-3 text-center font-semibold transition-colors ${
                                            tipe === tab.value
                                                ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 🔽 Hasil Cari Ditaruh di Bawah Tabs */}
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 mb-2">
                                Hasil cari untuk:{" "}
                                <span className="text-blue-800">
                                    {getSearchTitle()}
                                </span>
                            </h1>
                        </div>

                        {/* Grid Barang */}
                        {loading ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div
                                            key={i}
                                            className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
                                        >
                                            <div className="aspect-square bg-gray-200"></div>
                                            <div className="p-4 space-y-2">
                                                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                                                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : filteredBarangs.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <Image
                                    src="/assets/no_image.png"
                                    alt="No data"
                                    width={120}
                                    height={120}
                                    className="mx-auto opacity-50 mb-4"
                                />
                                <p className="text-gray-600">
                                    Tidak ada hasil untuk pencarian ini.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredBarangs.map((barang) => (
                                    <BarangCard
                                        key={barang.id}
                                        barang={barang}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CariPage() {
    return (
        <Suspense fallback={<Skeleton />}>
            <CariContent />
        </Suspense>
    );
}

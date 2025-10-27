"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import Link from "next/link";
import { BarangFilter } from "@/components/barang-filter";
import { BarangListCard } from "@/components/barang/barang-list-card";
import { BarangRiwayatCard } from "@/components/barang/barang-riwayat-card";
import type { BarangWithRelations } from "@/lib/barang-service";

interface FilterState {
    kategori: number[];
    waktu: string;
    lokasi: string;
    urutkan: string;
}

export default function RiwayatLaporanPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<"temuan" | "hilang">("temuan");
    const [barangs, setBarangs] = useState<BarangWithRelations[]>([]);
    const [filteredBarangs, setFilteredBarangs] = useState<
        BarangWithRelations[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        kategori: [],
        waktu: "",
        lokasi: "",
        urutkan: "",
    });
    const [kategoris, setKategoris] = useState<{ id: number; nama: string }[]>([]);

    const isAuthenticated = !!user;

    useEffect(() => {
        if (!authLoading) {
            if (isAuthenticated) {
                fetchBarangs();
                fetchKategoris();
            } else {
                setLoading(false);
            }
        }
    }, [isAuthenticated, authLoading]);

    useEffect(() => {
        applyFilters();
    }, [barangs, filters, activeTab]);

    const fetchKategoris = async () => {
        try {
            const response = await fetch("/api/kategoris");
            if (response.ok) {
                const { data } = await response.json();
                setKategoris(data || []);
            }
        } catch (error) {
            console.error("Failed to fetch kategoris:", error);
        }
    };

    const fetchBarangs = async () => {
        try {
            // Add myBarangs=true to fetch only user's barangs
            const response = await fetch("/api/barangs?myBarangs=true");

            if (!response.ok) {
                throw new Error("Failed to fetch barangs");
            }

            const data = await response.json();
            console.log(data.data);
            setBarangs(data.data || []);
        } catch (error) {
            console.error("Error fetching barangs:", error);
            // Don't redirect on error, just show empty state
            setBarangs([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = barangs.filter(
            (barang) => barang?.tipe?.toLowerCase() === activeTab
        );

        // Filter by kategori - gunakan kategoriId langsung
        if (filters.kategori.length > 0) {
            filtered = filtered.filter(
                (barang) =>
                    barang.kategoriId &&
                    filters.kategori.includes(barang.kategoriId)
            );
        }

        // Filter by lokasi
        if (filters.lokasi) {
            filtered = filtered.filter((barang) =>
                barang.lokasi
                    ?.toLowerCase()
                    .includes(filters.lokasi.toLowerCase())
            );
        }

        // Filter by waktu
        if (filters.waktu) {
            const now = new Date();
            filtered = filtered.filter((barang) => {
                const createdDate = new Date(barang.createdAt);
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

        // Sort
        if (filters.urutkan) {
            filtered = [...filtered].sort((a, b) => {
                switch (filters.urutkan) {
                    case "Terbaru":
                        return (
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        );
                    case "Terlama":
                        return (
                            new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime()
                        );
                    case "Nama (A-Z)":
                        return a.nama.localeCompare(b.nama);
                    case "Nama (Z-A)":
                        return b.nama.localeCompare(a.nama);
                    case "Lokasi (A-Z)":
                        return (a.lokasi || "").localeCompare(b.lokasi || "");
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

    const handleEditLaporan = (id: number) => {
        router.push(`/barangs/${id}/edit`);
    };

    function handleStatusById(statusId: number) {
        switch (statusId) {
            case 1:
                return "Belum Dikembalikan";
            case 2:
                return "Belum Ditemukan";
            case 3:
                return "Sudah Dikembalikan";
            case 4:
                return "Sudah Ditemukan";
            default:
                return "Status tidak dikenal";
        }
    }

    const isSelesai = (status: string) => {
        return (
            status.toLowerCase() === "sudah ditemukan" ||
            status.toLowerCase() === "sudah dikembalikan"
        );
    };

    const getKategoriNames = () => {
        if (filters.kategori.length === 0) return "Semua Kategori";
        const names = filters.kategori
            .map(id => kategoris.find(k => k.id === id)?.nama)
            .filter(Boolean);
        return names.length > 0 ? names.join(", ") : "Semua Kategori";
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                        Riwayat Laporan
                    </h1>
                    <p className="text-lg text-gray-700">
                        Hasil untuk:{" "}
                        <span className="text-blue-800 font-semibold">{getKategoriNames()}</span>
                    </p>
                </div>

                {/* Not Authenticated State */}
                {!isAuthenticated ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Image
                            src="/assets/logo.svg"
                            alt="Login Required"
                            width={120}
                            height={120}
                            className="mx-auto opacity-50 mb-6"
                        />
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Login Diperlukan
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Silakan login terlebih dahulu untuk melihat riwayat
                            laporan Anda
                        </p>
                        <Link
                            href="/login"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                        >
                            Login Sekarang
                        </Link>
                    </div>
                ) : (
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
                                    <button
                                        onClick={() => setActiveTab("temuan")}
                                        className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                                            activeTab === "temuan"
                                                ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                    >
                                        Temuan
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("hilang")}
                                        className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                                            activeTab === "hilang"
                                                ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                    >
                                        Hilang
                                    </button>
                                </div>
                            </div>

                            {/* Barang List */}
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                                                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                                    <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="h-10 w-24 bg-gray-200 rounded"></div>
                                                    <div className="h-10 w-24 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                        Belum ada laporan{" "}
                                        {activeTab === "temuan"
                                            ? "barang temuan"
                                            : "barang hilang"}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredBarangs.map((barang) =>
                                        barang.statusId &&
                                        isSelesai(handleStatusById(barang.statusId)) ? (
                                            <BarangRiwayatCard
                                                key={barang.id}
                                                id={barang.id}
                                                nama={barang.nama}
                                                foto={barang.foto}
                                                lokasi={barang.lokasi}
                                                status={handleStatusById(barang.statusId)}
                                                createdAt={barang.createdAt}
                                                onEditLaporan={() =>
                                                    handleEditLaporan(barang.id)
                                                }
                                            />
                                        ) : (
                                            barang.statusId && (
                                                <BarangListCard
                                                    key={barang.id}
                                                    id={barang.id}
                                                    nama={barang.nama}
                                                    foto={barang.foto}
                                                    lokasi={barang.lokasi}
                                                    status={handleStatusById(
                                                        barang.statusId ?? 1
                                                    )}
                                                    createdAt={barang.createdAt}
                                                    showEditButton={true}
                                                    onEdit={() =>
                                                        handleEditLaporan(
                                                            barang.id
                                                        )
                                                    }
                                                />
                                            )
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

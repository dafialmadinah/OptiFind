"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BarangCard } from "@/components/barang/barang-card";
import { BarangFilter } from "@/components/barang-filter";
import {
    searchBarangs,
    getAllKategoris,
    type Kategori,
    type BarangWithRelations,
} from "@/lib/barang-service";

// Filter state
interface FilterState {
    kategori: number[];
    waktu: string;
    lokasi: string;
    urutkan: string;
}

const tipeTabs = [
    { label: "Temuan", value: "Temuan" },
    { label: "Hilang", value: "Hilang" },
];

export default function CariPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") ?? "";
    const tipe = searchParams.get("tipe") ?? "Temuan";

    // ✅ ubah ke BarangWithRelations
    const [barangs, setBarangs] = useState<BarangWithRelations[]>([]);
    const [filteredBarangs, setFilteredBarangs] = useState<
        BarangWithRelations[]
    >([]);
    const [filters, setFilters] = useState<FilterState>({
        kategori: [],
        waktu: "",
        lokasi: "",
        urutkan: "",
    });
    const [kategoris, setKategoris] = useState<Kategori[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [query, tipe]);

    useEffect(() => {
        applyFilters();
    }, [barangs, filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const kategoriParam = searchParams
                .getAll("kategori")
                .map((k) => Number(k));
            const [barangRes, kategoriRes] = await Promise.all([
                searchBarangs({ q: query, tipe, kategori: kategoriParam }),
                getAllKategoris(),
            ]);

            // ✅ hasil dari backend sudah BarangWithRelations
            setBarangs(barangRes || []);
            setKategoris(kategoriRes || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setBarangs([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...barangs];

        // Filter kategori
        if (filters.kategori.length > 0) {
            filtered = filtered.filter((barang) =>
                filters.kategori.includes(barang.kategori.id)
            );
        }

        // Filter lokasi
        if (filters.lokasi) {
            filtered = filtered.filter((barang) =>
                barang.lokasi
                    ?.toLowerCase()
                    .includes(filters.lokasi.toLowerCase())
            );
        }

        // Filter waktu
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

        // Urutkan
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
        router.push(`/cari?tipe=${value}&q=${query}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                        Hasil cari untuk:{" "}
                        <span className="text-blue-800">
                            {query ? `"${query}"` : "Semua barang"}
                        </span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <BarangFilter onFilterChange={handleFilterChange} />
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="flex border-b border-gray-200">
                                {tipeTabs.map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() =>
                                            handleTabChange(tab.value)
                                        }
                                        className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
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

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">
                                    Memuat data...
                                </p>
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

"use client";

import { useState, useEffect } from "react";
import CustomRadioGroup from "@/components/ui/radiobutton";

interface FilterProps {
    onFilterChange?: (filters: FilterState) => void;
    initialFilters?: FilterState;
}

interface FilterState {
    kategori: number[];
    waktu: string;
    lokasi: string;
    urutkan: string;
}

const categories = [
    { id: 1, name: "Dompet" },
    { id: 2, name: "Kunci" },
    { id: 3, name: "Aksesoris" },
    { id: 4, name: "Smartphone" },
    { id: 5, name: "Elektronik" },
    { id: 6, name: "Botol Minum" },
    { id: 7, name: "Alat Tulis" },
    { id: 8, name: "Pakaian" },
    { id: 9, name: "Dokumen" },
    { id: 10, name: "Lainnya" },
];

export function BarangFilter({ onFilterChange, initialFilters }: FilterProps) {
    const [expandedSections, setExpandedSections] = useState({
        kategori: true,
        waktu: false,
        lokasi: false,
        urutkan: false,
    });

    const [filters, setFilters] = useState<FilterState>(
        initialFilters || {
            kategori: [],
            waktu: "",
            lokasi: "",
            urutkan: "",
        }
    );

    useEffect(() => {
        if (initialFilters) setFilters(initialFilters);
    }, [initialFilters]);

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleKategoriChange = (categoryId: number) => {
        const newKategori = filters.kategori.includes(categoryId)
            ? filters.kategori.filter((id) => id !== categoryId)
            : [...filters.kategori, categoryId];

        const newFilters = { ...filters, kategori: newKategori };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const handleRadioChange = (field: keyof FilterState, value: string) => {
        const newFilters = {
            ...filters,
            [field]: value,
        };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-sm">
            {/* === KATEGORI === */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection("kategori")}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50"
                >
                    <span className="font-semibold text-gray-800 text-base">
                        Kategori
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-600 transition-transform ${
                            expandedSections.kategori ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {expandedSections.kategori && (
                    <div className="px-5 pb-3 space-y-2">
                        {categories.map((category) => (
                            <label
                                key={category.id}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.kategori.includes(
                                        category.id
                                    )}
                                    onChange={() =>
                                        handleKategoriChange(category.id)
                                    }
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                                />
                                <span className="text-gray-700 group-hover:text-gray-900">
                                    {category.name}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* === WAKTU === */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection("waktu")}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50"
                >
                    <span className="font-semibold text-gray-800 text-base">
                        Waktu
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-600 transition-transform ${
                            expandedSections.waktu ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {expandedSections.waktu && (
                    <div className="px-5 pb-3">
                        <CustomRadioGroup
                            label=""
                            options={[
                                "Hari ini",
                                "Minggu ini",
                                "Bulan ini",
                                "Semua waktu",
                            ]}
                            selectedValue={filters.waktu}
                            onChange={(value) =>
                                handleRadioChange("waktu", value)
                            }
                        />
                    </div>
                )}
            </div>

            {/* === LOKASI === */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection("lokasi")}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50"
                >
                    <span className="font-semibold text-gray-800 text-base">
                        Lokasi
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-600 transition-transform ${
                            expandedSections.lokasi ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {expandedSections.lokasi && (
                    <div className="px-5 pb-3">
                        <CustomRadioGroup
                            label=""
                            options={[
                                "Kampus",
                                "Kantin",
                                "Perpustakaan",
                                "Cafe",
                                "Masjid",
                                "Pasar",
                                "Mall",
                                "Lapangan",
                                "Parkiran",
                            ]}
                            selectedValue={filters.lokasi}
                            onChange={(value) =>
                                handleRadioChange("lokasi", value)
                            }
                        />
                    </div>
                )}
            </div>

            {/* === URUTKAN === */}
            <div>
                <button
                    onClick={() => toggleSection("urutkan")}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50"
                >
                    <span className="font-semibold text-gray-800 text-base">
                        Urutkan
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-600 transition-transform ${
                            expandedSections.urutkan ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {expandedSections.urutkan && (
                    <div className="px-5 pb-3">
                        <CustomRadioGroup
                            label=""
                            options={[
                                "Terbaru",
                                "Terlama",
                                "Nama (A-Z)",
                                "Nama (Z-A)",
                                "Lokasi (A-Z)",
                            ]}
                            selectedValue={filters.urutkan}
                            onChange={(value) =>
                                handleRadioChange("urutkan", value)
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

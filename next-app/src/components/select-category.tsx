"use client";

import { useState, useRef, useEffect } from "react";

export interface Kategori {
    id: number;
    nama: string;
}

interface SelectCategoryProps {
    label?: string;
    kategoris: Kategori[];
    value: number;
    onChange: (id: number) => void;
    disabled?: boolean;
    isLoading?: boolean;
}

export default function SelectCategory({
    label = "Kategori",
    kategoris,
    value,
    onChange,
    disabled = false,
    isLoading = false,
}: SelectCategoryProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = kategoris.find((k) => k.id === value);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative font-poppins" ref={containerRef}>
            {label && (
                <label className="block font-semibold text-[16px] text-black mb-1">
                    {label}
                </label>
            )}

            {/* Tombol utama */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                className={`w-full flex justify-between items-center rounded-[10px] border px-4 py-2 text-[15px] text-[#1e1e1e] transition 
          ${
              disabled
                  ? "opacity-50 cursor-not-allowed bg-gray-100"
                  : "cursor-pointer"
          } 
          ${open ? "border-blue-400" : "border-[#b0b0b0]"}`}
            >
                <span
                    className={`truncate ${!selected ? "text-gray-400" : ""}`}
                >
                    {isLoading
                        ? "Memuat kategori..."
                        : selected
                        ? selected.nama
                        : "Pilih kategori"}
                </span>

                <svg
                    className={`h-4 w-4 ml-2 text-gray-600 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Dropdown menu */}
            {open && (
                <div
                    className="absolute z-10 mt-1 w-full rounded-[10px] border border-[#b0b0b0] bg-white shadow-md max-h-56 overflow-y-auto overscroll-contain"
                    onWheel={(e) => e.stopPropagation()} // <– ini penting agar halaman tidak ikut scroll
                >
                    {isLoading ? (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                            Memuat kategori...
                        </div>
                    ) : kategoris.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                            Tidak ada kategori
                        </div>
                    ) : (
                        kategoris.map((kat) => (
                            <button
                                key={kat.id}
                                type="button"
                                onClick={() => {
                                    onChange(kat.id);
                                    setOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-[15px] hover:bg-blue-50 transition ${
                                    value === kat.id
                                        ? "bg-blue-100 font-semibold text-blue-700"
                                        : "text-[#1e1e1e]"
                                }`}
                            >
                                {kat.nama}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

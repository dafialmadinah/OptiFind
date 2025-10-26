'use client';

import { useState } from 'react';

interface FilterProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  kategori: number[];
  waktu: string;
  lokasi: string;
  urutkan: string;
}

const categories = [
  { id: 1, name: 'Dompet' },
  { id: 2, name: 'Kunci' },
  { id: 3, name: 'Aksesoris' },
  { id: 4, name: 'Smartphone' },
  { id: 5, name: 'Elektronik' },
  { id: 6, name: 'Botol Minum' },
  { id: 7, name: 'Alat Tulis' },
  { id: 8, name: 'Pakaian' },
  { id: 9, name: 'Dokumen' },
  { id: 10, name: 'Lainnya' },
];

export function BarangFilter({ onFilterChange }: FilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    kategori: true,
    waktu: false,
    lokasi: false,
    urutkan: false,
  });

  const [filters, setFilters] = useState<FilterState>({
    kategori: [],
    waktu: '',
    lokasi: '',
    urutkan: '',
  });

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

  const handleWaktuChange = (waktu: string) => {
    const newFilters = { ...filters, waktu };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleLokasiChange = (lokasi: string) => {
    const newFilters = { ...filters, lokasi };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleUrutkanChange = (urutkan: string) => {
    const newFilters = { ...filters, urutkan };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Kategori Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('kategori')}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800 text-lg">Kategori</span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${
              expandedSections.kategori ? 'rotate-180' : ''
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
          <div className="px-6 py-4 space-y-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.kategori.includes(category.id)}
                  onChange={() => handleKategoriChange(category.id)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-gray-900">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Waktu Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('waktu')}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800 text-lg">Waktu</span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${
              expandedSections.waktu ? 'rotate-180' : ''
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
          <div className="px-6 py-4 space-y-3">
            {['Hari ini', 'Minggu ini', 'Bulan ini', 'Semua waktu'].map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="waktu"
                  checked={filters.waktu === option}
                  onChange={() => handleWaktuChange(option)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-gray-900">
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Lokasi Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('lokasi')}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800 text-lg">Lokasi</span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${
              expandedSections.lokasi ? 'rotate-180' : ''
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
          <div className="px-6 py-4 space-y-3">
            {[
              'Gedung A',
              'Gedung B',
              'Gedung C',
              'Perpustakaan',
              'Kantin',
              'Lapangan',
              'Parkiran',
              'Lainnya',
            ].map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="lokasi"
                  checked={filters.lokasi === option}
                  onChange={() => handleLokasiChange(option)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-gray-900">
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Urutkan Section */}
      <div>
        <button
          onClick={() => toggleSection('urutkan')}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800 text-lg">Urutkan</span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${
              expandedSections.urutkan ? 'rotate-180' : ''
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
          <div className="px-6 py-4 space-y-3">
            {[
              'Terbaru',
              'Terlama',
              'Nama (A-Z)',
              'Nama (Z-A)',
              'Lokasi (A-Z)',
            ].map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="urutkan"
                  checked={filters.urutkan === option}
                  onChange={() => handleUrutkanChange(option)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-gray-900">
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BarangFilter } from '@/components/barang-filter';
import { BarangListCard } from '@/components/barang/barang-list-card';
import { BarangRiwayatCard } from '@/components/barang/barang-riwayat-card';

interface Barang {
  id: number;
  nama: string;
  foto: string | null;
  lokasi: string | null;
  status: { id: number; nama: string };
  tipe: { id: number; nama: string };
  kategori: { id: number; nama: string };
  createdAt: string;
  pelapor?: { id: number; name: string } | null;
}

interface FilterState {
  kategori: number[];
  waktu: string;
  lokasi: string;
  urutkan: string;
}

export default function RiwayatLaporanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'temuan' | 'hilang'>('temuan');
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [filteredBarangs, setFilteredBarangs] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    kategori: [],
    waktu: '',
    lokasi: '',
    urutkan: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBarangs();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [barangs, filters, activeTab]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const fetchBarangs = async () => {
    try {
      // Try to get token, but don't require it for public view
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('/api/barangs', {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch barangs');
      }

      const data = await response.json();
      setBarangs(data.data || []);
    } catch (error) {
      console.error('Error fetching barangs:', error);
      // Don't redirect on error, just show empty state
      setBarangs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = barangs.filter((barang) => 
      barang.tipe.nama.toLowerCase() === activeTab
    );

    // Filter by kategori
    if (filters.kategori.length > 0) {
      filtered = filtered.filter((barang) =>
        filters.kategori.includes(barang.kategori.id)
      );
    }

    // Filter by lokasi
    if (filters.lokasi) {
      filtered = filtered.filter((barang) =>
        barang.lokasi?.toLowerCase().includes(filters.lokasi.toLowerCase())
      );
    }

    // Filter by waktu
    if (filters.waktu) {
      const now = new Date();
      filtered = filtered.filter((barang) => {
        const createdDate = new Date(barang.createdAt);
        switch (filters.waktu) {
          case 'Hari ini':
            return createdDate.toDateString() === now.toDateString();
          case 'Minggu ini':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return createdDate >= weekAgo;
          case 'Bulan ini':
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
          case 'Terbaru':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'Terlama':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'Nama (A-Z)':
            return a.nama.localeCompare(b.nama);
          case 'Nama (Z-A)':
            return b.nama.localeCompare(a.nama);
          case 'Lokasi (A-Z)':
            return (a.lokasi || '').localeCompare(b.lokasi || '');
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

  const isSelesai = (status: string) => {
    return status.toLowerCase() === 'selesai' || status.toLowerCase() === 'sudah dikembalikan';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Laporan</h1>
          <p className="text-gray-600">Kelola semua laporan barang hilang dan temuan Anda</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Login Diperlukan</h2>
            <p className="text-gray-600 mb-6">
              Silakan login terlebih dahulu untuk melihat riwayat laporan Anda
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
            <BarangFilter onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('temuan')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                    activeTab === 'temuan'
                      ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Temuan
                </button>
                <button
                  onClick={() => setActiveTab('hilang')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                    activeTab === 'hilang'
                      ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Hilang
                </button>
              </div>
            </div>

            {/* Barang List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Memuat data...</p>
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
                  Belum ada laporan {activeTab === 'temuan' ? 'barang temuan' : 'barang hilang'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBarangs.map((barang) =>
                  isSelesai(barang.status.nama) ? (
                    <BarangRiwayatCard
                      key={barang.id}
                      id={barang.id}
                      nama={barang.nama}
                      foto={barang.foto}
                      lokasi={barang.lokasi}
                      status={barang.status.nama}
                      createdAt={barang.createdAt}
                      onEditLaporan={() => handleEditLaporan(barang.id)}
                    />
                  ) : (
                    <BarangListCard
                      key={barang.id}
                      id={barang.id}
                      nama={barang.nama}
                      foto={barang.foto}
                      lokasi={barang.lokasi}
                      status={barang.status.nama}
                      createdAt={barang.createdAt}
                      showEditButton={true}
                      onEdit={() => handleEditLaporan(barang.id)}
                    />
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

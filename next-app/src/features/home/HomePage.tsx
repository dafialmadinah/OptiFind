'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

dayjs.extend(relativeTime);
dayjs.locale('id');

const categories = [
  { id: 1, name: 'Dompet', icon: '/assets/dompet.svg' },
  { id: 2, name: 'Kunci', icon: '/assets/kunci.svg' },
  { id: 3, name: 'Jam', icon: '/assets/jam.svg' },
  { id: 4, name: 'Smartphone', icon: '/assets/smartphone.svg' },
  { id: 5, name: 'Elektronik', icon: '/assets/elektronik.svg' },
  { id: 6, name: 'Botol Minum', icon: '/assets/botol minum.svg' },
  { id: 7, name: 'Alat Tulis', icon: '/assets/alat tulis.svg' },
  { id: 8, name: 'Pakaian', icon: '/assets/pakaian.svg' },
  { id: 9, name: 'Dokumen', icon: '/assets/dokumen.svg' },
  { id: 10, name: 'Lainnya', icon: '/assets/lainnya.svg' },
];

interface Barang {
  id: number;
  nama: string;
  lokasi: string | null;
  foto: string | null;
  createdAt: string;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
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
      const temuanRes = await fetch('/api/barangs?tipe=temuan');
      const temuanData = await temuanRes.json();
      setBarangTemuan(temuanData.data.slice(0, 6));

      // Fetch barang hilang
      const hilangRes = await fetch('/api/barangs?tipe=hilang');
      const hilangData = await hilangRes.json();
      setBarangHilang(hilangData.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching barangs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/barangs?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const BarangCard = ({ barang }: { barang: Barang }) => (
    <Link href={`/barangs/${barang.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
        <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
          <Image
            src={barang.foto || '/assets/no_image.png'}
            alt={barang.nama}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-800 mb-1 truncate" title={barang.nama}>
            {barang.nama}
          </h3>
          {barang.lokasi && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <Image src="/assets/lokasi_abu.svg" alt="" width={12} height={12} />
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
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-full p-2">
                <Image
                  src="/assets/logo_kecil.svg"
                  alt="Found It!"
                  width={32}
                  height={32}
                />
              </div>
              <span className="text-xl font-bold">Found It!</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/barangs" className="hover:text-blue-200 transition-colors">
                Lapor Barang
              </Link>
              <Link href="/barangs" className="hover:text-blue-200 transition-colors">
                Riwayat Laporan
              </Link>
              <Link href="/login" className="hover:text-blue-200 transition-colors">
                Akun
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari barang"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Image
                  src="/assets/cari.svg"
                  alt="Search"
                  width={20}
                  height={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Banner Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Banner 1 - Kehilangan Barang */}
          <Link href="/barangs/lapor-hilang">
            <div className="relative bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="p-8 relative z-10">
                <h2 className="text-white text-2xl font-bold mb-2">
                  Kehilangan<br />barang?
                </h2>
                <p className="text-blue-100 text-sm mb-4">
                  Temukan atau laporkan<br />dengan mudah!
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Lapor Sekarang
                </button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-90 group-hover:scale-110 transition-transform">
                <Image
                  src="/assets/banner_hilang.png"
                  alt="Lapor Barang Hilang"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </Link>

          {/* Banner 2 - Tukar Poin */}
          <Link href="/barangs/lapor-temuan">
            <div className="relative bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="p-8 relative z-10">
                <h2 className="text-white text-2xl font-bold mb-2">
                  Tukar poin<br />menjadi uang!
                </h2>
                <p className="text-orange-100 text-sm mb-4">
                  Kembalikan barang milik<br />orang lain dan raih poin
                </p>
                <button className="bg-blue-900 hover:bg-blue-950 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Tukarkan Poin
                </button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-90 group-hover:scale-110 transition-transform">
                <Image
                  src="/assets/banner_poin.png"
                  alt="Tukar Poin"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Kategori Barang */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Kategori Barang</h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/barangs?kategori=${category.id}`}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-xs text-center text-gray-700 font-medium">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Barang Temuan Terbaru */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Barang Temuan Terbaru</h2>
            <Link
              href="/barangs?tipe=temuan"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : barangTemuan.length > 0 ? (
              barangTemuan.map((barang) => <BarangCard key={barang.id} barang={barang} />)
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
            <h2 className="text-2xl font-bold text-gray-800">Barang Hilang Terbaru</h2>
            <Link
              href="/barangs?tipe=hilang"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : barangHilang.length > 0 ? (
              barangHilang.map((barang) => <BarangCard key={barang.id} barang={barang} />)
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

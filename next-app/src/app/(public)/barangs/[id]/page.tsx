'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/id';

dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.locale('id');

type Props = {
  params: { id: string };
};

interface Barang {
  id: number;
  nama: string;
  foto: string | null;
  kategori: { id: number; nama: string };
  status: { id: number; nama: string };
  tipe: { id: number; nama: string };
  waktu: string | null;
  lokasi: string | null;
  deskripsi: string | null;
  kontak: string | null;
  pelapor: { id: number; name: string } | null;
  createdAt: string;
}

function resolveImageSrc(foto: string | null) {
  if (!foto) return "/assets/no_image.png";
  if (foto.startsWith("http://") || foto.startsWith("https://")) return foto;
  if (foto.startsWith("/")) return foto;
  return "/assets/no_image.png";
}

export default function BarangDetailPage({ params }: Props) {
  const router = useRouter();
  const [barang, setBarang] = useState<Barang | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarang();
  }, [params.id]);

  const fetchBarang = async () => {
    try {
      const response = await fetch(`/api/barangs/${params.id}`);
      if (!response.ok) {
        router.push('/barangs');
        return;
      }
      const data = await response.json();
      setBarang(data.data);
    } catch (error) {
      console.error('Error fetching barang:', error);
      router.push('/barangs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail barang...</p>
        </div>
      </div>
    );
  }

  if (!barang) {
    return null;
  }

  const imageSrc = resolveImageSrc(barang.foto);
  const waktuDitemukan = barang.waktu 
    ? dayjs(barang.waktu).format("dddd, DD-MM-YYYY")
    : "-";
  const waktuDilaporkan = dayjs(barang.createdAt).format("HH.mm");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'belum dikembalikan':
      case 'hilang':
        return 'bg-red-100 text-red-700';
      case 'sudah dikembalikan':
      case 'selesai':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="aspect-square lg:aspect-auto lg:h-full relative bg-gray-100">
              <Image
                src={imageSrc}
                alt={barang.nama}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Contact Button - Desktop */}
            {barang.kontak && (
              <div className="hidden lg:block absolute bottom-0 left-0 right-0 p-6">
                <Link
                  href={`https://wa.me/${barang.kontak.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl text-center transition-colors shadow-lg"
                >
                  Hubungi Pelapor
                </Link>
              </div>
            )}
          </div>

          {/* Right Side - Details */}
          <div className="p-6 lg:p-8 space-y-6 lg:overflow-y-auto lg:max-h-[calc(100vh-4rem)]">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {barang.nama}
              </h1>
              <p className="text-sm text-gray-500">{barang.tipe.nama}</p>
            </div>

            {/* Kategori */}
            <div className="flex items-center gap-3">
              <Image 
                src="/assets/kategori.svg" 
                alt="Kategori" 
                width={24} 
                height={24}
                className="text-gray-600"
              />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Kategori</p>
                <p className="text-base text-gray-800">{barang.kategori.nama}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <Image 
                src="/assets/status.svg" 
                alt="Status" 
                width={24} 
                height={24}
              />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(barang.status.nama)}`}>
                  {barang.status.nama}
                </span>
              </div>
            </div>

            {/* Waktu Ditemukan */}
            <div className="flex items-center gap-3">
              <Image 
                src="/assets/tanggal.svg" 
                alt="Waktu" 
                width={24} 
                height={24}
              />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Waktu Ditemukan</p>
                <p className="text-base text-gray-800">{waktuDitemukan}</p>
                <p className="text-sm text-gray-600">Dilaporkan pada {waktuDilaporkan}</p>
              </div>
            </div>

            {/* Lokasi Ditemukan */}
            <div className="flex items-center gap-3">
              <Image 
                src="/assets/lokasi_abu.svg" 
                alt="Lokasi" 
                width={24} 
                height={24}
              />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Lokasi Ditemukan</p>
                <p className="text-base text-gray-800">{barang.lokasi || "-"}</p>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="flex items-start gap-3">
              <Image 
                src="/assets/deskripsi.svg" 
                alt="Deskripsi" 
                width={24} 
                height={24}
                className="mt-1"
              />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Deskripsi</p>
                <p className="text-base text-gray-800 leading-relaxed">
                  {barang.deskripsi || "Tidak ada deskripsi."}
                </p>
              </div>
            </div>

            {/* Kontak Pelapor */}
            <div className="border-t pt-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Kontak Pelapor</h2>
              
              <div className="flex items-center gap-3">
                <Image 
                  src="/assets/nama_pelapor.svg" 
                  alt="Nama" 
                  width={24} 
                  height={24}
                />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Nama Pelapor</p>
                  <p className="text-base text-gray-800">{barang.pelapor?.name || "Anonim"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Image 
                  src="/assets/kontak_pelapor.svg" 
                  alt="Kontak" 
                  width={24} 
                  height={24}
                />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Nomor Telepon</p>
                  <p className="text-base text-gray-800">{barang.kontak || "-"}</p>
                </div>
              </div>
            </div>

            {/* Contact Button - Mobile */}
            {barang.kontak && (
              <div className="lg:hidden pt-4">
                <Link
                  href={`https://wa.me/${barang.kontak.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl text-center transition-colors"
                >
                  Hubungi Pelapor
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

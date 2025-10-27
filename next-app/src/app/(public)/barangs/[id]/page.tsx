"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.locale("id");

type Props = {
    params: { id: string };
};

interface Barang {
    id: number;
    nama: string;
    foto: string | null;
    kategori: { id: number; nama: string };
    status: { id: number; nama: string };
    tipe: string; // "hilang" or "temuan"
    waktu: string | null;
    lokasi: string | null;
    deskripsi: string | null;
    kontak: string | null;
    pelapor: { id: string; name: string } | null; // UUID
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

    // const fetchBarang = async () => {
    //   try {
    //     const response = await fetch(`/api/barangs/${params.id}`);
    //     if (!response.ok) {
    //       router.push('/barangs');
    //       return;
    //     }
    //     const data = await response.json();
    //     setBarang(data.data);
    //   } catch (error) {
    //     console.error('Error fetching barang:', error);
    //     router.push('/barangs');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const fetchBarang = async () => {
        try {
            // 🧠 Barang dummy (bisa kamu ubah sesuka hati)
            const dummyBarang: Barang = {
                id: 1,
                nama: "Kunci Motor Honda",
                foto: "/assets/kunci.svg",
                kategori: { id: 2, nama: "Aksesoris & Kunci" },
                status: { id: 1, nama: "Belum dikembalikan" },
                tipe: "temuan", // Changed to string
                waktu: "2025-10-20T10:00:00Z",
                lokasi: "Parkiran Teknik UB",
                deskripsi:
                    "Kunci motor ditemukan di area parkiran dekat gedung utama. Ada gantungan warna merah.",
                kontak: "085123456789",
                pelapor: { id: "550e8400-e29b-41d4-a716-446655440000", name: "Rhesa Tsaqif" }, // UUID
                createdAt: "2025-10-21T08:30:00Z",
            };

            // ⏳ Simulasikan delay seperti request sungguhan
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setBarang(dummyBarang);
        } catch (error) {
            console.error("Error fetching dummy barang:", error);
            router.push("/barangs");
        } finally {
            setLoading(false);
        }
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Image Skeleton */}
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>

              {/* Info Skeleton */}
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                
                <div className="space-y-3 pt-4">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="space-y-2 pt-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse mt-6"></div>
              </div>
            </div>
          </div>
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
            case "belum dikembalikan":
            case "hilang":
                return "bg-red-100 text-red-700";
            case "sudah dikembalikan":
            case "selesai":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Left Side - Image & Button */}
                    <div className="flex flex-col items-center justify-start p-6">
                        <div className="w-full bg-gray-100 rounded-xl overflow-hidden">
                            <div className="relative w-full aspect-[1/1]">
                                <Image
                                    src={imageSrc}
                                    alt={barang.nama}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Contact Button */}
                        {barang.kontak && (
                            <div className="w-full mt-6">
                                <Link
                                    href={`https://wa.me/${barang.kontak.replace(
                                        /[^0-9]/g,
                                        ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl text-center transition-colors shadow-md"
                                >
                                    Hubungi Pelapor
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Detail Barang (kanan) */}
                    <div className="p-4 space-y-6">
                        {/* Judul */}
                        <div>
                            <h1 className="text-2xl font-bold text-blue-900 mb-2">
                                {barang.nama}
                            </h1>
                            <p className="text-lg font-semibold text-gray-500">
                                {barang.tipe.charAt(0).toUpperCase() + barang.tipe.slice(1)}
                            </p>
                        </div>

                        {/* Kategori */}
                        <div className="flex items-center gap-6">
                            <Image
                                src="/assets/kategori.svg"
                                alt="Kategori"
                                width={24}
                                height={24}
                            />
                            <div>
                                <p className="text-md font-semibold">
                                    Kategori
                                </p>
                                <p className="text-base text-gray-800 mt-2">
                                    {barang.kategori.nama}
                                </p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-6">
                            <Image
                                src="/assets/status.svg"
                                alt="Status"
                                width={24}
                                height={24}
                            />
                            <div>
                                <p className="text-md font-semibold">Status</p>
                                <p className="text-base text-gray-800 mt-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                            barang.status.nama
                                        )}`}
                                    >
                                        {barang.status.nama}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Waktu Ditemukan */}
                        <div className="flex items-center gap-6">
                            <Image
                                src="/assets/tanggal.svg"
                                alt="Waktu"
                                width={24}
                                height={24}
                            />
                            <div>
                                <p className="text-md font-semibold">
                                    Waktu Ditemukan
                                </p>
                                <p className="text-base text-gray-800 mt-2">
                                    {waktuDitemukan}
                                </p>
                                <p className="text-base text-gray-800 mt-2">
                                    Dilaporkan pada {waktuDilaporkan}
                                </p>
                            </div>
                        </div>

                        {/* Lokasi */}
                        <div className="flex items-center gap-6">
                            <Image
                                src="/assets/lokasi_abu.svg"
                                alt="Lokasi"
                                width={24}
                                height={24}
                            />
                            <div>
                                <p className="text-md font-semibold">
                                    Lokasi Ditemukan
                                </p>
                                <p className="text-base text-gray-800 mt-2">
                                    {barang.lokasi || "-"}
                                </p>
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="flex items-start gap-6">
                            <Image
                                src="/assets/deskripsi.svg"
                                alt="Deskripsi"
                                width={24}
                                height={24}
                                className="mt-1"
                            />
                            <div>
                                <p className="text-md font-semibold mb-2">
                                    Deskripsi
                                </p>
                                <p className="text-base text-gray-800 leading-relaxed">
                                    {barang.deskripsi || "Tidak ada deskripsi."}
                                </p>
                            </div>
                        </div>

                        {/* Kontak Pelapor */}
                        <div className="border-t pt-6 space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Kontak Pelapor
                            </h2>

                            <div className="flex items-center gap-6">
                                <Image
                                    src="/assets/nama_pelapor.svg"
                                    alt="Nama"
                                    width={24}
                                    height={24}
                                />
                                <div>
                                    <p className="text-md font-semibold">
                                        Nama Pelapor
                                    </p>
                                    <p className="text-base text-gray-800 mt-2">
                                        {barang.pelapor?.name || "Anonim"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <Image
                                    src="/assets/kontak_pelapor.svg"
                                    alt="Kontak"
                                    width={24}
                                    height={24}
                                />
                                <div>
                                    <p className="text-md font-semibold">
                                        Nomor Telepon
                                    </p>
                                    <p className="text-base text-gray-800 mt-2">
                                        {barang.kontak || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Kontak (Mobile) */}
                        {barang.kontak && (
                            <div className="lg:hidden pt-4">
                                <Link
                                    href={`https://wa.me/${barang.kontak.replace(
                                        /[^0-9]/g,
                                        ""
                                    )}`}
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

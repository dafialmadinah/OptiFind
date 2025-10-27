"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/skeleton";
import { useAuth } from "@/lib/auth-context";
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
    status?: { id: number; nama: string } | null;
    kategoriId: number;
    statusId?: number | null;
    tipe: string; // "hilang" or "temuan"
    waktu: string | null;
    lokasi: string | null;
    deskripsi: string | null;
    kontak: string | null;
    pelapor: { id: string; name: string } | null;
    createdAt: string;
}

// Helper untuk handle statusId jika status null
const convertStatusIdToString = (statusId: number | null | undefined) => {
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
};

const getKategoriNama = (
    kategori: { id: number; nama: string } | null,
    kategoriId?: number
) => {
    if (kategori?.nama) return kategori.nama;

    // fallback jika kategori null, bisa disesuaikan dengan mapping ID ke nama
    const kategoriMapping: Record<number, string> = {
        1: "Dompet",
        2: "Kunci",
        3: "Aksesoris",
        4: "Smartphone",
        5: "Elektronik",
        6: "Botol Minum",
        7: "Alat Tulis",
        8: "Pakaian",
        9: "Dokumen",
        10: "Lainnya",
    };

    if (kategoriId && kategoriMapping[kategoriId])
        return kategoriMapping[kategoriId];

    return "Kategori tidak dikenal";
};

function resolveImageSrc(foto: string | null) {
    if (!foto) return "/assets/no_image.png";
    if (foto.startsWith("http://") || foto.startsWith("https://")) return foto;
    if (foto.startsWith("/")) return foto;
    return "/assets/no_image.png";
}

export default function BarangDetailPage({ params }: Props) {
    const router = useRouter();
    const { user } = useAuth();
    const [barang, setBarang] = useState<Barang | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBarang();
    }, [params.id]);

    const fetchBarang = async () => {
        try {
            const res = await fetch(`/api/barangs/${params.id}`);
            if (!res.ok) {
                router.push("/barangs");
                return;
            }
            const data = await res.json();
            setBarang(data);
        } catch (error) {
            console.error("Error fetching barang:", error);
            router.push("/barangs");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Skeleton />;
    }

    if (!barang) return null;

    const imageSrc = resolveImageSrc(barang.foto);
    const statusText = barang.status
        ? barang.status.nama
        : convertStatusIdToString(barang.statusId);

    // Check if status is "selesai" (3 or 4)
    const isStatusSelesai = barang.statusId === 3 || barang.statusId === 4;

    const waktuDitemukan = barang.waktu
        ? dayjs(barang.waktu).format("dddd, DD-MM-YYYY")
        : "-";
    const waktuDilaporkan = dayjs(barang.createdAt).format("HH.mm");

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "belum dikembalikan":
            case "belum ditemukan":
                return "bg-red-100 text-red-700";
            case "sudah dikembalikan":
            case "sudah ditemukan":
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
                        {barang.kontak && (
                            <div className="w-full mt-6">
                                {user?.id === barang.pelapor?.id ? (
                                    <Link
                                        href={`/barangs/${barang.id}/edit`}
                                        className="block w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl text-center transition-colors shadow-md"
                                    >
                                        Edit Laporan
                                    </Link>
                                ) : isStatusSelesai ? (
                                    <button
                                        disabled
                                        className="block w-full bg-gray-300 text-gray-500 font-semibold py-3 rounded-xl text-center cursor-not-allowed shadow-md"
                                        title="Barang sudah selesai, tidak bisa dihubungi"
                                    >
                                        Hubungi Pelapor
                                    </button>
                                ) : (
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
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Side - Info */}
                    <div className="p-4 space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-blue-900 mb-2">
                                {barang.nama}
                            </h1>
                            <p className="text-lg font-semibold text-gray-500">
                                {barang.tipe.charAt(0).toUpperCase() +
                                    barang.tipe.slice(1)}
                            </p>
                        </div>

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
                                    {getKategoriNama(
                                        barang.kategori,
                                        barang.kategoriId
                                    )}
                                </p>
                            </div>
                        </div>

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
                                            statusText
                                        )}`}
                                    >
                                        {statusText}
                                    </span>
                                </p>
                            </div>
                        </div>

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

                        {barang.kontak && (
                            <div className="lg:hidden pt-4">
                                {user?.id === barang.pelapor?.id ? (
                                    <Link
                                        href={`/barangs/${barang.id}/edit`}
                                        className="block w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 rounded-xl text-center transition-colors"
                                    >
                                        Edit Laporan
                                    </Link>
                                ) : isStatusSelesai ? (
                                    <button
                                        disabled
                                        className="block w-full bg-gray-300 text-gray-500 font-semibold py-4 rounded-xl text-center cursor-not-allowed"
                                        title="Barang sudah selesai, tidak bisa dihubungi"
                                    >
                                        Hubungi Pelapor
                                    </button>
                                ) : (
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
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

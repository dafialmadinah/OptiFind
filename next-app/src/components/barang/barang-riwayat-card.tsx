"use client";

import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

interface BarangRiwayatCardProps {
    id: number;
    nama: string;
    foto: string | null;
    lokasi: string | null;
    status: string;
    waktu?: string | null;
    onEditLaporan?: () => void;
}

export function BarangRiwayatCard({
    id,
    nama,
    foto,
    lokasi,
    status,
    waktu,
    onEditLaporan,
}: BarangRiwayatCardProps) {
    // handle foto fallback
    const imageSrc =
        foto && (foto.startsWith("http") || foto.startsWith("/"))
            ? foto
            : "/assets/no_image.png";

    // format waktu (fallback jika null)
    const formattedDate = waktu
        ? dayjs(waktu).format("DD/MM/YYYY - HH:mm")
        : "Waktu tidak tersedia";

    // deteksi status selesai
    const isSelesai =
        status.toLowerCase().includes("sudah") ||
        status.toLowerCase().includes("selesai");

    const statusColor = isSelesai ? "text-[#193a6f]" : "text-[#c64a3e]";

    return (
        <div className="relative">
            {/* Overlay agar card bisa diklik */}
            <Link href={`/barangs/${id}`} className="absolute inset-0 z-0" />

            {/* Card utama */}
            <div className="w-full bg-white rounded-[15px] border border-gray-200 flex sm:flex-row p-4 gap-4 sm:gap-6 items-start sm:items-center box-border overflow-hidden relative z-10 pointer-events-none">
                {/* Gambar */}
                <div className="w-[90px] sm:w-[130px] rounded-[15px] overflow-hidden shrink-0">
                    <div className="w-full aspect-[1/1]">
                        <Image
                            src={imageSrc}
                            alt={nama}
                            width={130}
                            height={130}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </div>

                {/* Info Barang */}
                <div className="flex flex-col flex-1 min-w-0 gap-1 sm:gap-2 justify-center">
                    <h3 className="text-[#193a6f] text-[15px] sm:text-[18px] font-semibold leading-tight truncate">
                        {nama ?? "-"}
                    </h3>

                    {lokasi && (
                        <div className="flex items-center text-[13px] sm:text-[16px] text-[#6f6f6f] gap-1.5 sm:gap-2">
                            <Image
                                src="/assets/lokasi_merah.svg"
                                alt="Lokasi"
                                width={22}
                                height={22}
                                className="w-[18px] sm:w-[22px] h-[18px] sm:h-[22px]"
                            />
                            <span className="truncate">{lokasi}</span>
                        </div>
                    )}

                    {/* tampilkan waktu */}
                    <div className="flex items-center text-[13px] sm:text-[16px] text-[#5d5d5d] gap-1.5 sm:gap-2">
                        <Image
                            src="/assets/tanggal.svg"
                            alt="Tanggal"
                            width={21}
                            height={21}
                            className="w-[17px] sm:w-[21px] h-[17px] sm:h-[21px]"
                        />
                        <span>{formattedDate}</span>
                    </div>

                    {/* Mobile only */}
                    {!isSelesai ? (
                        <div className="flex items-center justify-between gap-2 sm:hidden mt-1">
                            <p
                                className={`text-[13px] font-semibold ${statusColor}`}
                            >
                                {status}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onEditLaporan?.();
                                }}
                                className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-[10px] bg-[#193a6f] text-white text-[13px] font-medium whitespace-nowrap pointer-events-auto z-20"
                            >
                                <Image
                                    src="/assets/edit.svg"
                                    alt="Edit"
                                    width={18}
                                    height={18}
                                />
                            </button>
                        </div>
                    ) : (
                        <p
                            className={`text-[13px] font-semibold ${statusColor} sm:hidden`}
                        >
                            {status}
                        </p>
                    )}
                </div>

                {/* Desktop only */}
                <div className="hidden sm:flex flex-col items-end justify-between gap-4 shrink-0">
                    <p className={`text-[18px] font-semibold ${statusColor}`}>
                        {status}
                    </p>

                    {!isSelesai && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onEditLaporan?.();
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#193a6f] text-white text-[16px] font-medium pointer-events-auto z-20"
                        >
                            <Image
                                src="/assets/edit.svg"
                                alt="Edit"
                                width={20}
                                height={20}
                            />
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

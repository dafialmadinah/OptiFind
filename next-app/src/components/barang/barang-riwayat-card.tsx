'use client';

import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface BarangRiwayatCardProps {
  id: number;
  nama: string;
  foto: string | null;
  lokasi: string | null;
  status: string;
  createdAt: string;
  onEditLaporan?: () => void;
}

export function BarangRiwayatCard({
  id,
  nama,
  foto,
  lokasi,
  status,
  createdAt,
  onEditLaporan,
}: BarangRiwayatCardProps) {
  const imageSrc = foto && (foto.startsWith('http') || foto.startsWith('/'))
    ? foto
    : '/assets/no_image.png';

  const formattedDate = dayjs(createdAt).format('DD/MM/YYYY - HH:mm');

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'selesai':
      case 'sudah dikembalikan':
        return 'text-blue-700';
      case 'belum dikembalikan':
      case 'hilang':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-4 p-5">
        {/* Image */}
        <Link href={`/barangs/${id}`} className="flex-shrink-0">
          <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={imageSrc}
              alt={nama}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Link href={`/barangs/${id}`}>
            <h3 className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors mb-3 line-clamp-2">
              {nama}
            </h3>
          </Link>

          <div className="space-y-2 mb-4">
            {lokasi && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Image
                  src="/assets/lokasi_abu.svg"
                  alt="Lokasi"
                  width={18}
                  height={18}
                  className="flex-shrink-0"
                />
                <span className="line-clamp-1">{lokasi}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Image
                src="/assets/tanggal.svg"
                alt="Tanggal"
                width={18}
                height={18}
                className="flex-shrink-0"
              />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className={`text-base font-semibold ${getStatusColor()}`}>
              {status}
            </span>

            <button
              onClick={(e) => {
                e.preventDefault();
                onEditLaporan?.();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Image
                src="/assets/edit.svg"
                alt="Edit"
                width={18}
                height={18}
              />
              <span>Edit Laporan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

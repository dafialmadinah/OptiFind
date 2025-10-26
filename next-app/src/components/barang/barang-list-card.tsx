'use client';

import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

dayjs.extend(relativeTime);
dayjs.locale('id');

interface BarangListCardProps {
  id: number;
  nama: string;
  foto: string | null;
  lokasi: string | null;
  status: string;
  createdAt: string;
  showEditButton?: boolean;
  onEdit?: () => void;
}

export function BarangListCard({
  id,
  nama,
  foto,
  lokasi,
  status,
  createdAt,
  showEditButton = false,
  onEdit,
}: BarangListCardProps) {
  const imageSrc = foto && (foto.startsWith('http') || foto.startsWith('/'))
    ? foto
    : '/assets/no_image.png';

  const formattedDate = dayjs(createdAt).format('DD/MM/YYYY - HH:mm');

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'belum dikembalikan':
      case 'hilang':
        return 'text-red-600';
      case 'sudah dikembalikan':
      case 'selesai':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200">
      <div className="flex gap-4 p-4">
        {/* Image */}
        <Link href={`/barangs/${id}`} className="flex-shrink-0">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageSrc}
              alt={nama}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link href={`/barangs/${id}`}>
              <h3 className="font-semibold text-gray-900 text-base hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                {nama}
              </h3>
            </Link>

            {lokasi && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                <Image
                  src="/assets/lokasi_abu.svg"
                  alt="Lokasi"
                  width={16}
                  height={16}
                  className="flex-shrink-0"
                />
                <span className="line-clamp-1">{lokasi}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Image
                src="/assets/tanggal.svg"
                alt="Tanggal"
                width={16}
                height={16}
                className="flex-shrink-0"
              />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {status}
            </span>

            {showEditButton && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onEdit?.();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Image
                  src="/assets/edit.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

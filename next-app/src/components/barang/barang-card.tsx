import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import { BarangWithRelations } from "@/lib/barang-service";
import { dayjs } from "@/lib/dayjs";

type Props = {
  barang: BarangWithRelations;
  href?: string;
  className?: string;
};

const lokasiIcon = "/assets/lokasi_merah.svg";
const waktuIcon = "/assets/waktu.svg";
const fallbackImage = "/assets/no_image.png";

function resolveImageSrc(foto: string | null) {
  if (!foto) return fallbackImage;
  if (foto.startsWith("http://") || foto.startsWith("https://")) return foto;
  if (foto.startsWith("/")) return foto;
  return fallbackImage;
}

export function BarangCard({ barang, href = `/barangs/${barang.id}`, className }: Props) {
  const imageSrc = resolveImageSrc(barang.foto);
  const waktuLabel = barang.waktu ? dayjs(barang.waktu).fromNow() : null;

  return (
    <Link
      href={href}
      className={classNames(
        "w-full overflow-hidden rounded-[15px] bg-white shadow transition hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Image
          src={imageSrc}
          alt={barang.nama}
          fill
          className="object-cover object-center transition duration-300 hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 240px"
        />
      </div>
      <div className="space-y-2 p-3">
        <h3 className="truncate text-[14px] font-semibold text-[#193a6f] leading-snug">{barang.nama}</h3>

        {barang.lokasi && (
          <div className="flex items-center text-[12px] text-gray-600">
            <Image src={lokasiIcon} alt="Lokasi" width={16} height={16} className="mr-1 shrink-0" />
            <span className="truncate">{barang.lokasi}</span>
          </div>
        )}

        {waktuLabel && (
          <div className="flex items-center text-[12px] text-gray-600">
            <Image src={waktuIcon} alt="Waktu" width={16} height={16} className="mr-1 shrink-0" />
            <span>{waktuLabel}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { getBarangById } from "@/lib/barang-service";
import { dayjs } from "@/lib/dayjs";
import { StatusBadge } from "@/components/status-badge";

type Props = {
  params: { id: string };
};

const iconMap = {
  status: "/assets/status.svg",
  kategori: "/assets/kategori.svg",
  tipe: "/assets/riwayat.svg",
  tanggal: "/assets/tanggal.svg",
  lokasi: "/assets/lokasi_abu.svg",
  deskripsi: "/assets/deskripsi.svg",
  namaPelapor: "/assets/nama_pelapor.svg",
  kontak: "/assets/kontak_pelapor.svg",
} as const;

function resolveImageSrc(foto: string | null) {
  if (!foto) return "/assets/no_image.png";
  if (foto.startsWith("http://") || foto.startsWith("https://")) return foto;
  if (foto.startsWith("/")) return foto;
  return "/assets/no_image.png";
}

export default async function BarangDetailPage({ params }: Props) {
  const barangId = Number(params.id);
  if (Number.isNaN(barangId)) {
    notFound();
  }

  const [barang, session] = await Promise.all([
    getBarangById(barangId),
    getServerSession(authOptions),
  ]);

  if (!barang) {
    notFound();
  }

  const imageSrc = resolveImageSrc(barang.foto);
  const waktuLabel = barang.waktu ? dayjs(barang.waktu).tz("Asia/Jakarta").format("DD MMMM YYYY, HH:mm") : "-";
  const isOwner = session?.user?.id && barang.pelapor ? session.user.id === barang.pelapor.id.toString() : false;

  return (
    <div className="bg-[#f0f9ff] pt-10 pb-12 sm:pt-24">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 rounded-none bg-white shadow-md sm:rounded-[20px] sm:px-12 sm:py-10 md:flex-row md:px-[50px]">
        <div className="flex w-full flex-col gap-6 px-4 pt-16 sm:w-1/2 sm:pt-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-none sm:rounded-[20px]">
            <Image
              src={imageSrc}
              alt={barang.nama}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 90vw, 500px"
            />
          </div>

          {barang.kontak && !isOwner && (
            <Link
              href={`https://wa.me/${barang.kontak.replace(/[^0-9]/g, "")}`}
              target="_blank"
              className="hidden w-full items-center justify-center rounded-[10px] bg-[#f98125] py-3 text-sm font-semibold text-white transition hover:bg-[#e07018] lg:flex"
            >
              Hubungi Pelapor
            </Link>
          )}
        </div>

        <div className="flex-1 space-y-6 px-4 pb-10 sm:px-0">
          <header className="space-y-3">
            <h1 className="text-[24px] font-bold text-[#193a6f] sm:text-[28px]">{barang.nama}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <StatusBadge label={barang.status.nama} />
              <span className="rounded-full bg-[#193a6f]/10 px-3 py-1 text-xs font-semibold text-[#193a6f]">
                {barang.tipe.nama}
              </span>
            </div>
          </header>

          <div className="space-y-5 rounded-[20px] border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-[#193a6f]">Ringkasan Barang</h2>
            <DetailRow icon={iconMap.status} label="Status" value={barang.status.nama} />
            <DetailRow icon={iconMap.kategori} label="Kategori" value={barang.kategori.nama} />
            <DetailRow icon={iconMap.tipe} label="Jenis Laporan" value={barang.tipe.nama} />
            <DetailRow icon={iconMap.tanggal} label="Waktu Kejadian" value={waktuLabel} />
            <DetailRow icon={iconMap.lokasi} label="Lokasi" value={barang.lokasi ?? "-"} />
          </div>

          <div className="space-y-5 rounded-[20px] border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-[#193a6f]">Deskripsi</h2>
            <DetailRow icon={iconMap.deskripsi} label="Detail Barang" value={barang.deskripsi ?? "-"} />
          </div>

          <div className="space-y-5 rounded-[20px] border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-[#193a6f]">Kontak Pelapor</h2>
            <DetailRow icon={iconMap.namaPelapor} label="Nama" value={barang.pelapor?.name ?? "-"} />
            <DetailRow icon={iconMap.kontak} label="Nomor Kontak" value={barang.kontak ?? "-"} />
          </div>

          {barang.kontak && !isOwner && (
            <Link
              href={`https://wa.me/${barang.kontak.replace(/[^0-9]/g, "")}`}
              target="_blank"
              className="flex w-full items-center justify-center rounded-[10px] bg-[#f98125] py-3 text-sm font-semibold text-white transition hover:bg-[#e07018] lg:hidden"
            >
              Hubungi Pelapor
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm text-[#5d5d5d]">
      <Image src={icon} alt={label} width={24} height={24} className="mt-1 h-6 w-6" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#193a6f]">{label}</p>
        <p className="text-sm text-slate-700">{value}</p>
      </div>
    </div>
  );
}

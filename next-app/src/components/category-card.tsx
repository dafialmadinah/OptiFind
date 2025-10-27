import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
    id: number;
    name: string;
    icon: string;
}

export function CategoryCard({ id, name, icon }: CategoryCardProps) {
  return (
    <Link
      href={`/cari?kategori=${id}`}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group border border-gray-100"
    >
      <div className="w-16 h-16 flex items-center justify-center group-hover:scale-105 transition-transform">
        <Image
          src={icon}
          alt={name}
          width={56}
          height={56}
          className="object-contain h-[56px] w-auto"
        />
      </div>

            <span className="text-sm text-center text-gray-700 font-medium leading-tight">
                {name}
            </span>
        </Link>
    );
}

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
      href={`/barangs-list?kategori=${id}`}
      className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group border border-gray-100"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
        <Image
          src={icon}
          alt={name}
          width={48}
          height={48}
          className="object-contain"
        />
      </div>
      <span className="text-sm text-center text-gray-700 font-medium">
        {name}
      </span>
    </Link>
  );
}

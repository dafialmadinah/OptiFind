import clsx from "classnames";

type Props = {
  label: string;
};

const styleMap: Record<string, string> = {
  "Belum Ditemukan": "bg-red-50 text-red-600 border-red-100",
  "Belum Dikembalikan": "bg-amber-50 text-amber-600 border-amber-100",
  "Sudah Ditemukan": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Sudah Dikembalikan": "bg-sky-50 text-sky-600 border-sky-100",
};

export function StatusBadge({ label }: Props) {
  const baseClass =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium";
  const colorClass = styleMap[label] ?? "bg-slate-100 text-slate-600 border-slate-200";

  return <span className={clsx(baseClass, colorClass)}>{label}</span>;
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { uploadBarangPhoto } from "@/lib/supabase-storage";
import { useAuth } from "@/lib/auth-context";

interface Kategori {
    id: number;
    nama: string;
}

export default function EditBarangPage() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const { user, isLoading: authLoading } = useAuth();
    const [kategoris, setKategoris] = useState<Kategori[]>([]);
    const [isLoadingKategoris, setIsLoadingKategoris] = useState(true);
    const [isLoadingBarang, setIsLoadingBarang] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nama: "",
        kategori: "",
        waktu: "",
        lokasi: "",
        deskripsi: "",
        kontak: "",
        foto: null as File | null,
        fotoUrl: "",
    });

    // Fetch kategori
    useEffect(() => {
        const fetchKategoris = async () => {
            try {
                const res = await fetch("/api/kategoris");
                if (!res.ok) throw new Error("Gagal memuat kategori");
                const { data } = await res.json();
                setKategoris(data || []);
            } catch (err) {
                console.error("Error kategori:", err);
                setError("Gagal memuat kategori.");
            } finally {
                setIsLoadingKategoris(false);
            }
        };
        fetchKategoris();
    }, []);

    // Fetch data barang lama
    useEffect(() => {
        const fetchBarang = async () => {
            try {
                if (!id) return;
                const res = await fetch(`/api/barangs/${id}`);
                if (!res.ok) throw new Error("Status barang tidak ditemukan");
                const data = await res.json();

                setFormData({
                    nama: data.nama || "",
                    kategori: data.kategori || "",
                    waktu: data.waktu?.slice(0, 16) || "",
                    lokasi: data.lokasi || "",
                    deskripsi: data.deskripsi || "",
                    kontak: data.kontak || "",
                    foto: null,
                    fotoUrl: data.foto || "",
                });
            } catch (err) {
                console.error(err);
                alert("❌ Status barang tidak ditemukan.");
                router.push("/barangs");
            } finally {
                setIsLoadingBarang(false);
            }
        };
        fetchBarang();
    }, [id, router]);

    // Pastikan user login
    useEffect(() => {
        if (!authLoading && !user) {
            alert("Anda harus login terlebih dahulu.");
            router.push("/login?callbackUrl=/barangs");
        }
    }, [user, authLoading, router]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setFormData((prev) => ({ ...prev, foto: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user) {
            alert("Anda harus login terlebih dahulu.");
            router.push("/login");
            return;
        }

        setIsSubmitting(true);

        try {
            let fotoUrl = formData.fotoUrl;

            // Upload foto baru jika ada
            if (formData.foto) {
                fotoUrl = await uploadBarangPhoto(formData.foto);
            }

            const response = await fetch(`/api/barangs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama: formData.nama,
                    kategori: formData.kategori,
                    waktu: formData.waktu,
                    lokasi: formData.lokasi,
                    deskripsi: formData.deskripsi,
                    kontak: formData.kontak,
                    foto: fotoUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Gagal memperbarui barang"
                );
            }

            alert("✅ Barang berhasil diperbarui!");
            router.push("/barangs");
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat update";
            console.error(err);
            setError(message);
            alert("❌ " + message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || isLoadingBarang || isLoadingKategoris) {
        return (
            <section className="bg-[#f4f4f4] min-h-screen flex items-center justify-center font-poppins">
                <p className="text-gray-600 animate-pulse">Memuat data...</p>
            </section>
        );
    }

    return (
        <section className="bg-[#f4f4f4] pt-8 sm:pt-12 pb-12 px-4 sm:px-8 md:px-[100px] font-poppins">
            <div className="mx-auto max-w-[1232px] rounded-[20px] bg-white p-8">
                <h1 className="mb-2 text-[28px] font-bold text-[#193a6f]">
                    Edit Barang
                </h1>
                <p className="mb-4 text-[16px] text-black">
                    Perbarui informasi barang berikut agar informasi tetap
                    akurat dan memudahkan proses pencarian atau pengambilan
                    barang.
                </p>
                <hr className="mb-6 border-[#b0b0b0]" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nama Barang */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black">
                            Nama Barang
                        </label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 text-[15px] outline-none focus:border-blue-400"
                        />
                    </div>

                    {/* Kategori */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black">
                            Kategori
                        </label>
                        <select
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 text-[15px] outline-none focus:border-blue-400"
                        >
                            <option value="">Pilih kategori</option>
                            {kategoris.map((kat) => (
                                <option key={kat.id} value={kat.nama}>
                                    {kat.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Waktu */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black">
                            Waktu
                        </label>
                        <input
                            type="datetime-local"
                            name="waktu"
                            value={formData.waktu}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 text-[15px] outline-none focus:border-blue-400"
                        />
                    </div>

                    {/* Lokasi */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black">
                            Lokasi
                        </label>
                        <input
                            type="text"
                            name="lokasi"
                            value={formData.lokasi}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 text-[15px] outline-none focus:border-blue-400"
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black">
                            Deskripsi
                        </label>
                        <textarea
                            name="deskripsi"
                            rows={3}
                            value={formData.deskripsi}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 text-[15px] outline-none focus:border-blue-400"
                        ></textarea>
                    </div>

                    {/* Kontak */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black">
                            Kontak
                        </label>
                        <input
                            type="text"
                            name="kontak"
                            value={formData.kontak}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 text-[15px] outline-none focus:border-blue-400"
                        />
                    </div>

                    {/* Foto */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black">
                            Foto Barang
                        </label>
                        {formData.fotoUrl && (
                            <div className="mt-2 mb-3">
                                <img
                                    src={formData.fotoUrl}
                                    alt="Barang"
                                    className="w-32 h-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            name="foto"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 w-full cursor-pointer rounded-[10px] border border-[#b0b0b0] px-4 py-2 text-[15px] outline-none file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-1 file:text-white file:hover:bg-blue-500"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="w-full sm:max-w-sm sm:mx-auto">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-[10px] bg-[#f98125] px-6 py-2 font-bold text-white text-[16px] transition hover:bg-[#d96f1f] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

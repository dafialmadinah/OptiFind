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
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [barangTipe, setBarangTipe] = useState<string>("");
    const [currentStatusId, setCurrentStatusId] = useState<number>(1);

    const [formData, setFormData] = useState({
        nama: "",
        kategoriId: 0,
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

                setBarangTipe(data.tipe || "");
                setCurrentStatusId(data.statusId || 1);
                setFormData({
                    nama: data.nama || "",
                    kategoriId: data.kategoriId || 0,
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
        if (name === "kategoriId") {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
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
                    kategoriId: formData.kategoriId,
                    waktu: formData.waktu,
                    lokasi: formData.lokasi,
                    deskripsi: formData.deskripsi,
                    kontak: formData.kontak,
                    foto: fotoUrl,
                    // TIDAK mengirim statusId - status tidak berubah saat simpan
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Gagal memperbarui barang"
                );
            }

            alert("✅ Barang berhasil diperbarui!");
            // Tetap di halaman edit atau kembali ke riwayat
            router.push("/riwayat-laporan");
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

    const handleUpdateStatus = async (newStatusId: number, actionName: string) => {
        if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi "${actionName}"?`)) {
            return;
        }

        setIsUpdatingStatus(true);
        try {
            const response = await fetch(`/api/barangs/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ statusId: newStatusId }),
            });

            if (!response.ok) {
                throw new Error("Gagal mengubah status");
            }

            setCurrentStatusId(newStatusId);
            alert(`✅ Status berhasil diubah menjadi "${actionName}"!`);
            router.push("/riwayat-laporan");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("❌ Gagal mengubah status. Silakan coba lagi.");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleSelesai = () => {
        // Status ID: 1=Belum Dikembalikan, 2=Belum Ditemukan, 3=Sudah Dikembalikan, 4=Sudah Ditemukan
        const newStatusId = barangTipe === "temuan" ? 3 : 4;
        const actionName = barangTipe === "temuan" ? "Sudah Dikembalikan" : "Sudah Ditemukan";
        handleUpdateStatus(newStatusId, actionName);
    };

    const handleBatal = () => {
        // Reset to initial status
        const newStatusId = barangTipe === "temuan" ? 1 : 2;
        const actionName = barangTipe === "temuan" ? "Belum Dikembalikan" : "Belum Ditemukan";
        handleUpdateStatus(newStatusId, actionName);
    };

    const isSelesai = () => {
        // Status 3 = Sudah Dikembalikan, 4 = Sudah Ditemukan
        return currentStatusId === 3 || currentStatusId === 4;
    };

    if (authLoading || isLoadingBarang || isLoadingKategoris) {
        return (
            <section className="bg-[#f4f4f4] pt-8 sm:pt-12 pb-12 px-4 sm:px-8 md:px-[100px] font-poppins">
                <div className="mx-auto max-w-[1232px] rounded-[20px] bg-white p-8">
                    {/* Header Skeleton */}
                    <div className="mb-6">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <hr className="mb-6 border-[#b0b0b0]" />

                    {/* Form Skeleton */}
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        ))}
                        
                        {/* Button Skeleton */}
                        <div className="w-full sm:max-w-sm sm:mx-auto mt-8">
                            <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                    </div>

                    {/* Status Section Skeleton */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="mt-3 h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
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
                            name="kategoriId"
                            value={formData.kategoriId}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 text-[15px] outline-none focus:border-blue-400"
                        >
                            <option value={0}>Pilih kategori</option>
                            {kategoris.map((kat) => (
                                <option key={kat.id} value={kat.id}>
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

                {/* Action Buttons - Status Update */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Ubah Status Barang</h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {!isSelesai() && (
                            <button
                                onClick={handleSelesai}
                                disabled={isUpdatingStatus}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isUpdatingStatus ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    barangTipe === "temuan" ? "✓ Sudah Dikembalikan" : "✓ Sudah Ditemukan"
                                )}
                            </button>
                        )}
                        {isSelesai() && (
                            <button
                                onClick={handleBatal}
                                disabled={isUpdatingStatus}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isUpdatingStatus ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    "✕ Batalkan Status Selesai"
                                )}
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                        {!isSelesai() 
                            ? `Tandai barang sebagai "${barangTipe === "temuan" ? "Sudah Dikembalikan" : "Sudah Ditemukan"}" jika proses sudah selesai.`
                            : "Batalkan status selesai jika ada kesalahan atau barang belum benar-benar selesai."
                        }
                    </p>
                </div>
            </div>
        </section>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadBarangPhoto } from "@/lib/supabase-storage";
import { useAuth } from "@/lib/auth-context";

interface Kategori {
    id: number;
    nama: string;
}

export default function LaporTemuanPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [kategoris, setKategoris] = useState<Kategori[]>([]);
    const [isLoadingKategoris, setIsLoadingKategoris] = useState(true);
    const [formData, setFormData] = useState({
        nama: "",
        kategori: "",
        waktu: "",
        lokasi: "",
        deskripsi: "",
        kontak: "",
        foto: null as File | null,
    });
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch kategoris from API
    useEffect(() => {
        async function fetchKategoris() {
            try {
                const response = await fetch("/api/kategoris");
                if (response.ok) {
                    const { data } = await response.json();
                    setKategoris(data || []);
                }
            } catch (error) {
                console.error("Failed to fetch kategoris:", error);
            } finally {
                setIsLoadingKategoris(false);
            }
        }
        fetchKategoris();
    }, []);

    // Check if user is logged in
    useEffect(() => {
        if (!authLoading && !user) {
            alert("Anda harus login terlebih dahulu untuk melaporkan barang temuan.");
            router.push("/login?callbackUrl=/barangs/lapor-temuan");
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
        
        if (!formData.foto) {
            setError("Silakan pilih foto barang terlebih dahulu.");
            return;
        }

        setIsUploading(true);

        try {
            // Upload foto ke Supabase Storage
            const fotoUrl = await uploadBarangPhoto(formData.foto);

            // Kirim data ke API dengan URL foto (auth otomatis dari cookie)
            const response = await fetch("/api/barangs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nama: formData.nama,
                    kategori: formData.kategori,
                    waktu: formData.waktu,
                    lokasi: formData.lokasi,
                    deskripsi: formData.deskripsi,
                    kontak: formData.kontak,
                    foto: fotoUrl,
                    tipe: "temuan",
                }),
            });

            if (response.status === 401) {
                alert("Sesi Anda telah berakhir. Silakan login kembali.");
                router.push("/login");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal mengirim laporan");
            }

            const result = await response.json();
            
            // Success! Redirect to barangs page
            alert("✅ Laporan barang temuan berhasil dikirim!");
            router.push("/barangs");

            // Reset file input
            const fileInput = document.querySelector(
                'input[type="file"]'
            ) as HTMLInputElement;
            if (fileInput) fileInput.value = "";
        } catch (error) {
            console.error("Error submitting form:", error);
            const errorMessage = error instanceof Error
                ? error.message
                : "Terjadi kesalahan saat mengirim laporan";
            setError(errorMessage);
            alert("❌ " + errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    // Show loading while checking auth
    if (authLoading || isLoadingKategoris) {
        return (
            <section className="bg-[#f4f4f4] min-h-screen pt-20 sm:pt-28 md:pt-32 sm:pb-10 px-0 sm:px-4 md:px-[100px] font-poppins">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="mb-8">
                        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                        <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse mt-8"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <section className="bg-[#f4f4f4] pt-8 sm:pt-12 pb-12 px-4 sm:px-8 md:px-[100px] font-poppins">
            <div className="mx-auto max-w-[1232px] rounded-[20px] bg-white p-8">
                <h2 className="text-[28px] text-[#193a6f] font-bold mb-2">
                    Lapor Barang Temuan
                </h2>
                <p className="text-[16px] text-black mb-4">
                    Menemukan barang yang bukan milikmu? Isi formulir berikut
                    untuk membantu pemilik yang kehilangan menemukan barangnya.
                    Cantumkan detail lokasi, foto, dan ciri-ciri barang agar
                    mudah dikenali oleh pemilik.
                </p>
                <hr className="mb-6 border-[#b0b0b0]" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nama Barang */}
                    <div>
                        <label className="font-semibold text-[16px] text-black">
                            Nama Barang
                        </label>
                        <input
                            type="text"
                            name="nama"
                            placeholder="Masukkan nama barang"
                            value={formData.nama}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#b0b0b0] rounded-[10px] px-4 py-2 mt-1 outline-none focus:border-blue-400 focus:ring-0"
                        />
                    </div>

                    {/* Kategori */}
                    <div>
                        <label className="font-semibold text-[16px] text-black">
                            Kategori
                        </label>
                        <select
                            name="kategori"
                            value={formData.kategori}
                            onChange={handleChange}
                            required
                            disabled={isLoadingKategoris}
                            className="w-full border border-[#b0b0b0] rounded-[10px] px-4 py-2 mt-1 outline-none focus:border-blue-400 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {isLoadingKategoris ? "Memuat kategori..." : "Pilih kategori"}
                            </option>
                            {kategoris.map((kat) => (
                                <option key={kat.id} value={kat.nama}>
                                    {kat.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Waktu */}
                    <div>
                        <label className="font-semibold text-[16px] text-black">
                            Waktu
                        </label>
                        <input
                            type="datetime-local"
                            name="waktu"
                            value={formData.waktu}
                            onChange={handleChange}
                            onClick={(e) => e.currentTarget.showPicker?.()}
                            required
                            className="w-full border border-[#b0b0b0] rounded-[10px] px-4 py-2 mt-1 outline-none focus:border-blue-400 focus:ring-0 cursor-pointer"
                        />
                    </div>

                    {/* Lokasi */}
                    <div>
                        <label className="font-semibold text-[16px] text-black">
                            Lokasi
                        </label>
                        <input
                            type="text"
                            name="lokasi"
                            placeholder="Masukkan lokasi"
                            value={formData.lokasi}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#b0b0b0] rounded-[10px] px-4 py-2 mt-1 outline-none focus:border-blue-400 focus:ring-0"
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="font-semibold text-[16px] text-black">
                            Deskripsi
                        </label>
                        <textarea
                            name="deskripsi"
                            placeholder="Masukkan deskripsi"
                            rows={3}
                            value={formData.deskripsi}
                            onChange={handleChange}
                            className="w-full border border-[#b0b0b0] rounded-[10px] px-4 py-2 mt-1 outline-none focus:border-blue-400 focus:ring-0"
                        ></textarea>
                    </div>

                    {/* Kontak */}
                    <div>
                        <label className="font-semibold text-[16px] text-black">
                            Kontak
                        </label>
                        <input
                            type="text"
                            name="kontak"
                            placeholder="Masukkan kontak"
                            value={formData.kontak}
                            onChange={handleChange}
                            required
                            className="w-full border border-[#b0b0b0] rounded-[10px] px-4 py-2 mt-1 outline-none focus:border-blue-400 focus:ring-0"
                        />
                    </div>

                    {/* Foto Barang */}
                    <div>
                        <label className="font-semibold text-[16px] text-black">
                            Foto Barang
                        </label>
                        {formData.foto && (
                            <p className="text-sm text-green-600 mt-1 mb-2">
                                ✓ File dipilih: {formData.foto.name}
                            </p>
                        )}
                        <input
                            type="file"
                            name="foto"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="w-full border border-[#b0b0b0] rounded-[10px] px-4 py-2 mt-1 cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-1 file:text-white file:transition file:hover:bg-blue-500"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Tombol Submit */}
                    <div className="w-full sm:max-w-sm sm:mx-auto">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full bg-[#f98125] text-white px-6 py-2 rounded-[10px] font-bold transition hover:bg-[#d96f1f] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Mengirim...</span>
                                </>
                            ) : (
                                "Kirim Laporan"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

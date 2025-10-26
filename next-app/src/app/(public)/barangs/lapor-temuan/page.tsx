"use client";

import { useState } from "react";
import { uploadBarangPhoto } from "@/lib/supabase-storage";

export default function LaporTemuanPage() {
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
        
        if (!formData.foto) {
            alert("Silakan pilih foto barang terlebih dahulu.");
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
                alert("Anda harus login terlebih dahulu.");
                window.location.href = '/login';
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal mengirim laporan");
            }

            alert("Laporan berhasil dikirim!");
            
            // Reset form
            setFormData({
                nama: "",
                kategori: "",
                waktu: "",
                lokasi: "",
                deskripsi: "",
                kontak: "",
                foto: null,
            });
            
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = "";

        } catch (error) {
            console.error("Error submitting form:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat mengirim laporan"
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <section className="bg-[#f4f4f4] pt-20 sm:pt-28 md:pt-32 sm:pb-10 px-0 sm:px-4 md:px-[100px] font-poppins">
            <div className="bg-white max-w-[1232px] sm:mx-8 md:mx-auto p-8 rounded-none sm:rounded-[20px]">
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
                            className="w-full border border-[#b0b0b0] rounded-[10px] px-4 py-2 mt-1 outline-none focus:border-blue-400 focus:ring-0"
                        >
                            <option value="">Pilih kategori</option>
                            <option value="Dompet">Dompet</option>
                            <option value="Kunci">Kunci</option>
                            <option value="Aksesoris">Aksesoris</option>
                            <option value="Smartphone">Smartphone</option>
                            <option value="Elektronik">Elektronik</option>
                            <option value="Botol Minum">Botol Minum</option>
                            <option value="Alat Tulis">Alat Tulis</option>
                            <option value="Pakaian">Pakaian</option>
                            <option value="Dokumen">Dokumen</option>
                            <option value="Lainnya">Lainnya</option>
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
                        <input
                            type="file"
                            name="foto"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="w-full border border-[#b0b0b0] rounded-[10px] px-4 py-2 mt-1 cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-1 file:text-white file:transition file:hover:bg-blue-500"
                        />
                    </div>

                    {/* Tombol Submit */}
                    <div className="w-full sm:max-w-sm sm:mx-auto">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full bg-[#f98125] text-white px-6 py-2 rounded-[10px] font-bold transition hover:bg-[#d96f1f] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? "Mengirim..." : "Kirim Laporan"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

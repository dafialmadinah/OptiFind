"use client";

import { useState } from "react";

export default function LaporHilangPage() {
    const [formData, setFormData] = useState({
        nama: "",
        kategori: "",
        waktu: "",
        lokasi: "",
        deskripsi: "",
        kontak: "",
        foto: null as File | null,
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Form akan dikirim (simulasi).");
    };

    return (
        <section className="bg-[#f4f4f4] pt-8 sm:pt-12 pb-12 px-4 sm:px-8 md:px-[100px] font-poppins">
            <div className="mx-auto max-w-[1232px] rounded-[20px] bg-white p-8">
                <h1 className="mb-2 text-[28px] font-bold text-[#193a6f] font-poppins">
                    Lapor Barang Hilang
                </h1>
                <p className="mb-4 text-[16px] text-black font-poppins">
                    Isi formulir berikut untuk melaporkan barang kamu yang
                    hilang atau tertinggal di suatu tempat. Mohon lengkapi
                    informasi secara jelas agar mempermudah proses pencarian dan
                    verifikasi oleh pengguna lain.
                </p>
                <hr className="mb-6 border-[#b0b0b0]" />

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 font-poppins"
                >
                    {/* Nama Barang */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black font-poppins">
                            Nama Barang
                        </label>
                        <input
                            type="text"
                            name="nama"
                            placeholder="Masukkan nama barang"
                            value={formData.nama}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 font-poppins text-[15px] outline-none focus:border-blue-400 focus:ring-0"
                        />
                    </div>

                    {/* Kategori */}
                    <div className="relative">
                        <label className="block font-semibold text-[16px] text-black font-poppins mb-1">
                            Kategori
                        </label>

                        <div className="relative">
                            <select
                                name="kategori"
                                value={formData.kategori}
                                onChange={handleChange}
                                required
                                className="w-full appearance-none rounded-[10px] border border-[#b0b0b0] bg-white px-4 py-2 pr-10 font-poppins text-[15px] text-[#1e1e1e] outline-none focus:border-blue-400 focus:ring-0"
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

                            {/* Icon panah custom */}
                            <svg
                                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Waktu */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black font-poppins">
                            Waktu
                        </label>
                        <input
                            type="datetime-local"
                            name="waktu"
                            value={formData.waktu}
                            onChange={handleChange}
                            onClick={(e) => e.currentTarget.showPicker?.()}
                            required
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 font-poppins text-[15px] outline-none focus:border-blue-400 focus:ring-0 cursor-pointer"
                        />
                    </div>

                    {/* Lokasi */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black font-poppins">
                            Lokasi
                        </label>
                        <input
                            type="text"
                            name="lokasi"
                            placeholder="Masukkan lokasi"
                            value={formData.lokasi}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 font-poppins text-[15px] outline-none focus:border-blue-400 focus:ring-0"
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black font-poppins">
                            Deskripsi
                        </label>
                        <textarea
                            name="deskripsi"
                            placeholder="Masukkan deskripsi"
                            rows={3}
                            value={formData.deskripsi}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 font-poppins text-[15px] outline-none focus:border-blue-400 focus:ring-0"
                        ></textarea>
                    </div>

                    {/* Kontak */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black font-poppins">
                            Kontak
                        </label>
                        <input
                            type="text"
                            name="kontak"
                            placeholder="Masukkan kontak"
                            value={formData.kontak}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full rounded-[10px] border border-[#b0b0b0] px-4 py-2 font-poppins text-[15px] outline-none focus:border-blue-400 focus:ring-0"
                        />
                    </div>

                    {/* Foto */}
                    <div>
                        <label className="block font-semibold text-[16px] text-black font-poppins">
                            Foto Barang
                        </label>
                        <input
                            type="file"
                            name="foto"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="mt-1 w-full cursor-pointer rounded-[10px] border border-[#b0b0b0] px-4 py-2 font-poppins text-[15px] outline-none file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-1 file:text-white file:transition file:hover:bg-blue-500"
                        />
                    </div>

                    {/* Tombol Submit */}
                    <div className="w-full sm:max-w-sm sm:mx-auto">
                        <button
                            type="submit"
                            className="w-full rounded-[10px] bg-[#f98125] px-6 py-2 font-poppins font-bold text-white text-[16px] transition hover:bg-[#d96f1f]"
                        >
                            Kirim Laporan
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

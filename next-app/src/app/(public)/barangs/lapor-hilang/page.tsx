'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LaporHilangPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kategoriId: '',
    waktu: '',
    lokasi: '',
    deskripsi: '',
    kontak: '',
    foto: null as File | null,
  });

  const categories = [
    { id: 1, name: 'Dompet' },
    { id: 2, name: 'Kunci' },
    { id: 3, name: 'Jam' },
    { id: 4, name: 'Smartphone' },
    { id: 5, name: 'Elektronik' },
    { id: 6, name: 'Botol Minum' },
    { id: 7, name: 'Alat Tulis' },
    { id: 8, name: 'Pakaian' },
    { id: 9, name: 'Dokumen' },
    { id: 10, name: 'Lainnya' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        foto: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Silakan login terlebih dahulu');
        router.push('/login');
        return;
      }

      // Upload foto jika ada
      let fotoUrl = null;
      if (formData.foto) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', formData.foto);

        // TODO: Implement file upload to Supabase Storage
        // For now, we'll use a placeholder
        fotoUrl = '/assets/no_image.png';
      }

      // Create barang hilang
      const response = await fetch('/api/barangs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: formData.nama,
          kategoriId: parseInt(formData.kategoriId),
          tipe: 'hilang',
          lokasi: formData.lokasi,
          waktu: formData.waktu,
          deskripsi: formData.deskripsi,
          kontak: formData.kontak,
          foto: fotoUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Laporan berhasil dikirim!');
        router.push('/barangs');
      } else {
        alert(data.message || 'Gagal mengirim laporan');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat mengirim laporan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Lapor Barang Hilang
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            Isi formulir berikut untuk melaporkan barang kamu yang hilang atau
            tertinggal di suatu tempat. Mohon lengkapi informasi secara jelas agar
            mempermudah proses pencarian dan verifikasi oleh pengguna lain.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Barang */}
            <div>
              <label
                htmlFor="nama"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Nama Barang
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama barang"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Kategori */}
            <div>
              <label
                htmlFor="kategoriId"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Kategori
              </label>
              <select
                id="kategoriId"
                name="kategoriId"
                value={formData.kategoriId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Waktu */}
            <div>
              <label
                htmlFor="waktu"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Waktu
              </label>
              <input
                type="datetime-local"
                id="waktu"
                name="waktu"
                value={formData.waktu}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lokasi */}
            <div>
              <label
                htmlFor="lokasi"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Lokasi
              </label>
              <input
                type="text"
                id="lokasi"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                placeholder="Masukkan lokasi"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label
                htmlFor="deskripsi"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Deskripsi
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Masukkan deskripsi"
                rows={5}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Kontak */}
            <div>
              <label
                htmlFor="kontak"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Kontak
              </label>
              <input
                type="text"
                id="kontak"
                name="kontak"
                value={formData.kontak}
                onChange={handleChange}
                placeholder="Masukkan kontak"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Foto Barang */}
            <div>
              <label
                htmlFor="foto"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Foto Barang
              </label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="foto"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <Image
                    src="/assets/upload.svg"
                    alt="Upload"
                    width={20}
                    height={20}
                  />
                  <span className="font-medium">Upload gambar</span>
                </label>
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-sm text-gray-500">
                  {formData.foto ? formData.foto.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

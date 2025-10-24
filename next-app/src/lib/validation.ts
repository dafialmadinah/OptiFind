import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  noTelepon: z.string().min(6, "Nomor telepon tidak valid").optional(),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const barangSchema = z.object({
  nama: z.string().min(1, "Nama barang wajib diisi"),
  tipeId: z.number().int().positive(),
  kategoriId: z.number().int().positive(),
  waktu: z.string().optional(),
  lokasi: z.string().optional(),
  kontak: z.string().optional(),
  deskripsi: z.string().optional(),
  foto: z.string().url("URL foto tidak valid").optional().or(z.literal("").optional()),
  statusId: z.number().int().positive(),
});

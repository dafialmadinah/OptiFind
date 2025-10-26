"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// === Schema Validasi ===
const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  no_telepon: z.string().min(10, "Nomor telepon tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const nameValue = watch("name");
  const passwordValue = watch("password");

  // Auto-generate username & confirm password
  useEffect(() => {
    const username = nameValue ? nameValue.toLowerCase().replace(/\s+/g, "") : "";
    setValue("username" as any, username);
    setValue("password_confirmation" as any, passwordValue);
  }, [nameValue, passwordValue, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log("Form values:", values);
      router.push("/login");
    } catch {
      setServerError("Terjadi kesalahan saat register");
    }
  });

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-8 overflow-hidden"
      style={{
        background:
          "linear-gradient(to top, rgb(11,39,83), rgb(14,49,105), rgb(19,64,138))",
      }}
    >
      {/* === MOBILE === */}
      <div className="flex flex-col items-center lg:hidden">
        <div className="mb-2">
          <Image src="/assets/logo.svg" alt="Logo" width={160} height={160} />
        </div>

        <div className="bg-white rounded-[20px] w-[330px] p-[25px] space-y-[10px]">
          <h2 className="font-poppins font-bold text-[20px] mb-2">Register</h2>

          <form onSubmit={onSubmit} className="space-y-4">
            {[ 
              { id: "name", label: "Nama", icon: "username.svg", type: "text" },
              { id: "email", label: "Email", icon: "email.svg", type: "email" },
              { id: "no_telepon", label: "Nomor Telepon", icon: "kontak.svg", type: "text" },
              { id: "password", label: "Password", icon: "password.svg", type: "password" },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="block text-[15px] font-semibold">
                  {f.label}
                </label>
                <div className="relative flex items-center bg-white rounded-xl border border-gray-300 mt-2">
                  <Image
                    src={`/assets/${f.icon}`}
                    alt={`${f.label} Icon`}
                    width={16}
                    height={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    id={f.id}
                    type={f.type}
                    placeholder={`Masukkan ${f.label.toLowerCase()}`}
                    className="block w-full pl-12 py-3 font-poppins text-sm placeholder-gray-400 bg-transparent border-none focus:ring-2 focus:ring-[#F98125] focus:outline-none rounded-xl"
                    {...register(f.id as keyof RegisterFormValues)}
                  />
                </div>
                {errors[f.id as keyof RegisterFormValues] && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors[f.id as keyof RegisterFormValues]?.message?.toString()}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-[16px] bg-[#F98125] hover:bg-[#e0701e] text-white font-semibold font-poppins py-2 rounded-lg transition"
            >
              {isSubmitting ? "Memproses..." : "Daftar"}
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-4 text-gray-500">atau</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <button
              type="button"
              onClick={() => signIn("google")}
              className="flex items-center justify-center gap-x-3 h-[45px] w-full bg-white border border-gray-300 text-gray-800 font-medium font-poppins rounded-lg py-2 hover:bg-gray-50 transition"
            >
              <Image src="/assets/google.svg" alt="Google Icon" width={22} height={22} />
              Daftar dengan Google
            </button>
          </form>
        </div>

        <p className="text-white mt-8 text-sm text-center font-poppins">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-white underline underline-offset-2">
            Login
          </Link>
        </p>
      </div>

      {/* === DESKTOP === */}
      <div className="hidden lg:flex w-full max-w-[900px] h-auto bg-white rounded-[20px] overflow-hidden">
        <div className="w-[400px] flex flex-col items-center bg-[#f5f5f5] py-12 px-6">
          <Image src="/assets/optifind.png" alt="Logo" width={280} height={78} className="mt-8 mb-6" />
          <Image src="/assets/register_illustration.svg" alt="Ilustrasi" width={300} height={300} className="mt-12" />
        </div>

        <div className="flex-1 flex items-center justify-center px-10 py-8">
          <div className="w-full max-w-[440px]">
            <h2 className="text-[28px] font-bold font-poppins text-[#1E1E1E] mb-4 text-center">Register</h2>

            <form onSubmit={onSubmit}>
              {[
                { id: "name", label: "Nama", icon: "username.svg", type: "text" },
                { id: "email", label: "Email", icon: "email.svg", type: "email" },
                { id: "no_telepon", label: "Nomor Telepon", icon: "kontak.svg", type: "text" },
                { id: "password", label: "Password", icon: "password.svg", type: "password" },
              ].map((f) => (
                <div key={f.id} className="mb-3">
                  <label htmlFor={f.id} className="block mb-1 font-medium">
                    {f.label}
                  </label>
                  <div className="relative flex items-center bg-white rounded-xl border border-gray-300">
                    <Image
                      src={`/assets/${f.icon}`}
                      alt={`${f.label} Icon`}
                      width={16}
                      height={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <input
                      id={f.id}
                      type={f.type}
                      placeholder={`Masukkan ${f.label.toLowerCase()}`}
                      className="block w-full pl-12 py-3 font-poppins text-sm placeholder-gray-400 bg-transparent border-none focus:ring-2 focus:ring-[#F98125] focus:outline-none rounded-xl"
                      {...register(f.id as keyof RegisterFormValues)}
                    />
                  </div>
                  {errors[f.id as keyof RegisterFormValues] && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors[f.id as keyof RegisterFormValues]?.message?.toString()}
                    </p>
                  )}
                </div>
              ))}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-[16px] bg-[#F98125] hover:bg-[#e0701e] text-white font-semibold font-poppins py-2 rounded-lg transition"
                >
                  {isSubmitting ? "Memproses..." : "Daftar"}
                </button>
              </div>

              <div className="flex items-center my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-4 text-gray-500">atau</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

              <button
                type="button"
                onClick={() => signIn("google")}
                className="flex items-center justify-center gap-x-3 h-[45px] w-full bg-white border border-gray-300 text-gray-800 font-medium font-poppins rounded-lg py-2 hover:bg-gray-50 transition"
              >
                <Image src="/assets/google.svg" alt="Google Icon" width={22} height={22} />
                Daftar dengan Google
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-bold text-[#000000]">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

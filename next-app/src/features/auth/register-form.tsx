"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { registerSchema } from "@/lib/validation";

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      noTelepon: "",
      password: "",
    },
  });
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.status === 409) {
      const payload = await response.json();
      setServerError(payload.message);
      setError("email", { message: payload.message });
      return;
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setServerError(payload?.message ?? "Registrasi gagal. Silakan coba lagi.");
      return;
    }

    // Auto login after registration
    await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/barangs",
    });

    router.push("/barangs");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Buat Akun Baru</h1>
        <p className="text-sm text-slate-600">
          Isi data diri Anda untuk melaporkan barang hilang atau temuan.
        </p>
      </div>
      <div className="space-y-4">
        <InputField label="Nama Lengkap" id="name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            {...register("name")}
          />
        </InputField>
        <InputField label="Username" id="username" error={errors.username?.message}>
          <input
            id="username"
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            {...register("username")}
          />
        </InputField>
        <InputField label="Email" id="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            {...register("email")}
          />
        </InputField>
        <InputField
          label="Nomor Telepon"
          id="noTelepon"
          hint="Opsional, mempermudah kontak antar pengguna."
          error={errors.noTelepon?.message}
        >
          <input
            id="noTelepon"
            type="tel"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            {...register("noTelepon")}
          />
        </InputField>
        <InputField label="Password" id="password" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            {...register("password")}
          />
        </InputField>
      </div>

      {serverError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-70"
      >
        {isSubmitting ? "Memproses..." : "Daftar"}
      </button>
    </form>
  );
}

function InputField({
  label,
  id,
  error,
  children,
  hint,
}: {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-600">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

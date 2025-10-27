"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import Skeleton from "@/components/skeleton";

// === Schema Validasi ===
const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/barangs";
    const { signIn } = useAuth();
    const [remember, setRemember] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

    const [serverError, setServerError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // show skeleton briefly to avoid layout shift on initial render
        const t = setTimeout(() => setReady(true), 120);
        return () => clearTimeout(t);
    }, []);

    const onSubmit = handleSubmit(async (values) => {
        setServerError(null);
        
        try {
            await signIn(values.email, values.password);
            router.push(callbackUrl);
            router.refresh();
        } catch (error: any) {
            const message = error?.message || "Email atau password tidak valid.";
            setServerError(message);
            setError("password", { message });
        }
    });

    if (!ready) return <Skeleton />;

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center px-4 py-8 overflow-hidden"
            style={{
                background:
                    "linear-gradient(to top, rgb(11,39,83), rgb(14,49,105), rgb(19,64,138))",
            }}
        >
            {/* === Versi Mobile === */}
            <div className="flex flex-col items-center lg:hidden">
                {/* Logo */}
                <div className="mb-4">
                    <Image
                        src="/assets/logo.svg"
                        alt="Logo"
                        width={160}
                        height={160}
                        className="rounded-full object-cover"
                    />
                </div>

                {/* Box Login */}
                <div className="bg-white rounded-[20px] w-[330px] h-[500px] p-[25px] space-y-[10px] border border-gray-200">
                    <h2 className="font-poppins font-bold text-[20px] mb-2">
                        Login
                    </h2>

                    <form onSubmit={onSubmit}>
                        {/* Email */}
                        <label
                            htmlFor="email"
                            className="mt-3 mb-3 text-[16px] font-semibold block"
                        >
                            Email
                        </label>
                        <div className="relative flex items-center bg-white rounded-xl border border-gray-300">
                            <Image
                                src="/assets/username.svg"
                                alt="Email Icon"
                                width={16}
                                height={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                            />
                            <input
                                id="email"
                                type="email"
                                placeholder="Masukkan email"
                                autoComplete="username"
                                className="block w-full pl-12 pr-6 py-3 font-poppins text-sm placeholder-gray-400 bg-transparent border-none focus:ring-2 focus:ring-[#F98125] focus:outline-none rounded-xl"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.email.message}
                            </p>
                        )}

                        {/* Password */}
                        <label
                            htmlFor="password"
                            className="mt-3 mb-3 font-semibold block"
                        >
                            Password
                        </label>
                        <div className="relative flex items-center bg-white rounded-xl border border-gray-300">
                            <Image
                                src="/assets/password.svg"
                                alt="Password Icon"
                                width={16}
                                height={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                            />
                            <input
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
                                autoComplete="current-password"
                                className="block w-full pl-12 pr-6 py-3 font-poppins text-sm placeholder-gray-400 bg-transparent border-none focus:ring-2 focus:ring-[#F98125] focus:outline-none rounded-xl"
                                {...register("password")}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.password.message}
                            </p>
                        )}

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between mt-8">
                            <label className="flex items-center space-x-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) =>
                                        setRemember(e.target.checked)
                                    }
                                    className="w-4 h-4 border border-gray-400 rounded-sm text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    name="remember"
                                />
                                <span className="text-sm text-gray-700 font-montserrat">
                                    Ingat saya
                                </span>
                            </label>

                            <Link
                                href="/forgot-password"
                                className="text-sm text-dark-blue hover:underline"
                            >
                                Lupa Password?
                            </Link>
                        </div>

                        {/* Tombol Masuk */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full text-[16px] bg-[#F98125] hover:bg-[#e0701e] text-white font-semibold font-poppins py-2 rounded-lg transition"
                            >
                                {isSubmitting ? "Memproses..." : "Masuk"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Register Link */}
                <p className="text-white mt-10 text-sm text-center">
                    Belum punya akun?{" "}
                    <Link href="/register" className="font-bold">
                        Daftar
                    </Link>
                </p>
            </div>

            {/* === Versi Desktop === */}
            <div className="hidden lg:flex w-full max-w-[900px] h-[600px] bg-white rounded-[20px] border border-gray-200 overflow-hidden">
                {/* Kiri: Logo & Ilustrasi */}
                <div className="w-[400px] h-full flex flex-col items-center bg-[#f5f5f5] py-8 px-6">
                    <Image
                        src="/assets/optifind.png"
                        alt="Logo"
                        width={280}
                        height={78}
                        className="mt-8 mb-6"
                    />
                    <Image
                        src="/assets/login_illustration.svg"
                        alt="Ilustrasi"
                        width={300}
                        height={300}
                        className="mt-12"
                    />
                </div>

                {/* Kanan: Form Login */}
                <div className="flex-1 flex items-center justify-center px-10">
                    <div className="w-full max-w-[440px]">
                        <h2 className="text-[28px] font-bold font-poppins text-[#1E1E1E] mb-4 text-center">
                            Login
                        </h2>

                        <form onSubmit={onSubmit}>
                            {/* Email */}
                            <label htmlFor="email" className="mb-2 block">
                                Email
                            </label>
                            <div className="relative flex items-center bg-white rounded-xl border border-gray-300">
                                <Image
                                    src="/assets/username.svg"
                                    alt="Email Icon"
                                    width={16}
                                    height={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Masukkan email"
                                    autoComplete="username"
                                    className="block w-full pl-12 pr-6 py-3 font-poppins text-sm placeholder-gray-400 bg-transparent border-none focus:ring-2 focus:ring-[#F98125] focus:outline-none rounded-xl"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.email.message}
                                </p>
                            )}

                            {/* Password */}
                            <label
                                htmlFor="password"
                                className="mt-4 mb-2 block"
                            >
                                Password
                            </label>
                            <div className="relative flex items-center bg-white rounded-xl border border-gray-300">
                                <Image
                                    src="/assets/password.svg"
                                    alt="Password Icon"
                                    width={16}
                                    height={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Masukkan password"
                                    autoComplete="current-password"
                                    className="block w-full pl-12 pr-6 py-3 font-poppins text-sm placeholder-gray-400 bg-transparent border-none focus:ring-2 focus:ring-[#F98125] focus:outline-none rounded-xl"
                                    {...register("password")}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.password.message}
                                </p>
                            )}

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between mt-6">
                                <label className="flex items-center space-x-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) =>
                                            setRemember(e.target.checked)
                                        }
                                        className="w-4 h-4 border border-gray-400 rounded-sm text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        name="remember"
                                    />
                                    <span className="text-sm text-gray-700 font-montserrat">
                                        Ingat saya
                                    </span>
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-dark-blue hover:underline"
                                >
                                    Lupa Password?
                                </Link>
                            </div>

                            {/* Tombol Masuk */}
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full text-[16px] bg-[#F98125] hover:bg-[#e0701e] text-white font-semibold font-poppins py-2 rounded-lg transition"
                                >
                                    {isSubmitting ? "Memproses..." : "Masuk"}
                                </button>
                            </div>
                        </form>

                        {/* Register */}
                        <div className="mt-auto pt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Belum punya akun?{" "}
                                <Link
                                    href="/register"
                                    className="font-semibold text-[#000000]"
                                >
                                    Daftar
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<Skeleton />}>
            <LoginForm />
        </Suspense>
    );
}

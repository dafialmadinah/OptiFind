import Link from "next/link";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <LoginForm />
      <p className="text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-blue-600">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}

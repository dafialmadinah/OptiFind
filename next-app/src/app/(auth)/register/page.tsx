import Link from "next/link";
import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <RegisterForm />
      <p className="text-center text-sm text-slate-500">
        Sudah memiliki akun?{" "}
        <Link href="/login" className="font-semibold text-blue-600">
          Masuk sekarang
        </Link>
      </p>
    </div>
  );
}

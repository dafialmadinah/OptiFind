import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SupabaseUserRow = {
  id: number;
  name: string | null;
  email: string;
  username: string | null;
  no_telepon: string | null;
  password: string;
  role: string;
};

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email dan password wajib diisi.");
        }

        const { data, error } = await supabase
          .from("users")
          .select("id, name, email, username, no_telepon, password, role")
          .eq("email", credentials.email)
          .maybeSingle<SupabaseUserRow>();

        if (error || !data) {
          console.error(error);
          throw new Error("Email atau password tidak valid.");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, data.password);

        if (!passwordMatch) {
          throw new Error("Email atau password tidak valid.");
        }

        return {
          id: data.id.toString(),
          name: data.name,
          email: data.email,
          role: data.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as unknown as { role: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) ?? "USER";
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

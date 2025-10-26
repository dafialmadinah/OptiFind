import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

/**
 * Get Supabase client for Server Components
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

/**
 * Get authenticated user from Supabase session
 */
export async function getSupabaseUser(request?: NextRequest) {
  const supabase = createServerSupabaseClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Get user data from database by auth ID
 */
export async function getUserData(authId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, username, role, no_telepon")
    .eq("id", authId)
    .single();

  if (error) {
    console.error("Get user data error:", error);
    return null;
  }

  return data;
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client untuk server-side (no session persistence)
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }) : null;

// Client untuk browser (with session persistence)
export function createSupabaseClient() {
  if (!url || !anonKey) {
    throw new Error("Supabase URL and Anon Key are required");
  }
  
  return createBrowserClient(url, anonKey);
}

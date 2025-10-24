import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const clientOptions = {
  auth: {
    persistSession: false,
  },
} as const;

// Client utama (untuk public + server)
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey, clientOptions) : null;

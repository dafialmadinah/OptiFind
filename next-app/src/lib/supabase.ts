import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const clientOptions = {
  auth: {
    persistSession: false,
  },
} as const;

export const supabasePublic: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey, clientOptions) : null;

export const supabaseAdmin: SupabaseClient | null =
  url && serviceRoleKey ? createClient(url, serviceRoleKey, clientOptions) : null;

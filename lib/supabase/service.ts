import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseEnv,
  getSupabaseServiceRoleKey,
} from "@/lib/config/env";

let cached: SupabaseClient | null = null;

/**
 * Service-role client. Server-only — never import into client components.
 * Used for writes that bypass RLS (api_cache, stock_data_snapshots).
 * Returns null when either URL or service role key is missing.
 */
export function createSupabaseServiceClient(): SupabaseClient | null {
  const env = getSupabaseEnv();
  const serviceKey = getSupabaseServiceRoleKey();
  if (!env || !serviceKey) return null;
  if (cached) return cached;
  cached = createClient(env.url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

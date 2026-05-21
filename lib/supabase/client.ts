"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";
import type { SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient | null {
  const env = getSupabaseEnv();
  if (!env) return null;
  if (cached) return cached;
  cached = createBrowserClient(env.url, env.anonKey);
  return cached;
}

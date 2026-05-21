import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/env";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseServerClient(): SupabaseClient | null {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cookieStore = cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can't set cookies. The middleware will
          // refresh the session, so this is safe to ignore.
        }
      },
    },
  });
}

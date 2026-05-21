import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { PlanCode } from "@/lib/planLimits";

export interface Profile {
  id: string;
  email: string | null;
  plan: PlanCode;
  created_at: string;
  updated_at: string;
}

export interface CurrentAuth {
  user: User | null;
  profile: Profile | null;
  configured: boolean;
}

/**
 * Reads the current user + profile for the request. Memoized per-request
 * via React.cache so server components in the same render share one call.
 */
export const getCurrentAuth = cache(async (): Promise<CurrentAuth> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { user: null, profile: null, configured: false };
  }

  let user: User | null = null;
  try {
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = u;
  } catch {
    user = null;
  }

  if (!user) {
    return { user: null, profile: null, configured: true };
  }

  // Read profile. If a trigger created it, this returns the row. If not, we
  // upsert a default so the rest of the app can assume it exists.
  let profile: Profile | null = null;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, plan, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();
    profile = (data as Profile | null) ?? null;
  } catch {
    profile = null;
  }

  if (!profile) {
    try {
      const { data: upserted } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            email: user.email ?? null,
            plan: "free" as PlanCode,
          },
          { onConflict: "id" },
        )
        .select("id, email, plan, created_at, updated_at")
        .maybeSingle();
      profile = (upserted as Profile | null) ?? null;
    } catch {
      // ignore — auth still works without profile row.
    }
  }

  return { user, profile, configured: true };
});

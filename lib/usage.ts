"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentAuth } from "@/lib/auth";
import { getPlanLimit } from "@/lib/planLimits";

export interface DailyUsage {
  id: string;
  user_id: string;
  usage_date: string;
  report_views: number;
  ai_summaries: number;
}

export interface UsageStatus {
  /** true when caller is not authenticated; usage tracking does not apply */
  unauthenticated: boolean;
  /** today's usage row, may be null when DB not configured */
  usage: DailyUsage | null;
  /** plan-derived daily report view limit */
  limit: number;
  /** true if user has used >= limit reports today */
  exceeded: boolean;
}

function todayDateUtc(): string {
  // Use UTC date — schema column is `date`, comparisons are timezone-naive.
  // Counts reset roughly at UTC midnight; acceptable for 1B.
  return new Date().toISOString().slice(0, 10);
}

export async function getTodayUsageStatus(): Promise<UsageStatus> {
  const supabase = createSupabaseServerClient();
  const { user, profile } = await getCurrentAuth();
  const limit = getPlanLimit(profile?.plan).dailyReportViews;

  if (!user) {
    return { unauthenticated: true, usage: null, limit, exceeded: false };
  }
  if (!supabase) {
    return { unauthenticated: false, usage: null, limit, exceeded: false };
  }

  const date = todayDateUtc();
  const { data } = await supabase
    .from("daily_usage")
    .select("id, user_id, usage_date, report_views, ai_summaries")
    .eq("user_id", user.id)
    .eq("usage_date", date)
    .maybeSingle();

  const usage = (data as DailyUsage | null) ?? null;
  const exceeded = (usage?.report_views ?? 0) >= limit;
  return { unauthenticated: false, usage, limit, exceeded };
}

/**
 * Atomically increments today's report_views for the current user.
 * Returns the new value, or null when unauthenticated / not configured.
 * Server-only — never callable from the client without RLS protection.
 */
export async function incrementReportView(): Promise<number | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const { user } = await getCurrentAuth();
  if (!user) return null;

  const date = todayDateUtc();

  // Read current row (or 0 if none)
  const { data: existing } = await supabase
    .from("daily_usage")
    .select("id, report_views")
    .eq("user_id", user.id)
    .eq("usage_date", date)
    .maybeSingle();

  const next = (existing?.report_views ?? 0) + 1;

  const { error } = await supabase.from("daily_usage").upsert(
    {
      user_id: user.id,
      usage_date: date,
      report_views: next,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,usage_date" },
  );

  if (error) return null;
  return next;
}

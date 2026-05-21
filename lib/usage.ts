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

export interface AiUsageStatus {
  unauthenticated: boolean;
  used: number;
  limit: number;
  exceeded: boolean;
}

function todayDateUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

async function getTodayRow(): Promise<DailyUsage | null> {
  const supabase = createSupabaseServerClient();
  const { user } = await getCurrentAuth();
  if (!supabase || !user) return null;
  const date = todayDateUtc();
  const { data } = await supabase
    .from("daily_usage")
    .select("id, user_id, usage_date, report_views, ai_summaries")
    .eq("user_id", user.id)
    .eq("usage_date", date)
    .maybeSingle();
  return (data as DailyUsage | null) ?? null;
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

  const usage = await getTodayRow();
  const exceeded = (usage?.report_views ?? 0) >= limit;
  return { unauthenticated: false, usage, limit, exceeded };
}

/**
 * AI 요약 사용량 상태. 캐시된 결과를 보여줄 때는 incrementAiSummaryView를
 * 호출하지 않으므로 한도 계산에도 포함되지 않습니다.
 */
export async function getTodayAiUsageStatus(): Promise<AiUsageStatus> {
  const { user, profile } = await getCurrentAuth();
  const limit = getPlanLimit(profile?.plan).dailyAiSummaries;

  if (!user) {
    return { unauthenticated: true, used: 0, limit, exceeded: false };
  }

  const usage = await getTodayRow();
  const used = usage?.ai_summaries ?? 0;
  return {
    unauthenticated: false,
    used,
    limit,
    exceeded: used >= limit,
  };
}

/**
 * Atomically increments today's report_views for the current user.
 * Returns the new value, or null when unauthenticated / not configured.
 */
export async function incrementReportView(): Promise<number | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const { user } = await getCurrentAuth();
  if (!user) return null;

  const date = todayDateUtc();
  const existing = await getTodayRow();
  const next = (existing?.report_views ?? 0) + 1;

  const { error } = await supabase.from("daily_usage").upsert(
    {
      user_id: user.id,
      usage_date: date,
      report_views: next,
      ai_summaries: existing?.ai_summaries ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,usage_date" },
  );

  if (error) return null;
  return next;
}

/**
 * AI 요약 호출 시 호출됩니다. 캐시 hit 일 때는 호출하지 마세요.
 */
export async function incrementAiSummaryView(): Promise<number | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const { user } = await getCurrentAuth();
  if (!user) return null;

  const date = todayDateUtc();
  const existing = await getTodayRow();
  const next = (existing?.ai_summaries ?? 0) + 1;

  const { error } = await supabase.from("daily_usage").upsert(
    {
      user_id: user.id,
      usage_date: date,
      report_views: existing?.report_views ?? 0,
      ai_summaries: next,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,usage_date" },
  );

  if (error) return null;
  return next;
}

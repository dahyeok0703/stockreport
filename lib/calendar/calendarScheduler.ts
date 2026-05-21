/**
 * 캘린더 자동 갱신 스케줄러.
 *
 * 현재는 외부 API 호출이나 DB 쓰기를 하지 않고 결과 객체만 반환합니다.
 * 나중에 Vercel Cron이 /api/cron/calendar-refresh 를 호출할 때
 * runCalendarRefresh() 가 실제 ingestion 함수들을 호출하도록 확장됩니다.
 */

import {
  getCalendarRefreshConfig,
  getProviderRefreshInterval,
  isCalendarAutoRefreshEnabled,
} from "@/lib/calendar/calendarRefreshConfig";
import type {
  CalendarRefreshProvider,
  CalendarRefreshState,
  CalendarRefreshStatus,
} from "@/lib/calendar/types";

// 단일 프로세스 내에서 마지막 갱신 시각을 메모리로 추적합니다.
// 실제 운영 시에는 Supabase calendar_refresh_status 테이블로 교체됩니다.
const memory = new Map<CalendarRefreshProvider, CalendarRefreshStatus>();

const ALL_PROVIDERS: CalendarRefreshProvider[] = [
  "opendart",
  "sec",
  "news",
  "earnings",
  "economic",
  "price",
];

function nowIso(): string {
  return new Date().toISOString();
}

function nextRunIso(provider: CalendarRefreshProvider): string {
  const interval = getProviderRefreshInterval(provider);
  return new Date(Date.now() + interval).toISOString();
}

function defaultStatus(provider: CalendarRefreshProvider): CalendarRefreshStatus {
  return {
    provider,
    status: "idle",
    lastRunAt: undefined,
    nextRunAt: nextRunIso(provider),
  };
}

export function shouldRefreshProvider(
  provider: CalendarRefreshProvider,
  lastRefreshAt?: string,
): boolean {
  if (!lastRefreshAt) return true;
  const last = new Date(lastRefreshAt).getTime();
  if (!Number.isFinite(last)) return true;
  return Date.now() - last >= getProviderRefreshInterval(provider);
}

export interface ProviderRunResult {
  provider: CalendarRefreshProvider;
  state: CalendarRefreshState;
  message: string;
  ranAt: string;
}

export async function runProviderRefresh(
  provider: CalendarRefreshProvider,
): Promise<ProviderRunResult> {
  // 현재 단계: 외부 API 호출 없이 결과만 갱신.
  const result: ProviderRunResult = {
    provider,
    state: "success",
    message: "기준 시각이 갱신되었습니다.",
    ranAt: nowIso(),
  };
  updateRefreshStatus(provider, result);
  return result;
}

export async function runCalendarRefresh(): Promise<{
  enabled: boolean;
  results: ProviderRunResult[];
  ranAt: string;
}> {
  const ranAt = nowIso();
  if (!isCalendarAutoRefreshEnabled()) {
    return { enabled: false, results: [], ranAt };
  }
  const results: ProviderRunResult[] = [];
  for (const provider of ALL_PROVIDERS) {
    const existing = memory.get(provider);
    if (!shouldRefreshProvider(provider, existing?.lastRunAt)) {
      const skipped: ProviderRunResult = {
        provider,
        state: "skipped",
        message: "갱신 주기 이내입니다.",
        ranAt,
      };
      updateRefreshStatus(provider, skipped);
      results.push(skipped);
      continue;
    }
    results.push(await runProviderRefresh(provider));
  }
  return { enabled: true, results, ranAt };
}

export function getLastRefreshStatus(): CalendarRefreshStatus[] {
  return ALL_PROVIDERS.map((p) => memory.get(p) ?? defaultStatus(p));
}

export function updateRefreshStatus(
  provider: CalendarRefreshProvider,
  result: ProviderRunResult,
): void {
  memory.set(provider, {
    provider,
    status: result.state,
    message: result.message,
    lastRunAt: result.ranAt,
    nextRunAt: nextRunIso(provider),
  });
}

/** 자동 갱신 활성 여부 + 마지막 상태 — API 응답에 함께 포함 */
export function getSchedulerSnapshot() {
  return {
    enabled: getCalendarRefreshConfig().autoRefreshEnabled,
    status: getLastRefreshStatus(),
  };
}

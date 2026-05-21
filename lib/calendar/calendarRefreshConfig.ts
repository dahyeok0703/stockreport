/**
 * 캘린더 자동 갱신 주기 설정.
 *
 * 환경 변수가 없으면 안전한 기본값을 반환합니다. 사용자 화면에는 이 값들이
 * 그대로 노출되지 않습니다 (서버 측 cron / 갱신 스케줄러 내부 용도).
 */

import type { CalendarRefreshProvider } from "@/lib/calendar/types";

export interface CalendarRefreshConfig {
  autoRefreshEnabled: boolean;
  intervalsMs: Record<CalendarRefreshProvider, number>;
}

function readMinutes(envName: string, fallbackMinutes: number): number {
  const v = process.env[envName];
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return fallbackMinutes * 60 * 1000;
  return Math.floor(n) * 60 * 1000;
}

function readHours(envName: string, fallbackHours: number): number {
  const v = process.env[envName];
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return fallbackHours * 3600 * 1000;
  return Math.floor(n) * 3600 * 1000;
}

export function getCalendarRefreshConfig(): CalendarRefreshConfig {
  const autoRefreshEnabled =
    (process.env.CALENDAR_AUTO_REFRESH_ENABLED || "false").toLowerCase() ===
    "true";

  return {
    autoRefreshEnabled,
    intervalsMs: {
      opendart: readMinutes("CALENDAR_DART_REFRESH_MINUTES", 60),
      sec: readMinutes("CALENDAR_SEC_REFRESH_MINUTES", 60),
      news: readMinutes("CALENDAR_NEWS_REFRESH_MINUTES", 60),
      earnings: readHours("CALENDAR_EARNINGS_REFRESH_HOURS", 12),
      economic: readHours("CALENDAR_ECONOMIC_REFRESH_HOURS", 24),
      price: readMinutes("CALENDAR_PRICE_REFRESH_MINUTES", 15),
    },
  };
}

export function isCalendarAutoRefreshEnabled(): boolean {
  return getCalendarRefreshConfig().autoRefreshEnabled;
}

export function getProviderRefreshInterval(
  provider: CalendarRefreshProvider,
): number {
  return getCalendarRefreshConfig().intervalsMs[provider];
}

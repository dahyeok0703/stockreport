/**
 * 캘린더 도메인 쿼리/필터.
 *
 * 데이터 소스는 mockCalendar.ts 입니다. 추후 OpenDART/SEC/뉴스/실적/
 * 경제지표 API 또는 Supabase 캐시로 교체하더라도 이 함수들의 입출력 계약은
 * 유지되어야 합니다.
 */

import { generateMonthlyCalendar } from "@/lib/calendar/mockCalendar";
import { getCalendarGrid, toIsoDate } from "@/lib/calendar/dateUtils";
import type {
  CalendarCategory,
  CalendarEvent,
  CalendarMarket,
  MonthlySummary,
} from "@/lib/calendar/types";

export interface CalendarFilter {
  market?: "all" | CalendarMarket;
  category?: "all" | CalendarCategory;
}

export function getEventsForMonth(
  year: number,
  month: number,
): CalendarEvent[] {
  return generateMonthlyCalendar(year, month);
}

export function getEventsForDate(
  events: CalendarEvent[],
  date: string,
): CalendarEvent[] {
  return events.filter((e) => e.date === date);
}

export function filterEvents(
  events: CalendarEvent[],
  filter: CalendarFilter,
): CalendarEvent[] {
  const market = filter.market ?? "all";
  const category = filter.category ?? "all";
  return events.filter((e) => {
    if (market !== "all" && e.market !== market) return false;
    if (category !== "all" && e.category !== category) return false;
    return true;
  });
}

export function getMonthlySummary(events: CalendarEvent[]): MonthlySummary {
  const byCategory: Record<CalendarCategory, number> = {
    earnings: 0,
    filing: 0,
    economic: 0,
    dividend: 0,
    shareholder_meeting: 0,
    market: 0,
    news: 0,
  };
  for (const e of events) byCategory[e.category] += 1;
  return { total: events.length, byCategory };
}

/**
 * 최근 자동 반영된 것처럼 보이는 일정 목록.
 * detectedAt(없으면 updatedAt) 기준 내림차순 N개.
 */
export function getRecentlyAddedEvents(
  events: CalendarEvent[],
  limit = 6,
): CalendarEvent[] {
  return [...events]
    .sort((a, b) => {
      const ta = new Date(a.detectedAt ?? a.updatedAt).getTime();
      const tb = new Date(b.detectedAt ?? b.updatedAt).getTime();
      return tb - ta;
    })
    .slice(0, limit);
}

export function groupEventsByDate(
  events: CalendarEvent[],
): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const list = map.get(e.date) ?? [];
    list.push(e);
    map.set(e.date, list);
  }
  return map;
}

/**
 * 월간 그리드 셀과 그 셀에 매핑된 이벤트 목록을 함께 반환.
 */
export function getEventsForCalendarGrid(
  year: number,
  month: number,
  filter: CalendarFilter = {},
  today: Date = new Date(),
) {
  const all = filterEvents(getEventsForMonth(year, month), filter);
  const grouped = groupEventsByDate(all);
  const cells = getCalendarGrid(year, month, today).map((cell) => ({
    ...cell,
    events: grouped.get(cell.date) ?? [],
  }));
  return { cells, events: all };
}

/**
 * 캘린더 데이터의 "최근 반영 시각" 추정 — 가장 최신의 lastRefreshedAt.
 */
export function getLastUpdatedAt(events: CalendarEvent[]): string {
  let latest = 0;
  for (const e of events) {
    const t = new Date(e.lastRefreshedAt ?? e.updatedAt).getTime();
    if (t > latest) latest = t;
  }
  return latest ? new Date(latest).toISOString() : new Date().toISOString();
}

// 사용자 화면용 라벨 export helpers (page에서 그대로 사용)
export { toIsoDate };

/**
 * 외부 데이터 → CalendarEvent 변환 파이프라인 구조.
 *
 * 각 ingest 함수는 현재 외부 API를 호출하지 않고 빈 배열 또는 샘플 이벤트를
 * 반환합니다. 나중에 OpenDART / SEC / 뉴스 / 실적 / 경제지표 / 시세 API와
 * lib/calendar/aiCalendarParser.ts 의 정리 함수를 결합하면 됩니다.
 *
 * 단계별 흐름:
 *   1) 외부 source → raw payload 수집
 *   2) aiCalendarParser → CalendarEvent 변환
 *   3) mergeAndDeduplicateEvents → 동일 일정 중복 제거
 *   4) calendarService 또는 Supabase 저장
 */

import type { CalendarEvent } from "@/lib/calendar/types";

export async function ingestNewDisclosures(): Promise<CalendarEvent[]> {
  // TODO: OpenDART list.json → parseDisclosureToCalendarEvent
  return [];
}

export async function ingestNewSecFilings(): Promise<CalendarEvent[]> {
  // TODO: SEC submissions → parseSecFilingToCalendarEvent
  return [];
}

export async function ingestNewNewsItems(): Promise<CalendarEvent[]> {
  // TODO: 뉴스 공급자 검색 → parseNewsToCalendarEvent
  return [];
}

export async function ingestNewEarningsSchedules(): Promise<CalendarEvent[]> {
  // TODO: 실적 일정 공급자 → parseEarningsDataToCalendarEvent
  return [];
}

export async function ingestEconomicCalendar(): Promise<CalendarEvent[]> {
  // TODO: 경제지표 캘린더 → parseEconomicIndicatorToCalendarEvent
  return [];
}

export async function ingestPriceRelatedEvents(): Promise<CalendarEvent[]> {
  // TODO: 시세 데이터에서 파생되는 일정 (예: 신고가 갱신) → CalendarEvent
  return [];
}

/**
 * 같은 날짜 + 같은 symbol + 같은 category + 비슷한 title 이면 중복으로 간주.
 */
export function mergeAndDeduplicateEvents(
  events: CalendarEvent[],
): CalendarEvent[] {
  const seen = new Map<string, CalendarEvent>();
  for (const e of events) {
    const key = [
      e.date,
      e.category,
      e.market,
      (e.symbol ?? "").toLowerCase(),
      normalizeTitle(e.title),
    ].join("|");
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, e);
      continue;
    }
    // 가장 신선한 정보를 유지
    const a = new Date(existing.lastRefreshedAt ?? existing.updatedAt).getTime();
    const b = new Date(e.lastRefreshedAt ?? e.updatedAt).getTime();
    if (b > a) seen.set(key, e);
  }
  return Array.from(seen.values());
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\s\-()[\]·,.:;'"]+/g, " ")
    .trim();
}

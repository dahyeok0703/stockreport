/**
 * 월간 캘린더 그리드 계산용 유틸.
 *
 * 모든 계산은 로컬 타임존 기준으로 동작합니다. 매월 1일이 되면 getCurrentMonth()가
 * 자연스럽게 새 월을 반환하므로, 페이지가 자동으로 새 월로 전환됩니다.
 */

export interface YearMonth {
  year: number;
  month: number; // 1~12
}

export interface CalendarCell {
  /** ISO yyyy-mm-dd */
  date: string;
  day: number; // 1~31
  /** true면 표시 월에 속한 날짜, false면 앞/뒤 달 패딩 */
  inCurrentMonth: boolean;
  isToday: boolean;
  weekday: number; // 0(일)~6(토)
}

export function getCurrentMonth(now: Date = new Date()): YearMonth {
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function getMonthDays(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getStartOfMonth(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

export function getEndOfMonth(year: number, month: number): Date {
  return new Date(year, month, 0);
}

export function isSameDate(a: Date | string, b: Date | string): boolean {
  const da = typeof a === "string" ? new Date(a + "T00:00:00") : a;
  const db = typeof b === "string" ? new Date(b + "T00:00:00") : b;
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export function isToday(date: Date | string, now: Date = new Date()): boolean {
  return isSameDate(date, now);
}

export function formatKoreanMonth(year: number, month: number): string {
  return `${year}년 ${month}월`;
}

export function formatKoreanDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date + "T00:00:00") : date;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]})`;
}

export function formatKoreanDateTime(iso: string | undefined | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]}) ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * 일요일~토요일 7열 기준으로, 표시 월 1일이 속한 주의 일요일부터
 * 표시 월 말일이 속한 주의 토요일까지의 셀 목록을 반환합니다.
 * 결과 길이는 35 또는 42 (5주 또는 6주).
 */
export function getCalendarGrid(
  year: number,
  month: number,
  today: Date = new Date(),
): CalendarCell[] {
  const start = getStartOfMonth(year, month);
  const end = getEndOfMonth(year, month);

  // start of week containing day 1
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - start.getDay());

  // end of week containing last day
  const gridEnd = new Date(end);
  gridEnd.setDate(end.getDate() + (6 - end.getDay()));

  const cells: CalendarCell[] = [];
  const cursor = new Date(gridStart);
  while (cursor <= gridEnd) {
    cells.push({
      date: toIsoDate(cursor),
      day: cursor.getDate(),
      inCurrentMonth: cursor.getMonth() === month - 1,
      isToday: isSameDate(cursor, today),
      weekday: cursor.getDay(),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return cells;
}

export function addMonths(year: number, month: number, delta: number): YearMonth {
  const base = new Date(year, month - 1 + delta, 1);
  return { year: base.getFullYear(), month: base.getMonth() + 1 };
}

export const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

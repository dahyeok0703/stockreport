"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import {
  addMonths,
  formatKoreanDate,
  formatKoreanDateTime,
  formatKoreanMonth,
  getCalendarGrid,
  getCurrentMonth,
  toIsoDate,
  WEEKDAY_LABELS,
  type CalendarCell,
} from "@/lib/calendar/dateUtils";
import type {
  CalendarApiResponse,
  CalendarCategory,
  CalendarEvent,
  CalendarMarket,
  MonthlySummary,
} from "@/lib/calendar/types";
import {
  CATEGORY_LABEL,
  MARKET_LABEL,
  REFRESH_STATE_LABEL,
} from "@/lib/calendar/types";

// ---------- filter config ----------

type FilterKey =
  | "all"
  | CalendarMarket
  | Exclude<CalendarCategory, "market">;

interface FilterOption {
  key: FilterKey;
  label: string;
  group: "market" | "category" | "all";
}

const FILTERS: FilterOption[] = [
  { key: "all", label: "전체", group: "all" },
  { key: "kr", label: "한국", group: "market" },
  { key: "us", label: "미국", group: "market" },
  { key: "global", label: "글로벌", group: "market" },
  { key: "earnings", label: "실적", group: "category" },
  { key: "filing", label: "공시", group: "category" },
  { key: "economic", label: "경제지표", group: "category" },
  { key: "dividend", label: "배당", group: "category" },
  { key: "shareholder_meeting", label: "주주총회", group: "category" },
  { key: "news", label: "뉴스", group: "category" },
];

// ---------- category styling ----------

const CATEGORY_BADGE: Record<CalendarCategory, string> = {
  earnings: "bg-brand-50 text-brand-800 border-brand-200",
  filing: "bg-emerald-50 text-emerald-800 border-emerald-200",
  economic: "bg-amber-50 text-amber-800 border-amber-200",
  dividend: "bg-violet-50 text-violet-800 border-violet-200",
  shareholder_meeting: "bg-rose-50 text-rose-800 border-rose-200",
  news: "bg-slate-100 text-slate-700 border-slate-200",
  market: "bg-cyan-50 text-cyan-800 border-cyan-200",
};

const CATEGORY_DOT: Record<CalendarCategory, string> = {
  earnings: "bg-brand-500",
  filing: "bg-emerald-500",
  economic: "bg-amber-500",
  dividend: "bg-violet-500",
  shareholder_meeting: "bg-rose-500",
  news: "bg-slate-400",
  market: "bg-cyan-500",
};

// ---------- page ----------

export default function CalendarPage() {
  const [ym, setYm] = useState<{ year: number; month: number } | null>(null);
  const [today, setToday] = useState<Date | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [data, setData] = useState<CalendarApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 최초 렌더 후 클라이언트 시각 기준으로 월/오늘을 결정 (hydration mismatch 방지)
  useEffect(() => {
    const now = new Date();
    setToday(now);
    setYm(getCurrentMonth(now));
  }, []);

  // 매월 1일이 자동으로 새 월로 전환되게 — 자정마다 현재 월을 다시 계산
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const cur = getCurrentMonth(now);
      setToday((prev) => (prev && prev.getDate() === now.getDate() ? prev : now));
      setYm((prev) => {
        if (!prev) return cur;
        if (prev.year !== cur.year || prev.month !== cur.month) {
          // 사용자가 다른 달을 보고 있지 않다면 자동 전환
          return cur;
        }
        return prev;
      });
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const load = useCallback(async () => {
    if (!ym) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        year: String(ym.year),
        month: String(ym.month),
        filter,
      });
      const res = await fetch(`/api/calendar?${params}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as CalendarApiResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "데이터를 불러오지 못했습니다");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [ym, filter]);

  useEffect(() => {
    void load();
  }, [load]);

  // 월이 바뀌면 선택 날짜는 해당 월의 오늘 (있다면) 또는 1일로 자동 선택
  useEffect(() => {
    if (!ym || !today) return;
    const isCurMonth =
      today.getFullYear() === ym.year && today.getMonth() + 1 === ym.month;
    if (isCurMonth) {
      setSelectedDate(toIsoDate(today));
    } else {
      setSelectedDate(toIsoDate(new Date(ym.year, ym.month - 1, 1)));
    }
  }, [ym, today]);

  const cells = useMemo(() => {
    if (!ym || !today) return [];
    return getCalendarGrid(ym.year, ym.month, today);
  }, [ym, today]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    if (!data) return map;
    for (const e of data.events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [data]);

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsByDate.get(selectedDate) ?? [];
  }, [eventsByDate, selectedDate]);

  const onPrev = () => ym && setYm(addMonths(ym.year, ym.month, -1));
  const onNext = () => ym && setYm(addMonths(ym.year, ym.month, 1));
  const onThisMonth = () => setYm(getCurrentMonth(new Date()));

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        eyebrow="시장 일정"
        title="시장 일정 캘린더"
        description="캘린더 일정은 공시·뉴스·실적·경제지표 정보를 기준으로 주기적으로 정리됩니다."
      />

      {/* 헤더 */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            aria-label="이전 달"
          >
            ←
          </button>
          <span className="min-w-[8rem] text-center text-lg font-bold tabular-nums text-slate-900">
            {ym ? formatKoreanMonth(ym.year, ym.month) : "—"}
          </span>
          <button
            type="button"
            onClick={onNext}
            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            aria-label="다음 달"
          >
            →
          </button>
          <button
            type="button"
            onClick={onThisMonth}
            className="ml-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            이번 달
          </button>
        </div>

        <div className="text-xs text-slate-500">
          최근 반영 시각 ·{" "}
          <span className="text-slate-700">
            {data?.lastUpdatedAt
              ? formatKoreanDateTime(data.lastUpdatedAt)
              : "—"}
          </span>
        </div>
      </div>

      {/* 필터 */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              filter === f.key
                ? "border-brand-600 bg-brand-50 text-brand-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 본문: 데스크톱 = 캘린더 + 사이드, 모바일 = 세로 스택 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <CalendarGrid
          cells={cells}
          eventsByDate={eventsByDate}
          selectedDate={selectedDate}
          onSelectDate={(d) => setSelectedDate(d)}
          loading={loading}
        />
        <DetailPanel
          selectedDate={selectedDate}
          events={selectedEvents}
          loading={loading}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          데이터를 불러오는 중 문제가 있었습니다 ({error}). 잠시 후 다시
          시도해 주세요.
        </div>
      )}

      {/* 하단: 최근 등록 일정 + 월간 요약 */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <RecentlyAdded events={data?.recentlyAddedEvents ?? []} />
        <MonthlySummaryCard summary={data?.monthlySummary} ym={ym} />
      </div>

      {/* 자동 갱신 상태 — 자연스러운 한국어로 변환 표시 */}
      {data?.refreshStatus && data.refreshStatus.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            자동 수집 정보
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {data.refreshStatus.map((s) => (
              <span
                key={s.provider}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700"
              >
                <span className="font-medium">{providerLabel(s.provider)}</span>
                <span className="text-slate-400">·</span>
                <span>{REFRESH_STATE_LABEL[s.status]}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <DisclaimerBox />
      </div>
    </div>
  );
}

// ---------- subcomponents ----------

function CalendarGrid({
  cells,
  eventsByDate,
  selectedDate,
  onSelectDate,
  loading,
}: {
  cells: CalendarCell[];
  eventsByDate: Map<string, CalendarEvent[]>;
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
  loading: boolean;
}) {
  if (cells.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="h-96 animate-pulse rounded bg-slate-50" />
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
      {/* weekday header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center">
        {WEEKDAY_LABELS.map((w, i) => (
          <div
            key={w}
            className={`px-1 py-2 text-xs font-semibold ${
              i === 0
                ? "text-rose-500"
                : i === 6
                  ? "text-brand-700"
                  : "text-slate-600"
            }`}
          >
            {w}
          </div>
        ))}
      </div>
      <div
        className={`grid grid-cols-7 ${loading ? "opacity-70" : ""}`}
        role="grid"
      >
        {cells.map((cell) => {
          const events = eventsByDate.get(cell.date) ?? [];
          const isSelected = selectedDate === cell.date;
          return (
            <button
              type="button"
              key={cell.date}
              onClick={() => onSelectDate(cell.date)}
              className={`flex min-h-[88px] flex-col items-stretch gap-1 border-b border-r border-slate-100 px-1.5 py-1.5 text-left last:border-r-0 sm:min-h-[104px] ${
                !cell.inCurrentMonth ? "bg-slate-50/40" : "bg-white"
              } ${isSelected ? "ring-2 ring-brand-500" : ""} hover:bg-brand-50/40`}
              aria-selected={isSelected}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full text-xs font-medium tabular-nums ${
                    cell.isToday
                      ? "bg-brand-700 text-white"
                      : cell.inCurrentMonth
                        ? cell.weekday === 0
                          ? "text-rose-500"
                          : cell.weekday === 6
                            ? "text-brand-700"
                            : "text-slate-700"
                        : "text-slate-300"
                  }`}
                >
                  {cell.day}
                </span>
                {events.length > 0 && (
                  <span className="text-[10px] text-slate-400">
                    {events.length}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                {events.slice(0, 2).map((e) => (
                  <span
                    key={e.id}
                    className={`flex items-center gap-1 truncate rounded-sm border px-1 py-0.5 text-[10px] font-medium ${CATEGORY_BADGE[e.category]}`}
                    title={e.title}
                  >
                    <span
                      className={`inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${CATEGORY_DOT[e.category]}`}
                    />
                    <span className="truncate">
                      {e.companyName ?? CATEGORY_LABEL[e.category]}
                    </span>
                  </span>
                ))}
                {events.length > 2 && (
                  <span className="text-[10px] font-medium text-slate-500">
                    +{events.length - 2}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailPanel({
  selectedDate,
  events,
  loading,
}: {
  selectedDate: string | null;
  events: CalendarEvent[];
  loading: boolean;
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:sticky lg:top-20 lg:h-fit">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
        일정 상세
      </h3>
      <p className="mt-1 text-base font-bold text-slate-900">
        {selectedDate ? formatKoreanDate(selectedDate) : "날짜를 선택하세요"}
      </p>

      <div className="mt-4 space-y-3">
        {loading && (
          <div className="space-y-2">
            <div className="h-20 animate-pulse rounded-lg bg-slate-50" />
            <div className="h-20 animate-pulse rounded-lg bg-slate-50" />
          </div>
        )}
        {!loading && events.length === 0 && (
          <p className="text-sm text-slate-600">
            선택한 날짜에 표시할 주요 일정이 없습니다.
          </p>
        )}
        {!loading && events.map((e) => <EventCard key={e.id} event={e} />)}
      </div>
    </aside>
  );
}

function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${CATEGORY_BADGE[event.category]}`}
        >
          {CATEGORY_LABEL[event.category]}
        </span>
        <span className="badge-slate">{MARKET_LABEL[event.market]}</span>
        {event.symbol && (
          <span className="badge-outline">{event.symbol}</span>
        )}
      </div>
      <h4 className="mt-2 text-sm font-semibold text-slate-900">
        {event.title}
      </h4>
      {event.companyName && (
        <p className="mt-0.5 text-xs text-slate-500">{event.companyName}</p>
      )}
      <p className="mt-2 text-sm leading-6 text-slate-700">
        {event.description}
      </p>
      {event.checkpoints && event.checkpoints.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            주요 체크포인트
          </p>
          <ul className="mt-1 space-y-1">
            {event.checkpoints.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-xs text-slate-700"
              >
                <span className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-brand-600" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          {event.sourceLabel && `정보 출처 · ${event.sourceLabel}`}
        </span>
        {event.sourceUrl && event.sourceUrl !== "#" ? (
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-700 hover:text-brand-900 hover:underline"
          >
            원문 →
          </a>
        ) : (
          <span className="text-slate-400">원문 확인 필요</span>
        )}
      </div>
      {event.lastRefreshedAt && (
        <p className="mt-1 text-[10px] text-slate-400">
          데이터 기준 · {formatKoreanDateTime(event.lastRefreshedAt)}
        </p>
      )}
    </article>
  );
}

function RecentlyAdded({ events }: { events: CalendarEvent[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <h3 className="text-base font-bold text-slate-900">최근 등록 일정</h3>
      <p className="mt-1 text-xs text-slate-500">
        가장 최근에 캘린더에 정리된 일정 목록입니다.
      </p>
      {events.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          최근 등록된 일정이 없습니다.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-200">
          {events.map((e) => (
            <li
              key={e.id}
              className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${CATEGORY_BADGE[e.category]}`}
                >
                  {CATEGORY_LABEL[e.category]}
                </span>
                <span className="badge-slate">{MARKET_LABEL[e.market]}</span>
                <span className="text-sm font-medium text-slate-900">
                  {e.title}
                </span>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {e.date}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MonthlySummaryCard({
  summary,
  ym,
}: {
  summary: MonthlySummary | undefined;
  ym: { year: number; month: number } | null;
}) {
  const rows: { key: CalendarCategory; label: string }[] = [
    { key: "earnings", label: "실적 일정" },
    { key: "filing", label: "공시 일정" },
    { key: "economic", label: "경제지표 일정" },
    { key: "dividend", label: "배당 일정" },
    { key: "shareholder_meeting", label: "주주총회 일정" },
    { key: "news", label: "뉴스성 일정" },
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <h3 className="text-base font-bold text-slate-900">
        {ym ? `${formatKoreanMonth(ym.year, ym.month)} 요약` : "월간 요약"}
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        현재 필터 기준 카테고리별 일정 수입니다.
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
          >
            <dt className="text-xs text-slate-500">{row.label}</dt>
            <dd className="mt-1 text-xl font-bold tabular-nums text-slate-900">
              {summary?.byCategory[row.key] ?? 0}
              <span className="ml-1 text-sm font-normal text-slate-500">건</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-slate-500">
        합계 · {summary?.total ?? 0}건
      </p>
    </section>
  );
}

function providerLabel(p: string): string {
  switch (p) {
    case "opendart":
      return "DART 공시";
    case "sec":
      return "SEC 공시";
    case "news":
      return "뉴스";
    case "earnings":
      return "실적 일정";
    case "economic":
      return "경제지표";
    case "price":
      return "시장 데이터";
    default:
      return p;
  }
}

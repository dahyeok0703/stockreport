import { NextResponse, type NextRequest } from "next/server";
import {
  filterEvents,
  getEventsForMonth,
  getLastUpdatedAt,
  getMonthlySummary,
  getRecentlyAddedEvents,
} from "@/lib/calendar/calendarService";
import { getLastRefreshStatus } from "@/lib/calendar/calendarScheduler";
import type {
  CalendarApiResponse,
  CalendarCategory,
  CalendarMarket,
} from "@/lib/calendar/types";

export const dynamic = "force-dynamic";

const CATEGORY_VALUES: CalendarCategory[] = [
  "earnings",
  "filing",
  "economic",
  "dividend",
  "shareholder_meeting",
  "market",
  "news",
];
const MARKET_VALUES: CalendarMarket[] = ["kr", "us", "global"];

function parseInt32(v: string | null, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}

export async function GET(req: NextRequest): Promise<NextResponse<CalendarApiResponse>> {
  const url = req.nextUrl;
  const now = new Date();
  const year = parseInt32(url.searchParams.get("year"), now.getFullYear());
  const month = Math.min(
    12,
    Math.max(1, parseInt32(url.searchParams.get("month"), now.getMonth() + 1)),
  );
  const rawFilter = (url.searchParams.get("filter") ?? "all").toLowerCase();

  const all = getEventsForMonth(year, month);

  // 단일 filter 파라미터로 market + category 동시 표현 (예: "all", "kr", "earnings")
  let market: "all" | CalendarMarket = "all";
  let category: "all" | CalendarCategory = "all";
  if (rawFilter === "all") {
    // noop
  } else if ((MARKET_VALUES as string[]).includes(rawFilter)) {
    market = rawFilter as CalendarMarket;
  } else if ((CATEGORY_VALUES as string[]).includes(rawFilter)) {
    category = rawFilter as CalendarCategory;
  }

  const filtered = filterEvents(all, { market, category });

  const body: CalendarApiResponse = {
    ok: true,
    year,
    month,
    events: filtered,
    monthlySummary: getMonthlySummary(filtered),
    recentlyAddedEvents: getRecentlyAddedEvents(filtered),
    lastUpdatedAt: getLastUpdatedAt(filtered),
    refreshStatus: getLastRefreshStatus(),
  };

  return NextResponse.json(body);
}

/**
 * 알림 피드 — mockStocks 데이터에서 공시·뉴스·실적 발표를 시간순으로
 * 평탄화해 하나의 알림 목록으로 만듭니다.
 *
 * 후속 단계에서 OpenDART / SEC / 뉴스 API + Supabase 캐시로 교체되면
 * 이 함수의 반환 형식만 유지하면 화면 코드는 그대로 동작합니다.
 */

import { mockStocks } from "@/lib/mockStocks";

export type AlertType = "filing" | "earnings" | "news";

export interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  market: "kr" | "us";
  symbol: string;
  companyName: string;
  /** ISO date (yyyy-mm-dd) or full ISO if available */
  publishedAt: string;
  summary?: string | null;
  publisher?: string | null;
  sourceUrl?: string;
  reportHref: string;
}

function alertId(type: AlertType, symbol: string, key: string): string {
  return `${type}:${symbol}:${key}`;
}

function buildAlerts(): AlertItem[] {
  const list: AlertItem[] = [];
  for (const s of mockStocks ?? []) {
    const reportHref = `/stocks/${s.market}/${s.symbol}`;
    for (const d of s.recentDisclosures ?? []) {
      list.push({
        id: alertId("filing", s.symbol, d.id),
        type: "filing",
        title: d.title,
        market: s.market,
        symbol: s.symbol,
        companyName: s.name,
        publishedAt: d.date,
        summary: d.summary,
        publisher: s.market === "kr" ? "OpenDART" : "SEC EDGAR",
        sourceUrl: d.sourceUrl,
        reportHref,
      });
    }
    for (const n of s.recentNews ?? []) {
      list.push({
        id: alertId("news", s.symbol, n.id),
        type: "news",
        title: n.title,
        market: s.market,
        symbol: s.symbol,
        companyName: s.name,
        publishedAt: n.date,
        summary: n.summary,
        publisher: n.press,
        sourceUrl: n.sourceUrl,
        reportHref,
      });
    }
    if (s.earningsSummary) {
      const e = s.earningsSummary;
      list.push({
        id: alertId("earnings", s.symbol, e.id),
        type: "earnings",
        title: `${s.name} ${e.period} 실적 발표 요약`,
        market: s.market,
        symbol: s.symbol,
        companyName: s.name,
        // 실적 요약은 별도 날짜가 없는 경우 마지막 업데이트 일자 사용
        publishedAt: s.lastUpdated?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        summary: `매출 ${e.revenue} · 영업이익 ${e.operatingProfit} · 순이익 ${e.netProfit} (전년 동기 대비 매출 ${e.yoyRevenue})`,
        publisher: "기업 IR",
        sourceUrl: "#",
        reportHref,
      });
    }
  }
  // 최신순 정렬
  list.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return list;
}

let cached: AlertItem[] | null = null;

export function getAllAlerts(): AlertItem[] {
  if (!cached) cached = buildAlerts();
  return cached;
}

export function getAlertsByType(type: AlertType | "all"): AlertItem[] {
  const all = getAllAlerts();
  return type === "all" ? all : all.filter((a) => a.type === type);
}

export function getAlertsForSymbols(symbols: Set<string>): AlertItem[] {
  if (symbols.size === 0) return [];
  return getAllAlerts().filter((a) =>
    symbols.has(`${a.market}:${a.symbol.toLowerCase()}`),
  );
}

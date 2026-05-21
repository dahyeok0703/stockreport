/**
 * 기존 lib/mockStocks.ts 데이터를 NormalizedX 포맷으로 변환해주는 어댑터.
 * 실제 외부 API가 실패하거나 비활성화일 때 fallback으로 사용됩니다.
 */

import { getStockBy } from "@/lib/mockStocks";
import type {
  NormalizedFiling,
  NormalizedFinancialMetric,
  NormalizedNewsItem,
  NormalizedStock,
  NormalizedEarnings,
  StockMarket,
} from "@/lib/providers/types";

export function getMockStock(
  market: StockMarket,
  symbol: string,
): NormalizedStock | null {
  const s = getStockBy(market, symbol);
  if (!s) return null;
  return {
    name: s.name,
    symbol: s.symbol,
    market: s.market,
    exchange: s.exchange ?? null,
    country: s.country,
    sector: s.sector ?? null,
    industry: s.industry ?? null,
    description: s.description ?? null,
  };
}

export function getMockSummary(market: StockMarket, symbol: string): string {
  const s = getStockBy(market, symbol);
  return (
    s?.businessSummary ??
    "회사 개요 데이터를 아직 불러오지 못했습니다. 원문을 직접 확인해 주세요."
  );
}

export function getMockFilings(
  market: StockMarket,
  symbol: string,
): NormalizedFiling[] {
  const s = getStockBy(market, symbol);
  if (!s) return [];
  return (s.recentDisclosures ?? []).map((d, i) => ({
    id: `mock-filing-${i}-${d.id}`,
    title: d.title,
    formType: "공시",
    filingDate: d.date,
    reportDate: null,
    source: "mock",
    sourceUrl: d.sourceUrl,
    rawSummary: d.summary,
    importantFields: (d.checkpoints ?? []).map((c) => ({
      label: "확인할 항목",
      value: c,
    })),
  }));
}

export function getMockNews(
  market: StockMarket,
  symbol: string,
): NormalizedNewsItem[] {
  const s = getStockBy(market, symbol);
  if (!s) return [];
  return (s.recentNews ?? []).map((n, i) => ({
    id: `mock-news-${i}-${n.id}`,
    title: n.title,
    publisher: n.press,
    publishedAt: n.date,
    url: n.sourceUrl,
    summary: n.summary,
    relatedTickers: [s.symbol],
    keywords: n.keywords ?? [],
  }));
}

export function getMockFinancials(
  market: StockMarket,
  symbol: string,
): NormalizedFinancialMetric[] {
  const s = getStockBy(market, symbol);
  if (!s) return [];
  return (s.financialMetrics ?? []).map((m) => ({
    label: m.label,
    value: m.value,
    unit: null,
    period: null,
    source: "mock",
    rawName: m.label,
  }));
}

export function getMockEarnings(
  market: StockMarket,
  symbol: string,
): NormalizedEarnings | null {
  const s = getStockBy(market, symbol);
  if (!s?.earningsSummary) return null;
  const e = s.earningsSummary;
  return {
    period: e.period,
    revenue: {
      label: "매출",
      value: e.revenue,
      unit: null,
      period: e.period,
      source: "mock",
      rawName: "revenue",
    },
    operatingProfit: {
      label: "영업이익",
      value: e.operatingProfit,
      unit: null,
      period: e.period,
      source: "mock",
      rawName: "operatingProfit",
    },
    netProfit: {
      label: "순이익",
      value: e.netProfit,
      unit: null,
      period: e.period,
      source: "mock",
      rawName: "netProfit",
    },
    yoyRevenue: e.yoyRevenue,
    yoyOperatingProfit: e.yoyOperatingProfit,
  };
}

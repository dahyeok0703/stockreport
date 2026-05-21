/**
 * 정규화된 종목 리포트 → AI 입력용 압축 페이로드.
 * raw 응답은 절대 보내지 않고, 요약에 필요한 필드만 추려서 길이를 제한합니다.
 */

import { clipList, clipText } from "@/lib/ai/sanitize";
import type {
  NormalizedFiling,
  NormalizedFinancialMetric,
  NormalizedNewsItem,
  NormalizedStockReport,
} from "@/lib/providers/types";

export interface CompactStockInput {
  market: string;
  symbol: string;
  name: string;
  exchange?: string | null;
  sector?: string | null;
  industry?: string | null;
  overview?: string;
  filings?: Array<{
    title: string;
    formType: string;
    filingDate: string;
    summary?: string | null;
    importantFields?: Array<{ label: string; value: string }>;
  }>;
  news?: Array<{
    title: string;
    publisher?: string | null;
    publishedAt?: string;
    summary?: string | null;
  }>;
  financials?: Array<{
    label: string;
    value: string;
    period?: string | null;
    unit?: string | null;
    rawName?: string | null;
  }>;
  earnings?: {
    period: string;
    revenue?: string | null;
    operatingProfit?: string | null;
    netProfit?: string | null;
  } | null;
  sourceLinks?: Array<{ category: string; label: string; href: string }>;
}

export interface BudgetedInput {
  payload: CompactStockInput;
  /** 직렬화된 문자열 길이 (AI_MAX_INPUT_CHARS 비교용) */
  serializedLength: number;
  truncated: boolean;
}

export function compactStockReport(
  r: NormalizedStockReport,
  opts: { maxFilings?: number; maxNews?: number; maxFinancials?: number } = {},
): CompactStockInput {
  const maxFilings = opts.maxFilings ?? 8;
  const maxNews = opts.maxNews ?? 8;
  const maxFinancials = opts.maxFinancials ?? 10;

  return {
    market: r.stock.market,
    symbol: r.stock.symbol,
    name: r.stock.name,
    exchange: r.stock.exchange,
    sector: r.stock.sector,
    industry: r.stock.industry,
    overview: clipText(r.summary, 600),
    filings: r.filings.slice(0, maxFilings).map((f) => ({
      title: clipText(f.title, 140),
      formType: f.formType,
      filingDate: f.filingDate,
      summary: clipText(f.rawSummary, 240) || null,
      importantFields: (f.importantFields ?? [])
        .slice(0, 4)
        .map((x) => ({
          label: clipText(x.label, 32),
          value: clipText(x.value, 120),
        })),
    })),
    news: r.news.slice(0, maxNews).map((n) => ({
      title: clipText(n.title, 160),
      publisher: n.publisher,
      publishedAt: n.publishedAt,
      summary: clipText(n.summary, 240) || null,
    })),
    financials: r.financials.slice(0, maxFinancials).map((m) => ({
      label: m.label,
      value: clipText(m.value, 64),
      period: m.period ?? null,
      unit: m.unit ?? null,
      rawName: m.rawName ?? null,
    })),
    earnings: r.earnings
      ? {
          period: r.earnings.period,
          revenue: r.earnings.revenue?.value ?? null,
          operatingProfit: r.earnings.operatingProfit?.value ?? null,
          netProfit: r.earnings.netProfit?.value ?? null,
        }
      : null,
    sourceLinks: (r.sourceLinks ?? []).slice(0, 6).map((s) => ({
      category: s.category,
      label: clipText(s.label, 64),
      href: s.href,
    })),
  };
}

export function compactFilings(
  filings: NormalizedFiling[],
  max = 10,
): CompactStockInput["filings"] {
  return filings.slice(0, max).map((f) => ({
    title: clipText(f.title, 140),
    formType: f.formType,
    filingDate: f.filingDate,
    summary: clipText(f.rawSummary, 240) || null,
    importantFields: (f.importantFields ?? [])
      .slice(0, 4)
      .map((x) => ({
        label: clipText(x.label, 32),
        value: clipText(x.value, 120),
      })),
  }));
}

export function compactNews(
  news: NormalizedNewsItem[],
  max = 12,
): CompactStockInput["news"] {
  return news.slice(0, max).map((n) => ({
    title: clipText(n.title, 160),
    publisher: n.publisher,
    publishedAt: n.publishedAt,
    summary: clipText(n.summary, 240) || null,
  }));
}

export function compactFinancials(
  metrics: NormalizedFinancialMetric[],
  max = 12,
): CompactStockInput["financials"] {
  return metrics.slice(0, max).map((m) => ({
    label: m.label,
    value: clipText(m.value, 64),
    period: m.period ?? null,
    unit: m.unit ?? null,
    rawName: m.rawName ?? null,
  }));
}

/**
 * AI에 보낼 직렬화 후 길이를 AI_MAX_INPUT_CHARS 이하로 줄입니다.
 * 우선순위가 낮은 필드(filings importantFields → 오래된 news/filings → 회사 개요 길이)를
 * 단계적으로 잘라냅니다.
 */
export function fitToBudget(
  payload: CompactStockInput,
  maxChars: number,
): BudgetedInput {
  const clone: CompactStockInput = JSON.parse(JSON.stringify(payload));
  let truncated = false;

  const measure = () => JSON.stringify(clone).length;

  if (measure() <= maxChars) {
    return { payload: clone, serializedLength: measure(), truncated };
  }

  // 1) 모든 filing의 importantFields 제거
  for (const f of clone.filings ?? []) f.importantFields = [];
  truncated = true;
  if (measure() <= maxChars) return { payload: clone, serializedLength: measure(), truncated };

  // 2) news / filings를 절반으로 감축
  if (clone.news) clone.news = clone.news.slice(0, Math.max(3, Math.floor(clone.news.length / 2)));
  if (clone.filings) clone.filings = clone.filings.slice(0, Math.max(3, Math.floor(clone.filings.length / 2)));
  if (measure() <= maxChars) return { payload: clone, serializedLength: measure(), truncated };

  // 3) overview 길이 축소
  if (clone.overview) clone.overview = clipText(clone.overview, 240);
  if (measure() <= maxChars) return { payload: clone, serializedLength: measure(), truncated };

  // 4) 마지막 안전 컷
  if (clone.news) clone.news = clone.news.slice(0, 3);
  if (clone.filings) clone.filings = clone.filings.slice(0, 3);
  if (clone.financials) clone.financials = clone.financials.slice(0, 6);

  return { payload: clone, serializedLength: measure(), truncated };
}

void clipList; // exported helper for callers

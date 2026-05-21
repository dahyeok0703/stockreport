/**
 * 뉴스 공급자 어댑터.
 *
 * 환경변수 NEWS_PROVIDER 로 mock/newsapi/brave/gnews 선택.
 * 키가 없거나 호출 실패 시 호출부(stockDataService)가 mock으로 fallback.
 *
 * 저장 원칙:
 *  - 제목, 출처, 게재일, URL, 짧은 요약만 사용합니다.
 *  - 기사 본문 전체를 저장하지 않습니다.
 */

import { getNewsProviderConfig } from "@/lib/config/env";
import { CACHE_TTL_SECONDS, getOrSetCache } from "@/lib/data/cache";
import { ExternalApiError, fetchExternal } from "@/lib/providers/http";
import type {
  NormalizedNewsItem,
  StockMarket,
} from "@/lib/providers/types";

export interface NewsQuery {
  market: StockMarket;
  name: string;
  symbol: string;
  days?: number;
  limit?: number;
}

interface RawNewsItem {
  title: string;
  url: string;
  publisher?: string | null;
  publishedAt?: string | null;
  summary?: string | null;
}

function trimSummary(s: string | null | undefined, max = 220): string | null {
  if (!s) return null;
  const t = s.trim();
  if (t.length <= max) return t;
  return t.slice(0, max) + "…";
}

function toNormalized(
  raw: RawNewsItem[],
  symbol: string,
  market: StockMarket,
  name: string,
): NormalizedNewsItem[] {
  return raw.map((r, i) => ({
    id: `news-${market}-${symbol}-${i}-${hashStr(r.url)}`,
    title: r.title,
    publisher: r.publisher ?? null,
    publishedAt: r.publishedAt ?? new Date().toISOString(),
    url: r.url,
    summary: trimSummary(r.summary),
    relatedTickers: [symbol],
    keywords: [name],
  }));
}

function hashStr(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

function buildQuery(query: NewsQuery): string {
  if (query.market === "kr") {
    return `${query.name} 공시 OR 실적`;
  }
  return `${query.symbol} ${query.name} earnings OR news`;
}

/**
 * 외부 뉴스 가져오기 진입점.
 * provider가 mock이면 빈 배열을 반환합니다 (호출부에서 mock provider로 처리).
 */
export async function fetchNews(
  query: NewsQuery,
): Promise<NormalizedNewsItem[]> {
  const { provider, apiKey } = getNewsProviderConfig();
  if (provider === "mock" || !apiKey) return [];

  const limit = query.limit ?? 8;
  const days = query.days ?? 14;
  const q = buildQuery(query);
  const cacheKey = `news:${provider}:${query.market}:${query.symbol}:${days}:${limit}`;

  return getOrSetCache<NormalizedNewsItem[]>(
    cacheKey,
    `news:${provider}`,
    `/search`,
    { q, days, limit },
    CACHE_TTL_SECONDS.news,
    async () => {
      switch (provider) {
        case "newsapi":
          return fetchFromNewsApi(q, days, limit, apiKey, query);
        case "brave":
          return fetchFromBraveSearch(q, limit, apiKey, query);
        case "gnews":
          return fetchFromGNews(q, days, limit, apiKey, query);
        default:
          return [];
      }
    },
  );
}

// ---------------------------------------------------------
// NewsAPI.org
// ---------------------------------------------------------
interface NewsApiResponse {
  status: string;
  articles?: Array<{
    title: string;
    url: string;
    description: string | null;
    publishedAt: string;
    source?: { name: string | null };
  }>;
  message?: string;
}

async function fetchFromNewsApi(
  q: string,
  days: number,
  limit: number,
  apiKey: string,
  query: NewsQuery,
): Promise<NormalizedNewsItem[]> {
  const from = new Date();
  from.setDate(from.getDate() - days);
  const params = new URLSearchParams({
    q,
    from: from.toISOString().slice(0, 10),
    sortBy: "publishedAt",
    language: query.market === "kr" ? "ko" : "en",
    pageSize: String(limit),
    apiKey,
  });
  const url = `https://newsapi.org/v2/everything?${params}`;
  const data = await fetchExternal<NewsApiResponse>(url);
  if (data.status !== "ok") {
    throw new ExternalApiError(
      `NewsAPI error: ${data.message ?? data.status}`,
      undefined,
      "news:newsapi",
    );
  }
  const raw = (data.articles ?? []).slice(0, limit).map((a) => ({
    title: a.title,
    url: a.url,
    publisher: a.source?.name ?? null,
    publishedAt: a.publishedAt,
    summary: a.description,
  }));
  return toNormalized(raw, query.symbol, query.market, query.name);
}

// ---------------------------------------------------------
// Brave Search News
// ---------------------------------------------------------
interface BraveSearchResponse {
  results?: Array<{
    title: string;
    url: string;
    description?: string;
    age?: string;
    page_age?: string;
    meta_url?: { hostname?: string };
    extra_snippets?: string[];
  }>;
}

async function fetchFromBraveSearch(
  q: string,
  limit: number,
  apiKey: string,
  query: NewsQuery,
): Promise<NormalizedNewsItem[]> {
  const params = new URLSearchParams({
    q,
    count: String(limit),
    freshness: "pw",
  });
  const url = `https://api.search.brave.com/res/v1/news/search?${params}`;
  const data = await fetchExternal<BraveSearchResponse>(url, {
    headers: {
      "X-Subscription-Token": apiKey,
      Accept: "application/json",
    },
  });
  const raw = (data.results ?? []).slice(0, limit).map((r) => ({
    title: r.title,
    url: r.url,
    publisher: r.meta_url?.hostname ?? null,
    publishedAt: r.page_age ?? null,
    summary: r.description ?? null,
  }));
  return toNormalized(raw, query.symbol, query.market, query.name);
}

// ---------------------------------------------------------
// GNews
// ---------------------------------------------------------
interface GNewsResponse {
  totalArticles?: number;
  articles?: Array<{
    title: string;
    url: string;
    description: string | null;
    publishedAt: string;
    source?: { name: string | null };
  }>;
  errors?: string[];
}

async function fetchFromGNews(
  q: string,
  days: number,
  limit: number,
  apiKey: string,
  query: NewsQuery,
): Promise<NormalizedNewsItem[]> {
  const params = new URLSearchParams({
    q,
    lang: query.market === "kr" ? "ko" : "en",
    max: String(limit),
    in: "title,description",
    apikey: apiKey,
  });
  // `from` query supported on paid tier; free tier ignores it.
  void days;
  const url = `https://gnews.io/api/v4/search?${params}`;
  const data = await fetchExternal<GNewsResponse>(url);
  if (data.errors?.length) {
    throw new ExternalApiError(
      `GNews error: ${data.errors.join(", ")}`,
      undefined,
      "news:gnews",
    );
  }
  const raw = (data.articles ?? []).slice(0, limit).map((a) => ({
    title: a.title,
    url: a.url,
    publisher: a.source?.name ?? null,
    publishedAt: a.publishedAt,
    summary: a.description,
  }));
  return toNormalized(raw, query.symbol, query.market, query.name);
}

/**
 * SEC EDGAR 클라이언트.
 *
 * 사용 엔드포인트:
 *  - submissions: https://data.sec.gov/submissions/CIK##########.json
 *  - companyfacts: https://data.sec.gov/api/xbrl/companyfacts/CIK##########.json
 *  - ticker→CIK:  https://www.sec.gov/files/company_tickers.json (대용량)
 *
 * 요청은 반드시 SEC_USER_AGENT 헤더를 포함합니다 (SEC fair-access 정책).
 * 10 req/sec 미만으로 호출하기 위해 lib/rateLimit/secRateLimit.ts 사용.
 */

import { getSecUserAgent } from "@/lib/config/env";
import { CACHE_TTL_SECONDS, getOrSetCache } from "@/lib/data/cache";
import {
  findStockMapping,
  getCikFromSeed,
} from "@/lib/data/stockMappings";
import { ExternalApiError, fetchExternal } from "@/lib/providers/http";
import { acquireSecSlot } from "@/lib/rateLimit/secRateLimit";

export function padCik(cik: string | number): string {
  const digits = String(cik).replace(/[^0-9]/g, "");
  return digits.padStart(10, "0");
}

function assertUserAgent(): string {
  const ua = getSecUserAgent();
  if (!ua) {
    throw new ExternalApiError(
      "SEC_USER_AGENT 환경 변수가 비어 있거나 이메일을 포함하지 않습니다",
      undefined,
      "sec",
    );
  }
  return ua;
}

export async function getCikByTicker(ticker: string): Promise<string | null> {
  // 1) Supabase 매핑 우선
  const mapping = await findStockMapping("us", ticker);
  if (mapping?.sec_cik) return padCik(mapping.sec_cik);

  // 2) seed mapping
  const seed = getCikFromSeed(ticker);
  if (seed) return padCik(seed);

  // 3) company_tickers.json 전체 다운로드는 대용량 → 1단계 C 범위 밖.
  return null;
}

export interface SecRecentFilings {
  accessionNumber: string[];
  filingDate: string[];
  reportDate: string[];
  form: string[];
  primaryDocument: string[];
  primaryDocDescription: string[];
}

export interface SecSubmissionsResponse {
  cik: string;
  name?: string;
  sic?: string;
  sicDescription?: string;
  tickers?: string[];
  exchanges?: string[];
  filings?: {
    recent?: SecRecentFilings;
  };
}

export async function fetchSecSubmissions(
  cik: string,
): Promise<SecSubmissionsResponse> {
  const padded = padCik(cik);
  const cacheKey = `sec:submissions:${padded}`;

  return getOrSetCache<SecSubmissionsResponse>(
    cacheKey,
    "sec",
    "/submissions",
    { cik: padded },
    CACHE_TTL_SECONDS.secSubmissions,
    async () => {
      const ua = assertUserAgent();
      await acquireSecSlot();
      return fetchExternal<SecSubmissionsResponse>(
        `https://data.sec.gov/submissions/CIK${padded}.json`,
        { headers: { "User-Agent": ua } },
      );
    },
  );
}

export interface SecFactUnitEntry {
  end: string;
  val: number;
  accn: string;
  fy?: number;
  fp?: string; // FY/Q1/Q2/Q3
  form?: string;
  filed?: string;
}

export interface SecFact {
  label?: string;
  description?: string;
  units?: Record<string, SecFactUnitEntry[]>;
}

export interface SecCompanyFactsResponse {
  cik: number;
  entityName?: string;
  facts?: {
    "us-gaap"?: Record<string, SecFact>;
    dei?: Record<string, SecFact>;
  };
}

export async function fetchSecCompanyFacts(
  cik: string,
): Promise<SecCompanyFactsResponse> {
  const padded = padCik(cik);
  const cacheKey = `sec:companyfacts:${padded}`;

  return getOrSetCache<SecCompanyFactsResponse>(
    cacheKey,
    "sec",
    "/api/xbrl/companyfacts",
    { cik: padded },
    CACHE_TTL_SECONDS.secCompanyFacts,
    async () => {
      const ua = assertUserAgent();
      await acquireSecSlot();
      return fetchExternal<SecCompanyFactsResponse>(
        `https://data.sec.gov/api/xbrl/companyfacts/CIK${padded}.json`,
        { headers: { "User-Agent": ua } },
      );
    },
  );
}

/**
 * 후보 GAAP tag 중 가장 먼저 매치되는 것의 최신 USD 값 반환.
 */
export function pickLatestUsdFact(
  facts: SecCompanyFactsResponse["facts"],
  candidates: string[],
): { tag: string; entry: SecFactUnitEntry } | null {
  if (!facts?.["us-gaap"]) return null;
  for (const tag of candidates) {
    const fact = facts["us-gaap"][tag];
    const entries = fact?.units?.USD;
    if (!entries || entries.length === 0) continue;
    // Most recent by `end` date
    const sorted = [...entries].sort((a, b) => (a.end < b.end ? 1 : -1));
    return { tag, entry: sorted[0] };
  }
  return null;
}

export const IMPORTANT_SEC_FORMS = new Set([
  "10-K",
  "10-Q",
  "8-K",
  "20-F",
  "6-K",
  "4",
  "S-1",
  "DEF 14A",
]);

export function buildSecPrimaryDocUrl(
  cik: string,
  accession: string,
  primaryDocument: string,
): string {
  const cikNum = String(parseInt(padCik(cik), 10));
  const accClean = accession.replace(/-/g, "");
  return `https://www.sec.gov/Archives/edgar/data/${cikNum}/${accClean}/${primaryDocument}`;
}

export function buildSecFilingIndexUrl(
  cik: string,
  accession: string,
): string {
  const cikNum = String(parseInt(padCik(cik), 10));
  const accClean = accession.replace(/-/g, "");
  return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cikNum}&type=&dateb=&owner=include&count=40&action=getcompany#${accClean}`;
}

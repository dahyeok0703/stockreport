/**
 * OpenDART (https://opendart.fss.or.kr/) 클라이언트.
 *
 * 사용 엔드포인트:
 *  - 공시검색:           /api/list.json
 *  - 기업개황:           /api/company.json
 *  - 단일회사 주요계정:  /api/fnlttSinglAcnt.json  (혹은 fnlttSinglAcntAll.json)
 *
 * 키가 없거나 호출 실패 시 throw — 호출부(stockDataService)가 fallback 합니다.
 */

import { getOpenDartApiKey } from "@/lib/config/env";
import { CACHE_TTL_SECONDS, getOrSetCache } from "@/lib/data/cache";
import {
  findStockMapping,
  getDartCorpCodeFromSeed,
} from "@/lib/data/stockMappings";
import { ExternalApiError, fetchExternal } from "@/lib/providers/http";

const BASE = "https://opendart.fss.or.kr/api";

export interface DartListItem {
  corp_code: string;
  corp_name: string;
  stock_code: string;
  rcept_no: string; // 14-digit receipt number, used to build viewer URL
  report_nm: string;
  rcept_dt: string; // yyyymmdd
  flr_nm?: string;
  rm?: string;
}

export interface DartListResponse {
  status: string; // "000" = OK
  message: string;
  list?: DartListItem[];
}

export interface DartCompanyResponse {
  status: string;
  message: string;
  corp_name?: string;
  corp_name_eng?: string;
  stock_code?: string;
  ceo_nm?: string;
  est_dt?: string;
  ind_tp?: string;
  bizr_no?: string;
  jurir_no?: string;
  adres?: string;
  hm_url?: string;
}

export interface DartAccountItem {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  sj_div: string; // BS, IS, CIS, CF
  sj_nm: string;
  account_nm: string;
  thstrm_nm: string;
  thstrm_amount: string;
  thstrm_add_amount?: string;
  frmtrm_nm?: string;
  frmtrm_amount?: string;
  bfefrmtrm_nm?: string;
  bfefrmtrm_amount?: string;
  ord: string;
  currency: string;
}

export interface DartAccountResponse {
  status: string;
  message: string;
  list?: DartAccountItem[];
}

export async function getDartCorpCodeByStockCode(
  stockCode: string,
): Promise<string | null> {
  // 1) Supabase 매핑 우선
  const mapping = await findStockMapping("kr", stockCode);
  if (mapping?.dart_corp_code) return mapping.dart_corp_code;

  // 2) seed mapping
  const seed = getDartCorpCodeFromSeed(stockCode);
  if (seed) return seed;

  // 3) corpCode.xml 전체 다운로드는 ZIP 압축 해제가 필요해 무거움.
  //    1단계 C에서는 SEED + 테이블에 한정하고, 추후 단계에서 ETL 잡으로 처리.
  return null;
}

export function dartViewerUrl(rceptNo: string): string {
  return `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rceptNo}`;
}

function yyyymmdd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function assertKey(): string {
  const key = getOpenDartApiKey();
  if (!key) {
    throw new ExternalApiError(
      "OpenDART API key is not configured",
      undefined,
      "opendart",
    );
  }
  return key;
}

/**
 * 최근 N일간 공시 목록.
 */
export async function fetchDartDisclosures(
  corpCode: string,
  options: { days?: number; pageCount?: number } = {},
): Promise<DartListItem[]> {
  const key = assertKey();
  const days = options.days ?? 90;
  const pageCount = options.pageCount ?? 20;

  const end = new Date();
  const begin = new Date();
  begin.setDate(end.getDate() - days);

  const params = new URLSearchParams({
    crtfc_key: key,
    corp_code: corpCode,
    bgn_de: yyyymmdd(begin),
    end_de: yyyymmdd(end),
    page_no: "1",
    page_count: String(pageCount),
  });

  const url = `${BASE}/list.json?${params.toString()}`;
  const cacheKey = `dart:disclosures:${corpCode}:${days}`;

  return getOrSetCache<DartListItem[]>(
    cacheKey,
    "opendart",
    "/api/list.json",
    { corpCode, days },
    CACHE_TTL_SECONDS.dartDisclosures,
    async () => {
      const data = await fetchExternal<DartListResponse>(url);
      if (data.status !== "000" && data.status !== "013") {
        // 013 = "조회된 데이터가 없습니다" → list 없음으로 처리
        throw new ExternalApiError(
          `OpenDART list error: ${data.status} ${data.message}`,
          undefined,
          "opendart",
        );
      }
      return data.list ?? [];
    },
  );
}

export async function fetchDartCompanyOverview(
  corpCode: string,
): Promise<DartCompanyResponse | null> {
  const key = assertKey();
  const params = new URLSearchParams({
    crtfc_key: key,
    corp_code: corpCode,
  });
  const url = `${BASE}/company.json?${params.toString()}`;
  const cacheKey = `dart:company:${corpCode}`;

  return getOrSetCache<DartCompanyResponse | null>(
    cacheKey,
    "opendart",
    "/api/company.json",
    { corpCode },
    CACHE_TTL_SECONDS.dartFinancials,
    async () => {
      const data = await fetchExternal<DartCompanyResponse>(url);
      if (data.status !== "000") {
        throw new ExternalApiError(
          `OpenDART company error: ${data.status} ${data.message}`,
          undefined,
          "opendart",
        );
      }
      return data;
    },
  );
}

/**
 * 단일회사 주요계정 — 사업/반기/분기 보고서의 주요 재무 항목.
 * reportCode: 11011=사업보고서(연간), 11012=반기보고서, 11013=1Q, 11014=3Q
 */
export async function fetchDartFinancialStatements(
  corpCode: string,
  year: number,
  reportCode: "11011" | "11012" | "11013" | "11014" = "11011",
): Promise<DartAccountItem[]> {
  const key = assertKey();
  const params = new URLSearchParams({
    crtfc_key: key,
    corp_code: corpCode,
    bsns_year: String(year),
    reprt_code: reportCode,
  });
  const url = `${BASE}/fnlttSinglAcnt.json?${params.toString()}`;
  const cacheKey = `dart:fnlttSinglAcnt:${corpCode}:${year}:${reportCode}`;

  return getOrSetCache<DartAccountItem[]>(
    cacheKey,
    "opendart",
    "/api/fnlttSinglAcnt.json",
    { corpCode, year, reportCode },
    CACHE_TTL_SECONDS.dartFinancials,
    async () => {
      const data = await fetchExternal<DartAccountResponse>(url);
      if (data.status !== "000") {
        // 013 (조회된 데이터 없음)도 빈 배열로 정상 처리
        if (data.status === "013") return [];
        throw new ExternalApiError(
          `OpenDART fnlttSinglAcnt error: ${data.status} ${data.message}`,
          undefined,
          "opendart",
        );
      }
      return data.list ?? [];
    },
  );
}

/**
 * 종목 매핑 (한국 종목코드 ↔ DART corp_code, 미국 ticker ↔ SEC CIK).
 *
 * 우선순위:
 *  1) Supabase `stock_mappings` 테이블 (서비스 운영 데이터)
 *  2) 코드 내 SEED_MAPPINGS (테이블이 비어있어도 1단계 C 데모 종목은 동작)
 *  3) mockStocks fallback (메타 정보만)
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StockMarket } from "@/lib/providers/types";

export interface StockMapping {
  market: StockMarket;
  symbol: string;
  name: string;
  exchange: string | null;
  country: "한국" | "미국";
  sector: string | null;
  industry: string | null;
  dart_corp_code: string | null;
  sec_cik: string | null;
}

const SEED_MAPPINGS: StockMapping[] = [
  // 한국 (corp_code 출처: OpenDART corpCode.xml — 공개 데이터)
  {
    market: "kr",
    symbol: "005930",
    name: "삼성전자",
    exchange: "KRX",
    country: "한국",
    sector: "IT",
    industry: "반도체·전자제품",
    dart_corp_code: "00126380",
    sec_cik: null,
  },
  {
    market: "kr",
    symbol: "035420",
    name: "NAVER",
    exchange: "KRX",
    country: "한국",
    sector: "커뮤니케이션서비스",
    industry: "인터넷·플랫폼",
    dart_corp_code: "00266961",
    sec_cik: null,
  },
  {
    market: "kr",
    symbol: "005380",
    name: "현대차",
    exchange: "KRX",
    country: "한국",
    sector: "경기소비재",
    industry: "자동차",
    dart_corp_code: "00164742",
    sec_cik: null,
  },
  {
    market: "kr",
    symbol: "035720",
    name: "카카오",
    exchange: "KRX",
    country: "한국",
    sector: "커뮤니케이션서비스",
    industry: "인터넷·플랫폼",
    dart_corp_code: "00258801",
    sec_cik: null,
  },
  // 미국 (CIK 출처: SEC EDGAR company_tickers.json)
  {
    market: "us",
    symbol: "AAPL",
    name: "Apple",
    exchange: "NASDAQ",
    country: "미국",
    sector: "Technology",
    industry: "Consumer Electronics",
    dart_corp_code: null,
    sec_cik: "0000320193",
  },
  {
    market: "us",
    symbol: "NVDA",
    name: "Nvidia",
    exchange: "NASDAQ",
    country: "미국",
    sector: "Technology",
    industry: "Semiconductors",
    dart_corp_code: null,
    sec_cik: "0001045810",
  },
  {
    market: "us",
    symbol: "TSLA",
    name: "Tesla",
    exchange: "NASDAQ",
    country: "미국",
    sector: "Consumer Discretionary",
    industry: "Auto Manufacturers",
    dart_corp_code: null,
    sec_cik: "0001318605",
  },
  {
    market: "us",
    symbol: "PLTR",
    name: "Palantir",
    exchange: "NASDAQ",
    country: "미국",
    sector: "Technology",
    industry: "Software · Data Analytics",
    dart_corp_code: null,
    sec_cik: "0001321655",
  },
];

const seedIndex = new Map(
  SEED_MAPPINGS.map((m) => [`${m.market}:${m.symbol.toLowerCase()}`, m]),
);

export async function findStockMapping(
  market: StockMarket,
  symbol: string,
): Promise<StockMapping | null> {
  // 1) Supabase
  try {
    const supabase = createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("stock_mappings")
        .select(
          "market, symbol, name, exchange, country, sector, industry, dart_corp_code, sec_cik",
        )
        .eq("market", market)
        .eq("symbol", symbol)
        .maybeSingle();
      if (data) return data as StockMapping;
    }
  } catch {
    // fall through
  }

  // 2) Seed (코드 임베드)
  const fromSeed = seedIndex.get(`${market}:${symbol.toLowerCase()}`);
  return fromSeed ?? null;
}

export function listSeedMappings(market?: StockMarket): StockMapping[] {
  if (!market) return SEED_MAPPINGS;
  return SEED_MAPPINGS.filter((m) => m.market === market);
}

export function getDartCorpCodeFromSeed(symbol: string): string | null {
  return seedIndex.get(`kr:${symbol.toLowerCase()}`)?.dart_corp_code ?? null;
}

export function getCikFromSeed(ticker: string): string | null {
  return seedIndex.get(`us:${ticker.toLowerCase()}`)?.sec_cik ?? null;
}

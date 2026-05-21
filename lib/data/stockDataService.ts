/**
 * 종목 리포트 데이터 오케스트레이션.
 *
 * 입력:  market + symbol
 * 출력:  NormalizedStockReport (UI/API 모두 이 구조만 다룹니다)
 *
 * 절차:
 *   1) 매핑 조회 (Supabase → seed → mockStocks)
 *   2) 시장별 공시·재무 fetch (DART or SEC), 뉴스 fetch
 *   3) 실패한 섹션만 mock provider로 fallback
 *   4) dataStatus 집계 (real / partial / mock / error)
 */

import { getRuntimeFlags } from "@/lib/config/env";
import { findStockMapping } from "@/lib/data/stockMappings";
import {
  deriveDartEarnings,
  deriveSecEarnings,
  ensureNewsShape,
  normalizeDartDisclosure,
  normalizeDartFinancials,
  normalizeSecCompanyFacts,
  normalizeSecFilings,
} from "@/lib/data/normalize";
import {
  fetchDartCompanyOverview,
  fetchDartDisclosures,
  fetchDartFinancialStatements,
} from "@/lib/providers/opendart";
import { fetchSecCompanyFacts, fetchSecSubmissions } from "@/lib/providers/sec";
import { fetchNews } from "@/lib/providers/news";
import {
  getMockEarnings,
  getMockFilings,
  getMockFinancials,
  getMockNews,
  getMockStock,
  getMockSummary,
} from "@/lib/providers/mockProvider";
import type {
  DataSectionStatus,
  DataStatus,
  NormalizedEarnings,
  NormalizedFiling,
  NormalizedFinancialMetric,
  NormalizedNewsItem,
  NormalizedStock,
  NormalizedStockReport,
  SourceLinkRef,
  StockMarket,
} from "@/lib/providers/types";

function combineStatus(parts: DataStatus[]): DataStatus {
  if (parts.every((p) => p === "real")) return "real";
  if (parts.every((p) => p === "mock" || p === "error")) {
    return parts.includes("error") ? "error" : "mock";
  }
  return "partial";
}

function pickQuarterReportCode(date = new Date()): "11013" | "11012" | "11014" | "11011" {
  const m = date.getMonth() + 1;
  if (m >= 1 && m <= 4) return "11014"; // 3Q of prior year is usually latest
  if (m >= 5 && m <= 7) return "11013"; // 1Q
  if (m >= 8 && m <= 10) return "11012"; // 반기
  return "11014"; // 3Q
}

function logProviderError(label: string, err: unknown) {
  // eslint-disable-next-line no-console
  console.warn(`[stockDataService] ${label}:`, (err as Error)?.message ?? err);
}

export async function getStockReport(
  market: StockMarket,
  symbol: string,
): Promise<NormalizedStockReport | null> {
  const flags = getRuntimeFlags();
  const mapping = await findStockMapping(market, symbol);
  const mockStock = getMockStock(market, symbol);

  if (!mapping && !mockStock) return null;

  const stock: NormalizedStock = mockStock ?? {
    name: mapping!.name,
    symbol: mapping!.symbol,
    market: mapping!.market,
    exchange: mapping!.exchange,
    country: mapping!.country,
    sector: mapping!.sector,
    industry: mapping!.industry,
    description: null,
  };

  const warnings: string[] = [];

  // ----- Filings + Financials -----
  let filings: NormalizedFiling[] = [];
  let financials: NormalizedFinancialMetric[] = [];
  let earnings: NormalizedEarnings | null = null;
  let filingsStatus: DataStatus = "mock";
  let financialsStatus: DataStatus = "mock";
  let overviewStatus: DataStatus = "mock";

  if (market === "kr") {
    const corpCode = mapping?.dart_corp_code ?? null;
    if (flags.dart && corpCode) {
      // disclosures
      try {
        const raw = await fetchDartDisclosures(corpCode, { days: 90 });
        filings = raw.slice(0, 10).map(normalizeDartDisclosure);
        filingsStatus = filings.length ? "real" : "mock";
        if (!filings.length) filings = getMockFilings(market, symbol);
      } catch (e) {
        logProviderError("DART disclosures", e);
        warnings.push(
          "OpenDART 공시 데이터가 일시적으로 제공되지 않아 목업 데이터 또는 기존 저장 데이터를 표시합니다.",
        );
        filings = getMockFilings(market, symbol);
        filingsStatus = "error";
      }

      // overview
      try {
        const overview = await fetchDartCompanyOverview(corpCode);
        if (overview?.ind_tp && !stock.industry) stock.industry = overview.ind_tp;
        overviewStatus = overview ? "real" : "mock";
      } catch (e) {
        logProviderError("DART overview", e);
        overviewStatus = "error";
      }

      // financials — try this year, then last year as fallback
      try {
        const thisYear = new Date().getFullYear();
        const reportCode = pickQuarterReportCode();
        let items = await fetchDartFinancialStatements(
          corpCode,
          thisYear,
          reportCode,
        );
        if (!items.length) {
          items = await fetchDartFinancialStatements(
            corpCode,
            thisYear - 1,
            "11011",
          );
        }
        financials = normalizeDartFinancials(items);
        earnings = deriveDartEarnings(items) ?? getMockEarnings(market, symbol);
        financialsStatus = financials.length ? "real" : "mock";
        if (!financials.length) financials = getMockFinancials(market, symbol);
      } catch (e) {
        logProviderError("DART financials", e);
        warnings.push(
          "OpenDART 재무 데이터가 일시적으로 제공되지 않아 목업 데이터 또는 기존 저장 데이터를 표시합니다.",
        );
        financials = getMockFinancials(market, symbol);
        earnings = getMockEarnings(market, symbol);
        financialsStatus = "error";
      }
    } else {
      filings = getMockFilings(market, symbol);
      financials = getMockFinancials(market, symbol);
      earnings = getMockEarnings(market, symbol);
    }
  } else {
    const cik = mapping?.sec_cik ?? null;
    if (flags.sec && cik) {
      try {
        const sub = await fetchSecSubmissions(cik);
        filings = normalizeSecFilings(sub, cik, 10);
        filingsStatus = filings.length ? "real" : "mock";
        if (!filings.length) filings = getMockFilings(market, symbol);
        if (sub.sicDescription && !stock.industry) {
          stock.industry = sub.sicDescription;
        }
        overviewStatus = sub.name ? "real" : "mock";
      } catch (e) {
        logProviderError("SEC submissions", e);
        warnings.push(
          "SEC EDGAR 공시 데이터가 일시적으로 제공되지 않아 목업 데이터 또는 기존 저장 데이터를 표시합니다.",
        );
        filings = getMockFilings(market, symbol);
        filingsStatus = "error";
      }

      try {
        const facts = await fetchSecCompanyFacts(cik);
        financials = normalizeSecCompanyFacts(facts);
        earnings = deriveSecEarnings(facts) ?? getMockEarnings(market, symbol);
        financialsStatus = financials.length ? "real" : "mock";
        if (!financials.length) financials = getMockFinancials(market, symbol);
      } catch (e) {
        logProviderError("SEC companyfacts", e);
        warnings.push(
          "SEC EDGAR 재무 데이터가 일시적으로 제공되지 않아 목업 데이터 또는 기존 저장 데이터를 표시합니다.",
        );
        financials = getMockFinancials(market, symbol);
        earnings = getMockEarnings(market, symbol);
        financialsStatus = "error";
      }
    } else {
      filings = getMockFilings(market, symbol);
      financials = getMockFinancials(market, symbol);
      earnings = getMockEarnings(market, symbol);
    }
  }

  // ----- News -----
  let news: NormalizedNewsItem[] = [];
  let newsStatus: DataStatus = "mock";
  if (flags.newsProvider !== "mock") {
    try {
      const raw = await fetchNews({
        market,
        name: stock.name,
        symbol: stock.symbol,
      });
      news = ensureNewsShape(raw);
      newsStatus = news.length ? "real" : "mock";
      if (!news.length) news = getMockNews(market, symbol);
    } catch (e) {
      logProviderError("News provider", e);
      warnings.push("뉴스 데이터를 가져오지 못해 목업 뉴스를 표시합니다.");
      news = getMockNews(market, symbol);
      newsStatus = "error";
    }
  } else {
    news = getMockNews(market, symbol);
  }

  // ----- Source links -----
  const sourceLinks: SourceLinkRef[] = [];
  if (market === "kr") {
    sourceLinks.push({
      label: "OpenDART 회사 공시 검색",
      href: `https://dart.fss.or.kr/dsab007/main.do?textCrpNm=${encodeURIComponent(
        stock.name,
      )}`,
      category: "공시",
      provider: "opendart",
    });
  } else if (mapping?.sec_cik) {
    sourceLinks.push({
      label: "SEC EDGAR 회사 페이지",
      href: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${parseInt(mapping.sec_cik, 10)}&type=&dateb=&owner=include&count=40`,
      category: "공시",
      provider: "sec",
    });
  }
  sourceLinks.push({
    label: "뉴스 원문",
    href: "#",
    category: "뉴스",
    provider: "news",
  });

  const sectionStatus: DataSectionStatus = {
    filings: filingsStatus,
    financials: financialsStatus,
    news: newsStatus,
    overview: overviewStatus,
  };
  const dataStatus = combineStatus([
    filingsStatus,
    financialsStatus,
    newsStatus,
    overviewStatus,
  ]);

  return {
    stock,
    summary: getMockSummary(market, symbol),
    filings,
    news,
    financials,
    earnings,
    sourceLinks,
    dataStatus,
    sectionStatus,
    lastUpdated: new Date().toISOString(),
    warnings,
  };
}

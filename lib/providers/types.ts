/**
 * 외부 API → 스톡리포트 내부 포맷 통합 타입.
 * 어떤 provider를 쓰든 페이지·API는 이 타입만 다룹니다.
 */

export type StockMarket = "kr" | "us";

export type DataStatus = "mock" | "partial" | "real" | "error";

export interface NormalizedStock {
  name: string;
  symbol: string;
  market: StockMarket;
  exchange: string | null;
  country: "한국" | "미국";
  sector: string | null;
  industry: string | null;
  description: string | null;
}

export interface ImportantField {
  label: string;
  value: string;
}

export interface NormalizedFiling {
  id: string;
  title: string;
  formType: string;
  filingDate: string; // ISO yyyy-mm-dd
  reportDate?: string | null;
  source: "opendart" | "sec" | "mock";
  sourceUrl: string;
  rawSummary: string | null;
  importantFields: ImportantField[];
}

export interface NormalizedNewsItem {
  id: string;
  title: string;
  publisher: string | null;
  publishedAt: string; // ISO
  url: string;
  summary: string | null;
  relatedTickers: string[];
  keywords: string[];
}

export interface NormalizedFinancialMetric {
  label: string;
  value: string;
  unit: string | null;
  period: string | null;
  source: "opendart" | "sec" | "mock";
  rawName: string | null;
}

export interface NormalizedEarnings {
  period: string;
  revenue: NormalizedFinancialMetric | null;
  operatingProfit: NormalizedFinancialMetric | null;
  netProfit: NormalizedFinancialMetric | null;
  yoyRevenue?: string | null;
  yoyOperatingProfit?: string | null;
}

export interface SourceLinkRef {
  label: string;
  href: string;
  category: "공시" | "뉴스" | "실적" | "원문";
  provider: "opendart" | "sec" | "news" | "mock";
}

export interface DataSectionStatus {
  filings: DataStatus;
  financials: DataStatus;
  news: DataStatus;
  overview: DataStatus;
}

export interface NormalizedStockReport {
  stock: NormalizedStock;
  summary: string;
  filings: NormalizedFiling[];
  news: NormalizedNewsItem[];
  financials: NormalizedFinancialMetric[];
  earnings: NormalizedEarnings | null;
  sourceLinks: SourceLinkRef[];
  dataStatus: DataStatus;
  sectionStatus: DataSectionStatus;
  lastUpdated: string;
  warnings: string[];
}

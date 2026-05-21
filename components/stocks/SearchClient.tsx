"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mockStocks } from "@/lib/mockStocks";
import { getStockReportHref } from "@/lib/utils";
import WatchlistButton from "@/components/stocks/WatchlistButton";
import type {
  NormalizedStock,
  StockMarket,
} from "@/lib/providers/types";

type MarketFilter = "all" | StockMarket;
type SortKey = "name" | "market" | "popular";

const marketFilters: { value: MarketFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "kr", label: "한국" },
  { value: "us", label: "미국" },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "popular", label: "많이 조회된 종목 (데모)" },
  { value: "name", label: "이름순" },
  { value: "market", label: "시장순" },
];

// 데모용 "많이 조회된 종목" 가중치 — 결정론적.
function popularityWeight(symbol: string): number {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 17 + symbol.charCodeAt(i)) >>> 0;
  return h % 1000;
}

function detectIndustry(industry: string | null): string | null {
  if (!industry) return null;
  const s = industry.toLowerCase();
  if (s.includes("반도체") || s.includes("semicond")) return "반도체";
  if (s.includes("인터넷") || s.includes("플랫폼") || s.includes("internet")) return "인터넷·플랫폼";
  if (s.includes("자동차") || s.includes("auto")) return "자동차";
  if (s.includes("ai") || s.includes("software") || s.includes("voice") || s.includes("data analytics")) return "AI·소프트웨어";
  if (s.includes("2차전지") || s.includes("battery") || s.includes("전기차")) return "전기차·배터리";
  if (s.includes("바이오") || s.includes("제약") || s.includes("pharma") || s.includes("biolog")) return "바이오·헬스케어";
  if (s.includes("방산") || s.includes("항공우주") || s.includes("aerospace") || s.includes("defense")) return "방산·항공우주";
  if (s.includes("발전") || s.includes("smr") || s.includes("energy")) return "에너지·발전";
  if (s.includes("e-commerce") || s.includes("커머스") || s.includes("retail")) return "이커머스";
  if (s.includes("social") || s.includes("sns") || s.includes("advertising") || s.includes("광고")) return "광고·SNS";
  if (s.includes("cloud")) return "클라우드";
  return industry;
}

function buildIndustryList(stocks: NormalizedStock[]): string[] {
  const set = new Set<string>();
  for (const s of stocks) {
    const cat = detectIndustry(s.industry);
    if (cat) set.add(cat);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "ko"));
}

function mockToNormalized(): NormalizedStock[] {
  return (mockStocks ?? []).map((s) => ({
    name: s.name,
    symbol: s.symbol,
    market: s.market,
    exchange: s.exchange,
    country: s.country,
    sector: s.sector,
    industry: s.industry,
    description: s.description,
  }));
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initial = searchParams?.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [market, setMarket] = useState<MarketFilter>("all");
  const [industry, setIndustry] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [results, setResults] = useState<NormalizedStock[]>(mockToNormalized());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqIdRef = useRef(0);

  const industries = useMemo(() => buildIndustryList(results), [results]);

  // 쿼리/시장 변경 시 API 호출 (실패 시 로컬 fallback)
  useEffect(() => {
    const reqId = ++reqIdRef.current;
    setError(null);
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("query", query.trim());
        if (market !== "all") params.set("market", market);
        const res = await fetch(`/api/stocks/search?${params}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as {
          ok: boolean;
          results: NormalizedStock[];
        };
        if (reqId !== reqIdRef.current) return;
        if (data.ok) {
          setResults(data.results ?? []);
        } else {
          throw new Error("API returned ok: false");
        }
      } catch (e) {
        if (reqId !== reqIdRef.current) return;
        setError(
          e instanceof Error ? e.message : "검색 API 호출에 실패했습니다.",
        );
        const q = query.trim().toLowerCase();
        const local = mockToNormalized().filter((s) => {
          if (market !== "all" && s.market !== market) return false;
          if (!q) return true;
          return (
            s.name.toLowerCase().includes(q) ||
            s.symbol.toLowerCase().includes(q) ||
            (s.industry ?? "").toLowerCase().includes(q) ||
            (s.sector ?? "").toLowerCase().includes(q) ||
            (s.description ?? "").toLowerCase().includes(q)
          );
        });
        setResults(local);
      } finally {
        if (reqId === reqIdRef.current) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query, market]);

  const displayed = useMemo(() => {
    let r = results;
    if (industry !== "all") {
      r = r.filter((s) => detectIndustry(s.industry) === industry);
    }
    const sorted = [...r];
    if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else if (sort === "market") {
      sorted.sort((a, b) => {
        if (a.market === b.market) return a.name.localeCompare(b.name, "ko");
        return a.market.localeCompare(b.market);
      });
    } else {
      // popular
      sorted.sort((a, b) => popularityWeight(b.symbol) - popularityWeight(a.symbol));
    }
    return sorted;
  }, [results, industry, sort]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="종목명, 티커, 업종으로 검색하세요"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {marketFilters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setMarket(f.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  market === f.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
              업종
            </span>
            <FilterChip
              active={industry === "all"}
              onClick={() => setIndustry("all")}
            >
              전체
            </FilterChip>
            {industries.map((cat) => (
              <FilterChip
                key={cat}
                active={industry === cat}
                onClick={() => setIndustry(cat)}
              >
                {cat}
              </FilterChip>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">정렬</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {loading ? (
            <span className="text-slate-500">검색 중…</span>
          ) : (
            <>
              검색 결과{" "}
              <span className="font-semibold text-slate-900">
                {displayed.length}
              </span>
              건
            </>
          )}
        </p>
        <p className="text-xs text-slate-500">
          관심종목은 이 기기 브라우저에 저장됩니다 (데모 모드)
        </p>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          검색 API 호출 중 오류가 발생해 로컬 데이터로 표시했습니다 ({error}).
        </div>
      )}

      {!loading && displayed.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-slate-900">
            검색 결과가 없습니다.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            종목명 또는 티커를 다시 확인해 주세요.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((stock) => (
            <article
              key={`${stock.market}-${stock.symbol}`}
              className="card flex flex-col p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {stock.name}
                    </h3>
                    <span className="badge-outline">{stock.symbol}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="badge-brand">{stock.country}</span>
                    {stock.exchange && (
                      <span className="badge-slate">{stock.exchange}</span>
                    )}
                    {stock.industry && (
                      <span className="text-xs text-slate-500">
                        {stock.industry}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {stock.description && (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                  {stock.description}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between gap-2">
                <Link
                  href={getStockReportHref(stock.market, stock.symbol)}
                  className="btn-outline text-xs"
                >
                  리포트 보기
                </Link>
                <WatchlistButton
                  market={stock.market}
                  symbol={stock.symbol}
                  name={stock.name}
                  exchange={stock.exchange}
                  sector={stock.sector}
                  variant="compact"
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
        active
          ? "border-brand-600 bg-brand-50 text-brand-800"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

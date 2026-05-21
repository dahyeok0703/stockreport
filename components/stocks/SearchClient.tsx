"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mockStocks, type MarketCode } from "@/lib/mockStocks";
import { getStockReportHref } from "@/lib/utils";
import WatchlistButton from "@/components/stocks/WatchlistButton";

type Filter = "all" | MarketCode;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "kr", label: "한국" },
  { value: "us", label: "미국" },
];

interface SearchClientProps {
  isLoggedIn: boolean;
  watchlistKeys: string[];
}

export default function SearchClient({
  isLoggedIn,
  watchlistKeys,
}: SearchClientProps) {
  const searchParams = useSearchParams();
  const initial = searchParams?.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");

  const watchlistSet = useMemo(
    () => new Set(watchlistKeys),
    [watchlistKeys],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (mockStocks ?? []).filter((s) => {
      if (filter !== "all" && s.market !== filter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.symbol.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
  }, [query, filter]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:flex-row sm:items-center">
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
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                filter === f.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          검색 결과{" "}
          <span className="font-semibold text-slate-900">
            {filtered.length}
          </span>
          건
        </p>
        {!isLoggedIn && (
          <p className="text-xs text-slate-500">
            관심종목 저장은{" "}
            <Link
              href="/login?next=/search"
              className="font-medium text-brand-700 hover:underline"
            >
              로그인
            </Link>{" "}
            후 이용할 수 있습니다.
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm text-slate-600">
            검색 결과가 없습니다. 다른 종목명이나 티커로 시도해 보세요.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((stock) => {
            const key = `${stock.market}:${stock.symbol.toLowerCase()}`;
            const alreadyIn = watchlistSet.has(key);
            return (
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
                      <span className="badge-slate">{stock.exchange}</span>
                      <span className="text-xs text-slate-500">
                        {stock.industry}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                  {stock.description}
                </p>

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
                    initialInWatchlist={alreadyIn}
                    isLoggedIn={isLoggedIn}
                    variant="compact"
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

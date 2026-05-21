"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SectionTitle from "@/components/common/SectionTitle";
import StockCard from "@/components/stocks/StockCard";
import { mockStocks, type MarketCode } from "@/lib/mockStocks";

type Filter = "all" | MarketCode;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "kr", label: "한국" },
  { value: "us", label: "미국" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initial = searchParams?.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");

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
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm text-slate-600">
            검색 결과가 없습니다. 다른 종목명이나 티커로 시도해 보세요.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((stock) => (
            <StockCard
              key={`${stock.market}-${stock.symbol}`}
              stock={stock}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="종목 검색"
        title="종목명·티커·업종으로 검색"
        description="한국·미국 주식을 통합 검색합니다. 검색 결과에서 리포트로 바로 이동할 수 있습니다."
      />
      <Suspense
        fallback={
          <div className="mt-8 h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}

import Link from "next/link";
import type { Stock } from "@/lib/mockStocks";
import { getStockReportHref } from "@/lib/utils";

interface StockCardProps {
  stock: Stock;
}

export default function StockCard({ stock }: StockCardProps) {
  return (
    <article className="card flex flex-col p-5 transition hover:shadow-cardHover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{stock.name}</h3>
            <span className="badge-outline">{stock.symbol}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="badge-brand">{stock.country}</span>
            <span className="badge-slate">{stock.exchange}</span>
            <span className="text-xs text-slate-500">{stock.industry}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {stock.description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          업데이트 · {stock.lastUpdated}
        </span>
        <Link
          href={getStockReportHref(stock.market, stock.symbol)}
          className="btn-outline text-xs"
        >
          리포트 보기
        </Link>
      </div>
    </article>
  );
}

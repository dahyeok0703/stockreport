import type { PriceSnapshot } from "@/lib/mockStocks";
import {
  formatDemoChange,
  formatDemoPrice,
  formatDemoVolume,
} from "@/lib/priceSnapshot";

interface PriceSnapshotBoxProps {
  snap: PriceSnapshot;
}

export default function PriceSnapshotBox({ snap }: PriceSnapshotBoxProps) {
  const change = formatDemoChange(snap);
  const priceColor = change.isPositive
    ? "text-emerald-600"
    : change.isNegative
      ? "text-rose-600"
      : "text-slate-700";
  const chipColor = change.isPositive
    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
    : change.isNegative
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className={`text-3xl font-bold tabular-nums ${priceColor}`}>
              {formatDemoPrice(snap)}
            </span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-sm font-medium ${chipColor}`}
            >
              {change.abs} ({change.pct})
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            데이터 기준 · {snap.asOf}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-right sm:gap-6">
          <div>
            <p className="text-xs text-slate-500">거래량</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">
              {formatDemoVolume(snap)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">시가총액</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">
              {snap.marketCap}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

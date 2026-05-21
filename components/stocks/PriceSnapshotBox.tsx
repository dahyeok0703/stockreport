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
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            데모 가격 정보
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-3">
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
            데이터 기준 시각 · {snap.asOf}
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

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
        현재 표시되는 가격 정보는 데모 데이터입니다. 실제 시세 연동은 정식
        서비스 단계에서 제공될 예정입니다.
      </div>
    </section>
  );
}

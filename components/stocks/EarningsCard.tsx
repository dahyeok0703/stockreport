import type { EarningsItem } from "@/lib/mockStocks";

interface EarningsCardProps {
  earnings: EarningsItem;
}

export default function EarningsCard({ earnings }: EarningsCardProps) {
  const rows = [
    {
      label: "매출",
      value: earnings.revenue,
      yoy: earnings.yoyRevenue,
    },
    {
      label: "영업이익",
      value: earnings.operatingProfit,
      yoy: earnings.yoyOperatingProfit,
    },
    {
      label: "순이익",
      value: earnings.netProfit,
      yoy: undefined,
    },
  ];

  return (
    <article className="card p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          {earnings.period}
        </h3>
        <span className="badge-slate">목업 데이터</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-xs text-slate-500">{row.label}</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {row.value}
            </p>
            {row.yoy && (
              <p
                className={`mt-1 text-xs font-medium ${
                  row.yoy.startsWith("-")
                    ? "text-rose-600"
                    : "text-emerald-600"
                }`}
              >
                전년 동기 대비 {row.yoy}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          실적 관련 체크포인트
        </p>
        <ul className="mt-2 space-y-1.5">
          {earnings.checkpoints.map((c) => (
            <li
              key={c}
              className="flex items-start gap-2 text-sm text-slate-700"
            >
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

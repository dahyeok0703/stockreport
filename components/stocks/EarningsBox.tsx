import type { NormalizedEarnings } from "@/lib/providers/types";

interface EarningsBoxProps {
  earnings: NormalizedEarnings;
}

export default function EarningsBox({ earnings }: EarningsBoxProps) {
  const rows = [
    { label: "매출 / Revenue", metric: earnings.revenue, yoy: earnings.yoyRevenue },
    {
      label: "영업이익 / Operating Income",
      metric: earnings.operatingProfit,
      yoy: earnings.yoyOperatingProfit,
    },
    {
      label: "순이익 / Net Income",
      metric: earnings.netProfit,
      yoy: undefined,
    },
  ];

  return (
    <article className="card p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          최근 보고 기간 · {earnings.period}
        </h3>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-xs text-slate-500">{row.label}</p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {row.metric?.value ?? "데이터 없음"}
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
            {row.metric?.rawName && (
              <p className="mt-1 text-[10px] text-slate-400">
                태그: {row.metric.rawName}
              </p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

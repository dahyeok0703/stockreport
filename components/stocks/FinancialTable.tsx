import type { NormalizedFinancialMetric } from "@/lib/providers/types";

interface FinancialTableProps {
  metrics: NormalizedFinancialMetric[];
}

export default function FinancialTable({ metrics }: FinancialTableProps) {
  return (
    <div className="card overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-2 text-left">항목</th>
            <th className="px-4 py-2 text-right">값</th>
            <th className="px-4 py-2 text-left">기간</th>
            <th className="px-4 py-2 text-left">원본 태그</th>
            <th className="px-4 py-2 text-left">출처</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {metrics.map((m, i) => (
            <tr key={`${m.label}-${i}`}>
              <td className="px-4 py-2 font-medium text-slate-900">
                {m.label}
              </td>
              <td className="px-4 py-2 text-right tabular-nums text-slate-800">
                {m.value}
              </td>
              <td className="px-4 py-2 text-xs text-slate-500">
                {m.period ?? "—"}
              </td>
              <td className="px-4 py-2 text-xs text-slate-500">
                {m.rawName ?? "—"}
              </td>
              <td className="px-4 py-2 text-xs text-slate-500">{m.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

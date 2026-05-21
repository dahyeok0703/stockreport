import type { FinancialMetric } from "@/lib/mockStocks";

interface MetricCardProps {
  metric: FinancialMetric;
}

export default function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">{metric.label}</p>
        {metric.isReference && (
          <span className="badge-outline">참고</span>
        )}
      </div>
      <p className="mt-2 text-lg font-semibold text-slate-900">
        {metric.value}
      </p>
      {metric.note && (
        <p className="mt-1 text-xs text-slate-500">{metric.note}</p>
      )}
    </div>
  );
}

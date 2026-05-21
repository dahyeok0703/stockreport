import type { NormalizedFiling } from "@/lib/providers/types";

interface FilingCardProps {
  filing: NormalizedFiling;
}

export default function FilingCard({ filing }: FilingCardProps) {
  return (
    <article className="card p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <span className="badge-brand mt-0.5">{filing.formType}</span>
          <h3 className="text-base font-semibold text-slate-900">
            {filing.title}
          </h3>
        </div>
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {filing.filingDate}
          {filing.reportDate && filing.reportDate !== filing.filingDate
            ? ` · 보고기간 ${filing.reportDate}`
            : ""}
        </span>
      </div>

      {filing.rawSummary && (
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {filing.rawSummary}
        </p>
      )}

      {filing.importantFields.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filing.importantFields.map((f, i) => (
            <div
              key={`${f.label}-${i}`}
              className="rounded-md bg-slate-50 px-3 py-2 text-xs"
            >
              <span className="text-slate-500">{f.label}: </span>
              <span className="font-medium text-slate-800">{f.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-500">출처: {filing.source}</span>
        {filing.sourceUrl && filing.sourceUrl !== "#" ? (
          <a
            href={filing.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-700 hover:text-brand-900 hover:underline"
          >
            원문 보기 →
          </a>
        ) : (
          <span className="text-slate-400">직접 링크 없음</span>
        )}
      </div>
    </article>
  );
}

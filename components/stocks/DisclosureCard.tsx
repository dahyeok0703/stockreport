import type { Disclosure } from "@/lib/mockStocks";

interface DisclosureCardProps {
  disclosure: Disclosure;
}

export default function DisclosureCard({ disclosure }: DisclosureCardProps) {
  return (
    <article className="card p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          {disclosure.title}
        </h3>
        <span className="text-xs text-slate-500">{disclosure.date}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        {disclosure.summary}
      </p>
      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          확인할 항목
        </p>
        <ul className="mt-2 space-y-1.5">
          {disclosure.checkpoints.map((c) => (
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
      <div className="mt-4">
        <a
          href={disclosure.sourceUrl}
          className="text-xs font-medium text-brand-700 hover:text-brand-900 hover:underline"
        >
          공시 원문 보기 →
        </a>
      </div>
    </article>
  );
}

import type { NormalizedNewsItem } from "@/lib/providers/types";

interface NormalizedNewsCardProps {
  news: NormalizedNewsItem;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function NormalizedNewsCard({ news }: NormalizedNewsCardProps) {
  return (
    <article className="card p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          {news.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
          {news.publisher && <span>{news.publisher}</span>}
          {news.publisher && news.publishedAt && (
            <span aria-hidden>·</span>
          )}
          <span>{formatDate(news.publishedAt)}</span>
        </div>
      </div>
      {news.summary && (
        <p className="mt-2 text-sm leading-6 text-slate-700">{news.summary}</p>
      )}
      {news.keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {news.keywords.slice(0, 6).map((k) => (
            <span key={k} className="badge-slate">
              #{k}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4">
        {news.url && news.url !== "#" ? (
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-brand-700 hover:text-brand-900 hover:underline"
          >
            뉴스 원문 보기 →
          </a>
        ) : (
          <span className="text-xs text-slate-400">직접 링크 없음</span>
        )}
      </div>
    </article>
  );
}

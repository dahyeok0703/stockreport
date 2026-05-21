import type { NewsItem } from "@/lib/mockStocks";

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <article className="card p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          {news.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{news.press}</span>
          <span aria-hidden>·</span>
          <span>{news.date}</span>
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-700">{news.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {news.keywords.map((k) => (
          <span key={k} className="badge-slate">
            #{k}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <a
          href={news.sourceUrl}
          className="text-xs font-medium text-brand-700 hover:text-brand-900 hover:underline"
        >
          뉴스 원문 보기 →
        </a>
      </div>
    </article>
  );
}

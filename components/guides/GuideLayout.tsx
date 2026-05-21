import Link from "next/link";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import { findGuide, GUIDES } from "@/lib/guides";

interface GuideLayoutProps {
  slug: string;
  children: React.ReactNode;
}

export default function GuideLayout({ slug, children }: GuideLayoutProps) {
  const meta = findGuide(slug);
  const related = GUIDES.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <div className="container-page py-12 sm:py-16">
      <nav className="text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">
          홈
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/guides" className="hover:text-slate-900">
          가이드
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-900">{meta?.title ?? slug}</span>
      </nav>

      {meta && (
        <header className="mt-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-brand">{meta.category}</span>
            <span className="badge-slate">읽는 시간 {meta.readMinutes}분</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {meta.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {meta.description}
          </p>
        </header>
      )}

      <article className="prose mt-8 max-w-3xl text-[15px] leading-7 text-slate-800">
        {children}
      </article>

      {/* CTA */}
      <div className="mt-10 max-w-3xl rounded-xl border border-brand-200 bg-brand-50 p-5">
        <p className="text-sm font-semibold text-brand-900">
          스톡리포트에서 종목별 공시·뉴스·실적을 한 페이지에서 확인해 보세요.
        </p>
        <p className="mt-1 text-sm leading-6 text-brand-900/90">
          매수·매도 권유 없이, 투자자가 직접 판단할 수 있는 정보를 정리해
          제공합니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/search" className="btn-primary text-sm">
            종목 검색으로 이동
          </Link>
          <Link href="/guides" className="btn-outline text-sm">
            다른 가이드 보기
          </Link>
        </div>
      </div>

      {/* Related guides */}
      {related.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h3 className="text-lg font-bold text-slate-900">함께 읽으면 좋은 글</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="card flex flex-col p-4 transition hover:shadow-cardHover"
              >
                <div className="flex items-center gap-2">
                  <span className="badge-brand">{g.category}</span>
                  <span className="text-xs text-slate-500">
                    {g.readMinutes}분
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {g.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {g.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 max-w-3xl">
        <DisclaimerBox />
      </div>
    </div>
  );
}

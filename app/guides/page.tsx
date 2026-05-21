import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import { GUIDES } from "@/lib/guides";

export const metadata = {
  title: "주식 정보 가이드 | 스톡리포트",
  description:
    "공시, 실적, 재무 정보를 어떻게 읽으면 좋은지 정리한 가이드 모음입니다. 매수·매도 권유 없이, 투자자가 직접 판단할 수 있도록 자료 읽는 법을 설명합니다.",
  robots: { index: false, follow: false },
};

export default function GuidesIndexPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <SectionTitle
        eyebrow="가이드"
        title="공시·실적·재무 자료 읽는 법"
        description="투자 추천 대신, 어떤 자료를 어떻게 읽어야 하는지 정리합니다. 모든 글은 정보 제공용 자료입니다."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="card flex flex-col p-6 transition hover:shadow-cardHover"
          >
            <div className="flex items-center gap-2">
              <span className="badge-brand">{g.category}</span>
              <span className="badge-slate">{g.readMinutes}분</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">
              {g.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">
              {g.description}
            </p>
            <span className="mt-4 text-xs font-medium text-brand-700">
              자세히 보기 →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <DisclaimerBox />
      </div>
    </div>
  );
}

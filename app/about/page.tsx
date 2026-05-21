import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";

const principles = [
  {
    title: "추천이 아닌 정리",
    body: "매수·매도·목표가 같은 판단성 표현 대신, 공시·뉴스·실적의 핵심을 정리해 제공합니다.",
  },
  {
    title: "원문 기반",
    body: "모든 요약은 공시·뉴스·실적자료 등 원문을 기반으로 작성되며, 원문 링크를 함께 제공합니다.",
  },
  {
    title: "사용자가 직접 판단",
    body: "투자 판단과 그 결과의 책임은 사용자에게 있습니다. 우리는 그 판단의 재료를 정리합니다.",
  },
];

const roadmap = [
  {
    phase: "1단계 A",
    title: "프론트엔드 골격 + 목업 리포트",
    state: "진행 중",
    items: ["페이지 구조 및 컴포넌트 설계", "목업 종목 리포트 화면"],
  },
  {
    phase: "1단계 B",
    title: "로그인 + 관심종목 저장",
    state: "예정",
    items: ["이메일/소셜 로그인", "관심종목 저장 및 알림 준비"],
  },
  {
    phase: "2단계",
    title: "공시·뉴스·실적 데이터 연동",
    state: "예정",
    items: ["DART(한국)·SEC EDGAR(미국) 공시 연동", "뉴스 API 연동"],
  },
  {
    phase: "3단계",
    title: "AI 요약 + 결제 + 알림",
    state: "예정",
    items: [
      "AI 기반 요약 자동 생성",
      "결제 시스템 연동",
      "공시 발생·실적 발표 알림",
    ],
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-16 sm:py-20">
          <SectionTitle
            eyebrow="서비스 소개"
            title="스톡리포트는 어떤 서비스인가요?"
            description="한국과 미국 주식의 공시·뉴스·실적 정보를 AI가 정리해주는 정보 제공 서비스입니다. 매수·매도 권유는 하지 않습니다."
          />
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="card p-6">
            <h3 className="text-base font-semibold text-slate-900">
              왜 공시를 봐야 하나요?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              공시는 기업이 공식적으로 발표하는 자료입니다. 주주환원·자기주식·자본
              변동·증자 등 회사의 주요 의사결정이 공시에 담깁니다.
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-base font-semibold text-slate-900">
              왜 뉴스를 함께 봐야 하나요?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              뉴스는 시장이 회사에 대해 어떻게 해석하고 있는지를 보여주는 자료입니다.
              공시와 함께 보면 정보의 맥락을 이해하는 데 도움이 됩니다.
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-base font-semibold text-slate-900">
              왜 실적을 함께 봐야 하나요?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              실적은 회사의 사업 흐름을 가장 직접적으로 보여주는 숫자입니다. 매출,
              영업이익, 순이익의 흐름과 함께 사업 구조의 변화를 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container-page py-12 sm:py-16">
          <SectionTitle
            eyebrow="원칙"
            title="중립적 정보 제공 원칙"
          />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {principles.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <SectionTitle
          eyebrow="지원 범위"
          title="한국·미국 주식 지원 계획"
          description="DART 공시(한국)와 SEC EDGAR 공시(미국)를 함께 다루는 통합형 정보 구조를 지향합니다."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-900">
              한국 주식
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              KRX·KOSDAQ 상장 종목 대상. DART 공시·국내 언론 보도·실적 자료를 함께
              요약할 예정입니다.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-900">
              미국 주식
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              NYSE·NASDAQ 상장 종목 대상. SEC EDGAR 공시(10-K, 10-Q, 8-K)와 주요
              영문 매체의 보도를 함께 요약할 예정입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="container-page py-12 sm:py-16">
          <SectionTitle eyebrow="로드맵" title="향후 로드맵" />
          <ol className="mt-8 space-y-4">
            {roadmap.map((r) => (
              <li
                key={r.phase}
                className="card flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:gap-6"
              >
                <div className="sm:w-32">
                  <span className="badge-brand">{r.phase}</span>
                  <p className="mt-2 text-xs text-slate-500">{r.state}</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    {r.title}
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {r.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-12">
        <DisclaimerBox />
      </section>
    </div>
  );
}

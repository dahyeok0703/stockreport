import SectionTitle from "@/components/common/SectionTitle";
import DisclaimerBox from "@/components/common/DisclaimerBox";
import PeixeLuaLogo from "@/components/brand/PeixeLuaLogo";
import { brandConfig } from "@/lib/brand";

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

const supportRange = [
  {
    title: "한국 주식",
    body: "KOSPI·KOSDAQ 상장 종목. DART 공시·국내 언론 보도·실적 자료를 함께 정리합니다.",
  },
  {
    title: "미국 주식",
    body: "NYSE·NASDAQ 상장 종목. SEC EDGAR 공시(10-K, 10-Q, 8-K)와 주요 영문 매체 보도를 함께 정리합니다.",
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
            description="한국과 미국 주식의 공시·뉴스·실적 정보를 한곳에 정리해 보여주는 정보 제공 서비스입니다. 매수·매도 권유는 하지 않습니다."
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
              실적은 회사의 사업 흐름을 가장 직접적으로 보여주는 숫자입니다. 매출·
              영업이익·순이익 흐름과 함께 사업 구조의 변화를 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container-page py-12 sm:py-16">
          <SectionTitle eyebrow="원칙" title="중립적 정보 제공 원칙" />
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
          title="한국·미국 주식을 함께"
          description="DART 공시(한국)와 SEC EDGAR 공시(미국)를 통합적으로 다루는 정보 구조를 지향합니다."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {supportRange.map((r) => (
            <div key={r.title} className="card p-5">
              <h3 className="text-base font-semibold text-slate-900">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="container-page py-12 sm:py-16">
          <SectionTitle
            eyebrow="운영사"
            title={`${brandConfig.companyNameKo} (${brandConfig.companyNameEn})`}
            description={`${brandConfig.serviceNameKo}는 ${brandConfig.companyNameKo}가 운영하는 한국·미국 주식 공시·뉴스·실적 정보 요약 웹사이트입니다.`}
          />

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="card flex flex-col p-6 md:col-span-2">
              <PeixeLuaLogo variant="full" size="large" />
              <p className="mt-4 text-sm leading-7 text-slate-700">
                {brandConfig.companyNameKo}는 게임, 웹서비스, 앱 등 다양한
                디지털 서비스를 개발·운영하는 창작형 기술 브랜드입니다.
                {brandConfig.serviceNameKo}는 그중 한국·미국 주식 정보를
                정리해서 보여주는 정보 제공 서비스로, 매수·매도 권유 없이
                투자자가 직접 판단할 수 있는 정보를 제공합니다.
              </p>
            </div>

            <div className="card p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                구조
              </h4>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="운영사" value={brandConfig.companyNameKo} />
                <Row label="영문 표기" value={brandConfig.companyNameEn} />
                <Row label="서비스명" value={brandConfig.serviceNameKo} />
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <DisclaimerBox />
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="min-w-[72px] text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
